// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface ICrops {
    event Init(uint256 indexed nftIndexes, uint256 indexed quantities);
    error Crops__InvalidArrayLenght(uint256 nftIndexes, uint256 quantities);
    error Crops__ArrayLengthZero();
}
