const {accounts, protocol, host, port, coinSCAddress, coinABI} = require('../config')
const util = require('wanchain-util')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(`${protocol}://${host}:${port}`));
web3.wan = new util.web3Wan(web3);

const promisify = (inner) => 
	new Promise((resolve, reject) =>
    	inner((err, res) => {
      		if (err) { 
      			console.log(err)
      			reject(err) 
      		}

      		resolve(res);
    	})
  	)

const unlockAccount = (account, pwd, duration) => 
	new Promise((resolve) => 
		resolve(web3.personal.unlockAccount(account, pwd, duration))
	)

const getBalance = (account) => 
	new Promise((resolve) => 
		resolve(web3.eth.getBalance(account))
	)

const sendTransaction = (obj) =>
	new Promise((resolve, reject) => {
		web3.eth.sendTransaction(obj, (err, hash) => {
			if (err) {
				console.log(err)
				reject(err)
			}

			resolve(hash)
		})
	})
	
const getReceipt = (txHash) => 
	new Promise((resolve, reject) => {
		web3.eth.getTransactionReceipt(txHash, (err, receipt) => {
			if (err) {
				console.log(err)
				reject(err)
			}

			resolve(receipt)
		})
	})

const getBlock = (state) => 
	new Promise((resolve, reject) => {
		web3.eth.getBlock(state, (err, ret) => {
			if (err) {
				console.log(err)
				reject(err)
			}

			resolve(ret)
		})
	})

const fromWei = (balance) => web3.fromWei(balance.toNumber())

const toWei = (value) => web3.toWei(value)

const getWanAddress = (addr) => 
	new Promise((resolve) => {
		resolve(web3.wan.getWanAddress(addr))
	})

const genOTA = (wanAddr) => 
	new Promise((resolve, reject) => {
		web3.wan.generateOneTimeAddress(wanAddr, (err, ret) => {
			if (err) {
				console.log("genOTA error: ", err)
				reject(err)
			}

			resolve(ret)
		})
	})

const getOTABalance = (ota, blockNumber) => 
	new Promise((resolve, reject) => {
		web3.wan.getOTABalance(ota, blockNumber, (err, ret) => {
			if (err) {
				console.log('getOTABalance error: ', err)
				reject(err)
			}

			resolve(ret)
		})
	})

const getOTAMixSet = (ota, qty) => 
	new Promise((resolve, reject) => {
		web3.wan.getOTAMixSet(ota, qty, (err, ret) => {
			if (err) {
				console.log('getOTAMixSet error: ', err)
				reject(err)
			}

			resolve(ret)
		})
	})	

const computeOTAPPKeys = (address, ota) => 
	new Promise((resolve, reject) => {
		web3.wan.computeOTAPPKeys(address, ota, (err, ret) => {
			if (err) {
				console.log('computeOTAPPKeys error: ', err)
				reject(err)
			}

			resolve(ret)
		})
	})

const genRingSignData = (msg, sk, data) => 
	new Promise((resolve, reject) => {
		web3.wan.genRingSignData(msg, sk, data, (err, ret) => {
			if (err) {
				console.log('genRingSignData error: ', err)
				reject(err)
			}

			resolve(ret)
		})
	})

const getBlockNumber = () => web3.eth.blockNumber

const coinSC = web3.eth.contract(coinABI).at(coinSCAddress)
	
const filter = web3.eth.filter('latest')

module.exports = {
	promisify,
	unlockAccount,
	sendTransaction,
	computeOTAPPKeys,
	getBalance,
	getWanAddress,
	genOTA,
	getOTABalance,
	getOTAMixSet,
	genRingSignData, 
	getReceipt,
	getBlock,
	getBlockNumber, 
	fromWei,
	toWei,
	filter,
	coinSC
}