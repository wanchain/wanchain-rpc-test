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
// 	recipient2BalanceAfter


// describe('Public Transaction', function() {
// 	before(async() => {
// 		await utils.unlockAccount(sender, "wanglu", 9999)
// 	})

// 	beforeEach(async() => {
// 		senderBalanceBefore = await utils.getBalance(sender)
//     	recipient1BalanceBefore = await utils.getBalance(recipient1)
// 	})

// 	it('should return correct balance of receipt1', async() => {

// 		const txObj = {
// 			from: sender,
// 			to: recipient1,
// 			value: utils.toWei(1)
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
// 				break
// 			}
// 		}
		
// 		senderBalanceAfter = await utils.getBalance(sender)
// 		recipient1BalanceAfter = await utils.getBalance(recipient1)

// 		assert.equal(utils.fromWei(recipient1BalanceAfter), utils.plus(utils.fromWei(recipient1BalanceBefore), 1))
//   	});
// })