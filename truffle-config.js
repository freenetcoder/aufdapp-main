require('babel-register');
require('babel-polyfill');
require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { API_KEY_LIVE, PRIVATE_KEY_LIVE} = process.env;

module.exports = {
  networks: {
    live: {
      provider: function() {
        return new HDWalletProvider(PRIVATE_KEY_LIVE, API_KEY_LIVE)
      }, 
      network_id: 1,
      gasPrice: web3.utils.toWei('33', 'gwei'),
      networkCheckTimeout: 1e9
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      version: "^0.6",
      //optimizer: {
      //  enabled: true,
       // runs: 200
      //},
      //evmVersion: "petersburg"
    }
  }
}
