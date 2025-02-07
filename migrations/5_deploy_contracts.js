
const AufToken = artifacts.require('AufToken')

const AufNFT = artifacts.require('AufNFT')
//0xF1A7A19029B66Bd8C01c74A93722a2B741A1E0Ca

const AufFarming = artifacts.require('AufFarming')
//0xBd7f800B7E54D3f78043A10d53Cc26FC42A3c697

const AufGame = artifacts.require('AufGame')

module.exports = async function(deployer, network, accounts) {
 

  // Deploy Auf
 // await deployer.deploy(AufToken)
  //const aufToken = await AufToken.deployed()

  // Deploy AufStaking
  //await deployer.deploy(AufStaking, AufToken.address)
  //const aufStaking = await AufStaking.deployed()

 //Deploy AufNFT
 // await deployer.deploy(AufNFT)
 // const aufNFT = await AufNFT.deployed()

  // Deploy AufStaking
  //await deployer.deploy(AufFarming, AufToken.address, AufNFT.address)
  //const aufFarming = await AufFarming.deployed()

    // Deploy AufGame
  await deployer.deploy(AufGame, AufToken.address, AufNFT.address)
  const aufGame = await AufGame.deployed()

}
