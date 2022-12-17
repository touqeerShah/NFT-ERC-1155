// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface INFTFarm {
    event AddNFTs(uint256 indexed ids, uint256 indexed totals);
    event StakeTokens(uint256 indexed amount);
    event ClaimNFTs(uint256 indexed nftIndexes, uint256 indexed quantities);
    event UnstakeTokens(address indexed user, uint256 indexed pointsDebt);

    error NFTFarm__StackAmountNotZero();
    error NFTFarm__NotEnoughCrops();
    error NFTFarm__InsufficientPoint();
    error NFTFarm__TransferFail();

    error NFTFarm__InvalidClamArrayLenght(uint256 nftIndexes, uint256 quantities);
    error NFTFarm__InvalidArrayLenght(uint256 ids, uint256 totals, uint256 prices);
}
