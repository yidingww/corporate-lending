const Web3 = require("web3")
const web3 = new Web3("http://localhost:8545")
const contract = require('@truffle/contract')
const MyContractJSON = require('../abis/CorporateLending.json')
const MyContract = contract(MyContractJSON)
MyContract.setProvider(web3.currentProvider)
MyContract.at("0x3AeCD3e69B15083d74Ea4e05812D16384C8FF478").then(instance=>console.log(instance.address))