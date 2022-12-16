// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DaiToken is ERC20, Ownable {
    uint8 public dec;

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _dec,
        uint256 _initialSupply
    ) ERC20(_name, _symbol) {
        dec = _dec;
        _mint(msg.sender, _initialSupply); // 1 million tokens
    }

    function decimals() public view override returns (uint8) {
        return dec;
    }
}
