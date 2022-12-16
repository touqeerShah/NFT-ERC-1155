let { networkConfig, developmentChains } = require("../helper.config.js")
let { verify } = require("../utils/verify")

require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments, getChainId, network }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts() // it will tell the who is going to deploy the contract
    const chainId = await getChainId()
    const ids = [1, 2, 3, 4]
    const totals = [1000, 500, 100, 1]
    log("------------- Crops Contract -------------------")

    const Crops = await deploy("Crops", {
        from: deployer,
        args: [
            "https://gateway.pinata.cloud/ipfs/QmaPzMSxXnNzh22A4XmSUpfenV56SjLeFQ1Kjtn5Q1i2SE/",
            ids,
            totals,
        ],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Crops NFT contract is deployed on local network to ${Crops.address} ${chainId}`)
    log(`Verfiy Smart Contract Crops`)
    if (!developmentChains.includes(network.name) && process.env.ETHERSCANAPIKEY) {
        await verify(Crops.address, [
            "https://gateway.pinata.cloud/ipfs/QmaPzMSxXnNzh22A4XmSUpfenV56SjLeFQ1Kjtn5Q1i2SE/",
            ids,
            totals,
        ])
    }
}
module.exports.tags = ["crop", "all"]
