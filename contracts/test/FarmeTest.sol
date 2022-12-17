// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import {NFTFarm} from "../core/NFTFarm.sol";
import {Crops} from "../core/Crops.sol";
import {DaiToken} from "../core/DaiToken.sol";

contract FarmTest {
    DaiToken public immutable token;
    Crops public immutable crops;
    NFTFarm public immutable farm;
    uint256[] private ids = [1, 2, 3, 4];
    uint256[] private totals = [1000, 500, 100, 1];
    uint256[] private _nftIndex = [1, 2];
    uint256[] private _total = [10, 20];
    uint256[] private _price = [1 wei, 2 wei];

    constructor() {
        string memory tokenName = "DAI";
        string memory tokenSymble = "DAI";
        uint8 tokendecimal = 18;
        uint256 tokenSupply = 100000000000000000000000;
        string
            memory uri = "https://gateway.pinata.cloud/ipfs/QmaPzMSxXnNzh22A4XmSUpfenV56SjLeFQ1Kjtn5Q1i2SE/";

        token = new DaiToken(tokenName, tokenSymble, tokendecimal, tokenSupply);
        crops = new Crops(uri, ids, totals);
        farm = new NFTFarm(1, token, crops);
        crops.setApprovalForAll(address(farm), true);

        farm.addNFTs(_nftIndex, _total, _price);
    }

    function addNFTs(
        uint256[] calldata _ids,
        uint256[] calldata _totals, // amount of NFTs deposited to farm (need to approve before)
        uint256[] calldata _prices
    ) public {
        farm.addNFTs(_ids, _totals, _prices);
    }

    function stakeTokens(uint256 _amount) public {
        farm.stakeTokens(_amount);
    }

    function claimNFTs(uint256[] calldata _nftIndexes, uint256[] calldata _quantities) public {
        farm.claimNFTs(_nftIndexes, _quantities);
    }

    function unstakeTokens() public {
        farm.unstakeTokens();
    }

    function echidna_void() public pure returns (bool) {
        return true;
    }
}
