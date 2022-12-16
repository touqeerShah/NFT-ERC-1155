const { ethers } = require("hardhat")

let { networkConfig, developmentChains } = require("../helper.config.js")
let { verify } = require("../utils/verify")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments, getChainId, network }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts() // it will tell the who is going to deploy the contract
    const chainId = await getChainId()
    const TOKEN_NAME = "DAI"
    const TOKEN_SYMBOL = "DAI"
    const TOKEN_DECIMALS = 18
    const TOKEN_INITIAL_SUPPLY = ethers.utils.parseEther("1000000000")
    log("---------------- DaiToken ----------------")

    log("Network is detected to be mock")
    const DaiToken = await deploy("DaiToken", {
        from: deployer,
        log: true,
        args: [TOKEN_NAME, TOKEN_SYMBOL, TOKEN_DECIMALS, TOKEN_INITIAL_SUPPLY],
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`PTNFT MarketPlace contract is deployed on local network to ${DaiToken.address} ${chainId}`)

    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(DaiToken.address, [])
    }
}
module.exports.tags = ["token", "all"]
