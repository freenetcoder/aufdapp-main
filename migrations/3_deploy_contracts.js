
const AufToken = artifacts.require('AufToken')

const AufStaking = artifacts.require('AufStaking')

const AufNFT = artifacts.require('AufNFT')
const AufFarming = artifacts.require('AufFarming')

module.exports = async function(deployer, network, accounts) {
 

  // Deploy Auf
 // await deployer.deploy(AufToken)
  //const aufToken = await AufToken.deployed()

  // Deploy AufStaking
  //await deployer.deploy(AufStaking, AufToken.address)
  //const aufStaking = await AufStaking.deployed()

 //Deploy AufNFT
  await deployer.deploy(AufNFT)
  const aufNFT = await AufNFT.deployed()

  // Deploy AufStaking
  //await deployer.deploy(AufFarming, AufToken.address, AufNFT.address)
  //const aufFarming = await AufFarming.deployed()

}
