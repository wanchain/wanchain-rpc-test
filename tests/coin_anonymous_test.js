// const {accounts, protocol, host, port, coinSCAddress, coinValue, waitBlockNumber, OTASetSize} = require('../config')
// const utils = require('../utils')
// const assert = require('chai').assert
// const should = require('chai').should()

// sender = accounts[0]
// recipient1 = accounts[1]

// let senderBalanceBefore, 
// 	recipient1BalanceBefore, 
// 	recipient2BalanceBefore, 
// 	senderBalanceAfter, 
// 	recipient1BalanceAfter, 
// 	recipient2BalanceAfter,
// 	wanAddr, 
// 	OTA, 
// 	OTABalance,
// 	ringSignData, 
// 	buyCoinData, 
// 	refundCoinData,
// 	blockNumber,
// 	OTAMixSet,
// 	keyPairs

// describe('Anonymous Coin Transfer', function() {
// 	before(async() => {
// 		await utils.unlockAccount(sender, "wanglu", 9999)
// 		await utils.unlockAccount(recipient1, "wanglu", 9999)
// 		wanAddr, OTA, OTABalance, ringSignData, buyCoinData, refundCoinData, blockNumber = ''
// 		OTAMixSet, keyPairs = []

// 		recipient1BalanceBefore = await utils.getBalance(recipient1)
// 	})

// 	it('should return wanaddress', async() => {
// 		wanAddr = await utils.getWanAddress(recipient1)
// 		wanAddr.should.be.a('string')
// 	})

// 	it('shoud generateOTA', async() => {
// 		OTA = await utils.genOTA(wanAddr)
// 		OTA.should.be.a('string')
// 	})

// 	it('should generate correct buyCoinData', () => {
// 		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
// 		buyCoinData.should.be.a('string')
// 	})

// 	it('should send correct quantity wan coin to OTA', async() => {
// 		const txObj = {
// 			from: sender,
// 			to: coinSCAddress,
// 			value: utils.toWei(coinValue),
// 			data: buyCoinData
// 		}

// 		const txHash = await utils.sendTransaction(txObj)

// 		let counter, receipt
// 		counter = 0
// 		while (counter < waitBlockNumber) {
// 			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
// 			receipt = await utils.getReceipt(txHash)
// 			if (!receipt) {
// 				counter++
// 			} else {
// 				blockNumber = utils.getBlockNumber()
// 				break
// 			}
// 		}

// 		OTABalance = await utils.getOTABalance(OTA, blockNumber)
// 		assert.equal(utils.fromWei(OTABalance), coinValue)

// 	})

// 	it('should generate an OTA mix set', async() => {
// 		OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize)
// 		assert.lengthOf(OTAMixSet, OTASetSize)
// 	})

// 	it('should generate key pairs', async() => {
// 		keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+')
// 		assert.lengthOf(keyPairs, 3)
// 	})

// 	it('should generate ringSignData', async() => {
// 		ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('+'))
// 		ringSignData.should.be.a('string')
// 	})

// 	it('should generate correct refundCoinData', () => {
// 		refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue))
// 		refundCoinData.should.be.a('string')
// 	})

// 	it('should refund correct quant wan coin from OTA', async() => {
// 		const txObj = {
// 			from: recipient1,
// 			to: coinSCAddress,
// 			data: refundCoinData
// 		}

// 		const txHash = await utils.sendTransaction(txObj)
// 		let counter, receipt
// 		counter = 0
// 		while (counter < waitBlockNumber) {
// 			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
// 			receipt = await utils.getReceipt(txHash)
// 			if (!receipt) {
// 				counter++
// 			} else {
// 				blockNumber = utils.getBlockNumber()
// 				break
// 			}
// 		}

// 		recipient1BalanceAfter = await utils.getBalance(recipient1)
// 		// assert.equal(Math.ceil(utils.fromWei(recipient1BalanceAfter)), Math.ceil(utils.fromWei(recipient1BalanceBefore)) + coinValue)
// 	})
// })
