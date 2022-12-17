#  Minting ERC1155 NFT and Farming






## Upgrade Contract 
- Universal Upgradeable Proxy Contract (UUPC)
```
yarn add @openzeppelin/contracts-upgradeable
npm i @openzeppelin/contracts-upgradeable
npm i @openzeppelin/hardhat-upgrades --save
```
- Transparent Contract Stander
- - It make contract upgrade umlimited is size, transparent and flexible      
- - This is more expense when you deploy it because you save all function into transparent contract and point multiple contract
- - It's allow to add remove multip function 
```
https://forum.openzeppelin.com/t/openzeppelin-upgrades-step-by-step-tutorial-for-hardhat/3580
https://docs.openzeppelin.com/upgrades-plugins/1.x/
https://github.com/wighawag/hardhat-deploy#deploying-and-upgrading-proxies
https://github.com/wighawag/template-ethereum-contracts/tree/examples/openzeppelin-proxies/deploy
```     


## Fuzz Test Result
chidna-test . --test-mode assertion --contract FarmTest   --config echidna.config.yml
Analyzing contract: /code/contracts/test/FarmeTest.sol:FarmTest
crops():  passed! 🎉
farm():  passed! 🎉
claimNFTs(uint256[],uint256[]):  passed! 🎉
addNFTs(uint256[],uint256[],uint256[]):  passed! 🎉
stakeTokens(uint256):  passed! 🎉
unstakeTokens():  passed! 🎉
token():  passed! 🎉
AssertionFailed(..):  passed! 🎉



















step 1 create folder
step 2 install hardhat
step 3 create empty project
ster 4 install following dependency



```
// javascript
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv

```

```
//typescript
yarn add --dev @nomiclabs/hardhat-ethers@npm:hardhat-deploy-ethers ethers @nomiclabs/hardhat-etherscan @nomiclabs/hardhat-waffle chai ethereum-waffle hardhat hardhat-contract-sizer hardhat-deploy hardhat-gas-reporter prettier prettier-plugin-solidity solhint solidity-coverage dotenv @typechain/ethers-v5 @typechain/hardhat @types/chai @types/node ts-node typechain typescript


```

step 5 create all ignore file
step 6 import required module in hardhat config file
step 7 create folder for contract, deploy, test
step 8 lottery contract

-   anyone can enter into lottery
-   random winner
-   generate random number -> chainlink
-   automatical trigger function when certain time occur

To used link Random number we have to link our account to it get subcribution code
tell which contract is going to used it.\

# hardhat short cut

yarn globa add hardhat-shorthand

# Solhint

Lining
it is tool help as to anaylsis the code for potential errors

yarn add solhint
yarn solhint init
yarn solhint folderpath/\*.sol

# Audit Code

https://github.com/PatrickAlphaC/hardhat-security-fcc
https://secureum.substack.com/p/audit-techniques-and-tools-101

tools
slither for contract check vernabilities
https://github.com/crytic/slither

if we used different version
pip3 install solc-select
solc-select use version

add this in package.json
"scripts": {
"slither": "slither . --solc-remaps '@openzeppelin=node*modules/@openzeppelin @chainlink=node_modules/@chainlink' --exclude naming-convention,external-function,low-level-calls",
"test": "hardhat test",
"test:staging": "hardhat test --network goerli",
"lint": "solhint 'contracts/*.sol'",
"lint:fix": "solhint 'contracts/\*\*/\_.sol' --fix",
"format": "prettier --write .",
"coverage": "hardhat coverage"
}

Trail of bits
it package of all tools which helps as to audit the code
https://github.com/trailofbits/eth-security-toolbox

we will do fuzzing testing with echidna
test are written in fuzzing folder and also add the below code in package.json
"toolbox": "docker run -it --rm -v $PWD:/src trailofbits/eth-security-toolbox",

https://github.com/crytic/echidna

following command will
echidna-test . --contract PTNFTMarketPlaceTest --config /src/contracts/test/fuzzing/config.yaml

"myth": "docker run -it --rm -v $PWD:/src mythril/myth"
docker run -v $(pwd):/tmp mythril/myth -l analyze /tmp/contracts/marketplace.sol
docker run -v $(pwd):/tmp mythril/myth analyze -a 0x2dBF2B2c25C165610F5b34dA41dC000D5d307509 --infura-id eb19eeafefff4d9eb07ed30adcad89a1
docker run -v $(pwd)/mythril-docs:/docs mythril/myth -v4 analyze -a 0x4CA40B854fe9021670f1094985E782ED97FEd365 --rpc infura-rinkeby --infura-id eb19eeafefff4d9eb07ed30adcad89a1 --execution-timeout 12000
docker run -v $(pwd)/mythril-docs-PTNFT:/docs mythril/myth -v4 analyze -a 0x12d0113fC6702d2247F5250e616966D94d0D75d3 --rpc infura-rinkeby --infura-id eb19eeafefff4d9eb07ed30adcad89a1 --execution-timeout 120

<!-- PTNFTMarketPlace 0x4CA40B854fe9021670f1094985E782ED97FEd365 -->
<!-- PTNFT 0x12d0113fC6702d2247F5250e616966D94d0D75d3 -->

manticore . --contract PTNFTMarketPlace --txlimit 1 --smt.solver all --quick-mode --lazy-evaluation --core.procs 1
