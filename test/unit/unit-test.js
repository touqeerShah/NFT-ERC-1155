const { expect, assert } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")

const { developmentChains } = require("../../helper.config")
const emissionRate = 1
const ids = [1, 2, 3, 4]
const totals = [1000, 500, 100, 1]
const prices = [tokens("3"), tokens("1"), tokens("5"), tokens("7")]
function tokens(n) {
    return ethers.utils.parseEther(n)
}
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFTFarm ", function () {
          let deployer, redeemer, daiToken, crops, nftFarm
          beforeEach(async function () {
              // deploy the contract on hard hardhat-deploy we will used
              // deployments -> it will run all the deployment script with tag
              ;[deployer, redeemer, _] = await ethers.getSigners()
              await deployments.fixture("all") // it will run all the deployment file tag == > all
              daiToken = await ethers.getContract("DaiToken") // Returns a new connection to the Raffle contract
              daiToken = daiToken.connect(deployer)
              //   console.log("Dai Token address = ", daiToken.address)

              crops = await ethers.getContract("Crops") // Returns a new connection to the Raffle contract
              crops = crops.connect(deployer)
              //   console.log("crops address = ", crops.address)

              nftFarm = await ethers.getContract("NFTFarm") // Returns a new connection to the Raffle contract
              nftFarm = nftFarm.connect(deployer)
              //   console.log("nftFarm address = ", nftFarm.address)
              //   console.log("nftFarm")
          })
          describe("Check Deployemtn", function () {
              it("check nft info array set", async function () {
                  let result = await nftFarm.nftCount()
                  assert.equal(result.toString(), ids.length.toString())
              })
              it("check emision rate", async () => {
                  const result = await nftFarm.emissionRate()
                  assert.equal(result.toString(), emissionRate.toString())
              })
              it("check ERC-1155 Crops NFT address", async () => {
                  const result = await nftFarm.crops()
                  assert.equal(result, crops.address)
              })
              it("check mDai token address", async () => {
                  const result = await nftFarm.token()
                  assert.equal(result, daiToken.address)
              })
          })
          describe("Farming", function () {
              it("check DAI Balance", async function () {
                  let result = await daiToken.balanceOf(redeemer.address)
                  const TransferAmount = ethers.utils.parseEther("100")

                  assert.equal(result.toString(), TransferAmount.toString())
              })
              it("check Add NFTs with uneven total NFT array", async function () {
                  await expect(nftFarm.addNFTs([1, 2, 3], [2, 2], [1, 1, 1])).to.be.revertedWith(
                      "NFTFarm__InvalidArrayLenght"
                  )
              })
              it("check Add NFTs with uneven Price NFT array", async function () {
                  await expect(nftFarm.addNFTs([1, 2, 3], [2, 2, 3], [1, 1])).to.be.revertedWith(
                      "NFTFarm__InvalidArrayLenght"
                  )
              })
              it("check Add NFTs with valid data", async function () {
                  await expect(nftFarm.addNFTs([1], [12], [tokens("3")])).to.emit(
                      nftFarm,
                      "AddNFTs"
                  )
              })
              it("check Crops contract Invalid Array Execption Works", async function () {
                  const { deploy } = deployments
                  await expect(
                      deploy("Crops", {
                          from: deployer.address,
                          args: [
                              "https://gateway.pinata.cloud/ipfs/QmaPzMSxXnNzh22A4XmSUpfenV56SjLeFQ1Kjtn5Q1i2SE/",
                              [0, 1],
                              [122],
                          ],
                          log: true,
                          waitConfirmations: 1,
                      })
                  ).to.be.revertedWith("Crops__InvalidArrayLenght")
              })
          })

          it("check Stake Token Amount Not Equal to Zero", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("0"))
              await expect(nftFarm.stakeTokens(tokens("0"))).to.be.revertedWith(
                  "NFTFarm__StackAmountNotZero"
              )
          })
          it("check Stake Token Transfer emit function", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await expect(nftFarm.stakeTokens(tokens("1"))).to.emit(nftFarm, "StakeTokens")
          })
          it("check Farm balance after Stake", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const finalFarmTokenBal = await daiToken.balanceOf(nftFarm.address)
              assert.equal(finalFarmTokenBal.toString(), tokens("1").toString())
          })
          it("check Farm balance after Stake", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const finalFarmTokenBal = await daiToken.balanceOf(nftFarm.address)
              assert.equal(finalFarmTokenBal.toString(), tokens("1").toString())
          })
          it("check Check Redeemer Point", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const iniPointsBal = await nftFarm.pointsBalance(redeemer.address)
              console.log("iniPointsBal = ", iniPointsBal.toString())

              //   await time.increase("700")
              network.provider.send("evm_increaseTime", [700 * 1])
              network.provider.send("evm_mine", [])
              const finalPointsBal = await nftFarm.pointsBalance(redeemer.address)
              console.log("finalPointsBal = ", finalPointsBal.toString())
              console.log("token sum", tokens("700").toString())
              assert.equal(
                  finalPointsBal.toString(),
                  (parseInt(iniPointsBal.toString()) + parseInt(tokens("700"))).toString()
              )

              //   expect(+finalPointsBal).to.equal(+iniPointsBal.toString() + +tokens("700").toString())
          })
          it("check Claim NFT with invalid Array Redeemer ", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const iniPointsBal = await nftFarm.pointsBalance(redeemer.address)

              //   await time.increase("700")
              network.provider.send("evm_increaseTime", [700 * 1])
              network.provider.send("evm_mine", [])
              const finalPointsBal = await nftFarm.pointsBalance(redeemer.address)
              await expect(nftFarm.claimNFTs([1, 2], [1])).to.be.revertedWith(
                  "NFTFarm__InvalidClamArrayLenght"
              )
              //   expect(+finalPointsBal).to.equal(+iniPointsBal.toString() + +tokens("700").toString())
          })
          it("check Claim NFT more Crop then farm own ", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const iniPointsBal = await nftFarm.pointsBalance(redeemer.address)

              //   await time.increase("700")
              network.provider.send("evm_increaseTime", [70 * 1])
              network.provider.send("evm_mine", [])
              const finalPointsBal = await nftFarm.pointsBalance(redeemer.address)
              await expect(nftFarm.claimNFTs([1, 2], [1, 200])).to.be.revertedWith(
                  "NFTFarm__NotEnoughCrops"
              )
              //   expect(+finalPointsBal).to.equal(+iniPointsBal.toString() + +tokens("700").toString())
          })
          it("check Claim NFT when you have less point ", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const iniPointsBal = await nftFarm.pointsBalance(redeemer.address)

              //   await time.increase("700")
              network.provider.send("evm_increaseTime", [1 * 1])
              network.provider.send("evm_mine", [])
              const finalPointsBal = await nftFarm.pointsBalance(redeemer.address)
              await expect(nftFarm.claimNFTs([1, 2], [1, 20])).to.be.revertedWith(
                  "NFTFarm__InsufficientPoint"
              )
              //   expect(+finalPointsBal).to.equal(+iniPointsBal.toString() + +tokens("700").toString())
          })
          it("check Claim NFT event Claim successful ", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const iniPointsBal = await nftFarm.pointsBalance(redeemer.address)

              //   await time.increase("700")
              network.provider.send("evm_increaseTime", [1000 * 1])
              network.provider.send("evm_mine", [])
              const finalPointsBal = await nftFarm.pointsBalance(redeemer.address)
              await expect(nftFarm.claimNFTs([1, 2], [1, 20])).to.emit(nftFarm, "ClaimNFTs")
              //   expect(+finalPointsBal).to.equal(+iniPointsBal.toString() + +tokens("700").toString())
          })
          it("check Unstack when you have onthing on stack  ", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await expect(nftFarm.unstakeTokens()).to.be.revertedWith(
                  "NFTFarm__StackAmountNotZero"
              )
          })
          it("check Unstack  ", async function () {
              nftFarm = nftFarm.connect(redeemer)
              daiToken = daiToken.connect(redeemer)
              await daiToken.approve(nftFarm.address, tokens("1"))
              await nftFarm.stakeTokens(tokens("1"))
              const iniTokenBal = await daiToken.balanceOf(redeemer.address)
              const stakedBal = (await nftFarm.userInfo(redeemer.address)).stakedAmount
              await nftFarm.unstakeTokens()
              const finalTokenBal = await daiToken.balanceOf(redeemer.address)
              assert.equal(
                  finalTokenBal.toString(),
                  (parseInt(iniTokenBal.toString()) + parseInt(stakedBal.toString())).toString()
              )
          })
          it("check DAI  Decimal ", async function () {
              daiToken = await daiToken.decimals()
              const TOKEN_DECIMALS = 18

              assert.equal(daiToken, TOKEN_DECIMALS)
          })
      })
