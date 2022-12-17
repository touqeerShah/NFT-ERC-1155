const { ethers } = require("hardhat")

let { networkConfig, developmentChains } = require("../helper.config.js")
let { verify } = require("../utils/verify")

require("dotenv").config()
function tokens(n) {
    return ethers.utils.parseEther(n)
}
module.exports = async ({ getNamedAccounts, deployments, getChainId, network }) => {
    const { deploy, log, get } = deployments
    const { deployer, redeemer } = await getNamedAccounts() // it will tell the who is going to deploy the contract
    const chainId = await getChainId()

    const emissionRate = 1
    const ids = [1, 2, 3, 4]
    const totals = [500, 100, 100, 1]
    const prices = [tokens("3"), tokens("1"), tokens("5"), tokens("7")]
    const TransferAmount = ethers.utils.parseEther("100")

    log("---------------- NFTFarm ----------------")
    log("---------------- Ger Token Contract Address ----------------")
    const DaiToken = await ethers.getContract("DaiToken") // Returns a new connection to the Raffle contract
    log("DaiToken Address ==> ", DaiToken.address)
    log("---------------- Ger Crops Contract Address ----------------")
    const Crops = await ethers.getContract("Crops") // Returns a new connection to the Raffle contract
    log("Crops Address ==> ", Crops.address)

    log("Network is detected to be mock")
    const NFTFarm = await deploy("NFTFarm", {
        from: deployer,
        log: true,
        args: [emissionRate, DaiToken.address, Crops.address],
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`NFTFarm contract is deployed on local network to ${NFTFarm.address} ${chainId}`)

    log("---------------- Approve crops on NFT farm ----------------")
    var transationResponse = await Crops.setApprovalForAll(NFTFarm.address, true)
    var reseipt = await transationResponse.wait(1)

    log("---------------- Add Crop to  NFT farm ----------------")
    const NFTFarmContract = await ethers.getContract("NFTFarm") // Returns a new connection to the Raffle contract

    transationResponse = await NFTFarmContract.addNFTs(ids, totals, prices)
    reseipt = await transationResponse.wait(1)

    log("---------------- Add Crop to  NFT farm ----------------")

    transationResponse = await DaiToken.transfer(redeemer, TransferAmount)
    reseipt = await transationResponse.wait(1)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(NFTFarm.address, [emissionRate, DaiToken.address, Crops.address])
    }
}
module.exports.tags = ["farme", "all"]
