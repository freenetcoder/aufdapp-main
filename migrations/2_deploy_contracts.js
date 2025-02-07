
const AufToken = artifacts.require('AufToken')

const AufStaking = artifacts.require('AufStaking')



module.exports = async function(deployer, network, accounts) {
 

  // Deploy Auf
  await deployer.deploy(AufToken)
  const aufToken = await AufToken.deployed()

  // Deploy AufStaking
  await deployer.deploy(AufStaking, AufToken.address)
  const aufStaking = await AufStaking.deployed()

}
