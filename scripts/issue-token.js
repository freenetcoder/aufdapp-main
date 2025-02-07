const AufStaking = artifacts.require('AufStaking')

module.exports = async function(callback) {
  let aufStaking = await AufStaking.deployed()
  await aufStaking.issueTokens_10()
  // Code
  console.log("Tokens issued!")
  callback()
}
