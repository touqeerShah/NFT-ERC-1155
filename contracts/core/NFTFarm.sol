// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;
import "./DaiToken.sol";
import "./Crops.sol";
import "../Interfaces/INFTFarm.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";

contract NFTFarm is INFTFarm, Ownable, ERC1155Holder {
    struct UserInfo {
        uint256 stakedAmount; // current amount of tokens staked
        uint256 lastUpdateAt; // timestamp for last details update (when pointsDebt calculated)
        uint256 pointsDebt; // total wei points collected before latest deposit.
    }

    struct NFTInfo {
        uint256 id; // NFT id
        uint256 remaining; // NFTs remaining to farm
        uint256 price; // points required to claim NFT
    }

    uint256 public emissionRate; // wei points (1 point = 10**18) generated per token per second staked
    DaiToken public token; // mock dai token being staked
    Crops public crops; // ERC-1155 NFT crops contract

    NFTInfo[] public nftInfo;
    mapping(address => UserInfo) public userInfo;

    constructor(uint256 _emissionRate, DaiToken _token, Crops _crops) {
        emissionRate = _emissionRate;
        token = _token;
        crops = _crops;
    }

    function addNFTs(
        uint256[] calldata _ids,
        uint256[] calldata _totals, // amount of NFTs deposited to farm (need to approve before)
        uint256[] calldata _prices
    ) external onlyOwner {
        if (_ids.length != _totals.length || _totals.length != _prices.length) {
            revert NFTFarm__InvalidArrayLenght(_ids.length, _totals.length, _prices.length);
        }
        crops.safeBatchTransferFrom(msg.sender, address(this), _ids, _totals, "");
        for (uint64 i = 0; i < _ids.length; i++) {
            nftInfo.push(NFTInfo({id: _ids[i], remaining: _totals[i], price: _prices[i]}));
        }
        emit AddNFTs(_ids.length, _totals.length);
    }

    function stakeTokens(uint256 _amount) external {
        if (_amount == 0) {
            revert NFTFarm__StackAmountNotZero();
        }
        bool result = token.transferFrom(msg.sender, address(this), _amount);
        if (!result) {
            revert NFTFarm__TransferFail();
        }
        UserInfo storage user = userInfo[msg.sender];

        // already deposited before
        if (user.stakedAmount != 0) {
            user.pointsDebt = pointsBalance(msg.sender);
        }
        user.stakedAmount += _amount;
        user.lastUpdateAt = block.timestamp;
        emit StakeTokens(_amount);
    }

    // claim nfts if points threshold reached
    function claimNFTs(uint256[] calldata _nftIndexes, uint256[] calldata _quantities) external {
        if (_nftIndexes.length != _quantities.length) {
            revert NFTFarm__InvalidClamArrayLenght(_nftIndexes.length, _quantities.length);
        }
        for (uint64 i = 0; i < _nftIndexes.length; i++) {
            NFTInfo memory nft = nftInfo[_nftIndexes[i]];
            uint256 cost = nft.price * _quantities[i];
            uint256 points = pointsBalance(msg.sender);
            if (nft.remaining < _quantities[i]) {
                revert NFTFarm__NotEnoughCrops();
            }
            if (points <= cost) {
                revert NFTFarm__InsufficientPoint();
            }
            UserInfo memory user = userInfo[msg.sender];
            // deduct points
            user.pointsDebt = points - cost;
            user.lastUpdateAt = block.timestamp;
            userInfo[msg.sender] = user;
            nft.remaining -= _quantities[i];
        }
        crops.safeBatchTransferFrom(address(this), msg.sender, _nftIndexes, _quantities, "");
        emit ClaimNFTs(_nftIndexes.length, _quantities.length);
    }

    function unstakeTokens() public {
        UserInfo memory user = userInfo[msg.sender];
        if (user.stakedAmount == 0) {
            revert NFTFarm__StackAmountNotZero();
        }

        bool result = token.transfer(msg.sender, user.stakedAmount);
        if (!result) {
            revert NFTFarm__TransferFail();
        }
        // update userInfo
        user.pointsDebt = pointsBalance(msg.sender);
        user.stakedAmount = 0;
        user.lastUpdateAt = block.timestamp;
        userInfo[msg.sender] = user;
        emit UnstakeTokens(msg.sender, user.pointsDebt);
    }

    function pointsBalance(address userAddress) public view returns (uint256) {
        UserInfo storage user = userInfo[userAddress];
        return (user.pointsDebt + (_unDebitedPoints(user)));
    }

    function _unDebitedPoints(UserInfo memory user) internal view returns (uint256) {
        return (block.timestamp - user.lastUpdateAt) * (emissionRate * user.stakedAmount);
    }

    function nftCount() public view returns (uint256) {
        return nftInfo.length;
    }
}
