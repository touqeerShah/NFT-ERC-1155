// SPDX-License-Identifier: MIT

pragma solidity ^0.8.10;
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ICrops} from "../Interfaces/ICrops.sol";

contract Crops is ICrops, ERC1155 {
    constructor(
        string memory _uri,
        uint256[] memory _nftIndexes,
        uint256[] memory _quantities
    ) ERC1155(_uri) {
        if (_nftIndexes.length != _quantities.length) {
            revert Crops__InvalidArrayLenght(_nftIndexes.length, _quantities.length);
        }
        if (_nftIndexes.length == 0) {
            revert Crops__ArrayLengthZero();
        }
        _mintBatch(msg.sender, _nftIndexes, _quantities, "");

        emit Init(_nftIndexes.length, _quantities.length);
    }
}
