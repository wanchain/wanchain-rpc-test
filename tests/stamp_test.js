// const {accounts, protocol, host, port, stampsValue, stampSCAddress, waitBlockNumber} = require('../config')
// const utils = require('../utils')
// const assert = require('chai').assert
// const expect = require('chai').expect
// const should = require('chai').should()

// sender = accounts[0]
// recipient1 = accounts[1]

// let senderBalanceBefore,
// 	recipient1BalanceBefore,
// 	recipient2BalanceBefore,
// 	senderBalanceAfter,
// 	recipient1BalanceAfter,
// 	recipient2BalanceAfter,
// 	OTAAltTokenBalance,

// 	tokenSender,
// 	tokenRecipient,

// 	wanAddr,
// 	wanAddrR,
// 	OTAStamp,
// 	OTAStampBalance,
// 	OTAAltTokenSender,
// 	OTAAltTokenRecipient,

// 	stampRingSignData,
// 	buyStampData,
// 	mintTokenData,
// 	refundCoinData,
// 	combinedData,

// 	blockNumber,
// 	StampOTAMixSet,

// 	KPsOTAStamp,
// 	KPsOTAAltTokenSender,
// 	KPsOTAAltTokenRecipient,

// 	skOTAStamp,
// 	skOTAAltTokenSender,
// 	skOTAAltTokenRecipient


// describe('Anonymous Alt-Token Transfer', function() {
// 	before(async() => {
// 		await utils.unlockAccount(sender, "wanglu", 9999)
// 		await utils.unlockAccount(recipient1, "wanglu", 9999)

// 		tokenSender,
// 		tokenRecipient,
// 		wanAddr,
// 		wanAddrR,
// 		OTAStamp,
// 		OTAStampBalance,
// 		OTAAltTokenSender,
// 		OTAAltTokenRecipient,
// 		combinedData,
// 		stampRingSignData,
// 		buyStampData,
// 		mintTokenData,
// 		refundCoinData,
// 		blockNumber,
// 		skOTAStamp,
// 		skOTAAltTokenSender,
// 		skOTAAltTokenRecipient = ''

// 		StampOTAMixSet,
// 		KPsOTAStamp,
// 		KPsOTAAltTokenSender,
// 		KPsOTAAltTokenRecipient = []

// 		recipient1BalanceBefore = await utils.getBalance(recipient1)
// 	})

// 	beforeEach(() => {

// 	})

// 	it("should return sender's and recipient's wanchain addressess", async() => {
// 		wanAddr = await utils.getWanAddress(sender)
// 		wanAddrR = await utils.getWanAddress(recipient1)

// 		wanAddr.should.be.a('string')
// 		wanAddrR.should.be.a('string')
// 	})


// 	it("should buy stamp normal", async() => {

// 		for (i=0;i<stampsValue.length;i++) {
// 			console.log("index=" + i)
//       OTAStamp = await utils.genOTA(wanAddr)
//       OTAAltTokenSender = await utils.genOTA(wanAddr)
//       OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//       OTAStamp.should.be.a('string')
//       OTAAltTokenSender.should.be.a('string')
//       OTAAltTokenRecipient.should.be.a('string')

//       stampFaceValue = stampsValue[i]
//       buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//       buyStampData.should.be.a('string')


//       const txObj = {
//         from: sender,
//         to: stampSCAddress,
//         value: utils.toWei(stampFaceValue),
//         data: buyStampData
//       }

//       const txHash = await utils.sendTransaction(txObj)

//       let counter, receipt
//       counter = 0
//       while (counter < waitBlockNumber) {
//         let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
//         receipt = await utils.getReceipt(txHash)
//         if (!receipt) {
//           counter++
//         } else {
//           blockNumber = utils.getBlockNumber()
//           break
//         }
//       }

//       OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
//       assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)
//     }

// 	})

//   it("TC2006", async() => {
//  			i = 0
//       console.log("index=" + i)
//       OTAStamp = await utils.genOTA(wanAddr)
//       OTAAltTokenSender = await utils.genOTA(wanAddr)
//       OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//       OTAStamp.should.be.a('string')
//       OTAAltTokenSender.should.be.a('string')
//       OTAAltTokenRecipient.should.be.a('string')

//       stampFaceValue = stampsValue[i]
//       buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//       buyStampData.should.be.a('string')


//       const txObj = {
//         to: stampSCAddress,
//         value: utils.toWei(stampFaceValue),
//         data: buyStampData
//       }

//       try {
//         const txHash = await utils.sendTransaction(txObj)
//       } catch(e) {
//  				exception = e;
// 			}

// 			assert(exception != null, 'exception is not null');
//  			assert(exception.message == 'invalid address', 'exception is : invalid address');

//   })


//   it("TC2007", async() => {
//     i = 0
//     console.log("index=" + i)
//     OTAStamp = await utils.genOTA(wanAddr)
//     OTAAltTokenSender = await utils.genOTA(wanAddr)
//     OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//     OTAStamp.should.be.a('string')
//     OTAAltTokenSender.should.be.a('string')
//     OTAAltTokenRecipient.should.be.a('string')

//     stampFaceValue = stampsValue[i]
//     buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//     buyStampData.should.be.a('string')


//     const txObj = {
//       from:"",
//       to: stampSCAddress,
//       value: utils.toWei(stampFaceValue),
//       data: buyStampData
//     }

//     try {
//       const txHash = await utils.sendTransaction(txObj)
//     } catch(e) {
//       exception = e;
//     }

//     assert(exception != null, 'exception is not null');
//     assert(exception.message == 'invalid address', 'exception is : invalid address');

//   })


//   it("TC2008", async() => {
//     i = 0
//     console.log("index=" + i)
//     OTAStamp = await utils.genOTA(wanAddr)
//     OTAAltTokenSender = await utils.genOTA(wanAddr)
//     OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//     OTAStamp.should.be.a('string')
//     OTAAltTokenSender.should.be.a('string')
//     OTAAltTokenRecipient.should.be.a('string')

//     stampFaceValue = stampsValue[i]
//     buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//     buyStampData.should.be.a('string')


//     const txObj = {
//       from:sender.substr(0,sender.length - 2) ,
//       to: stampSCAddress,
//       value: utils.toWei(stampFaceValue),
//       data: buyStampData
//     }

//     try {
//       const txHash = await utils.sendTransaction(txObj)
//     } catch(e) {
//       exception = e;
//     }

//     assert(exception != null, 'exception is not null');
//     assert(exception.message == 'invalid address', 'exception is : invalid address');

//   })


//   it("TC2009", async() => {
//     i = 0
//     console.log("index=" + i)
//     OTAStamp = await utils.genOTA(wanAddr)
//     OTAAltTokenSender = await utils.genOTA(wanAddr)
//     OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//     OTAStamp.should.be.a('string')
//     OTAAltTokenSender.should.be.a('string')
//     OTAAltTokenRecipient.should.be.a('string')

//     stampFaceValue = stampsValue[i]
//     buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//     buyStampData.should.be.a('string')


//     const txObj = {
//     	from:sender+ "00",
//       to: stampSCAddress,
//       value: utils.toWei(stampFaceValue),
//       data: buyStampData
//     }

//     try {
//       const txHash = await utils.sendTransaction(txObj)
//     } catch(e) {
//       exception = e;
//     }

//     assert(exception != null, 'exception is not null');
//     assert(exception.message == 'invalid address', 'exception is : invalid address');

//   })

//   it("TC2011", async() => {

//     OTAStamp = await utils.genOTA(wanAddr)
//     OTAAltTokenSender = await utils.genOTA(wanAddr)
//     OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//     OTAStamp.should.be.a('string')
//     OTAAltTokenSender.should.be.a('string')
//     OTAAltTokenRecipient.should.be.a('string')

//     stampFaceValue = 0.01
//     buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//     buyStampData.should.be.a('string')


//     const txObj = {
//       from:sender,
//       to: stampSCAddress,
//       value: utils.toWei(stampFaceValue),
//       data: buyStampData
//     }

//     try {
//       const txHash = await utils.sendTransaction(txObj)
//     } catch(e) {
//       exception = e;
//     }

//     assert(exception != null, 'exception is not null');
//     assert(exception.message == 'stamp value is not support', 'exception is : stamp value is not support');

//   })


//   it("TC2012", async() => {

//     OTAStamp = await utils.genOTA(wanAddr)
//     OTAAltTokenSender = await utils.genOTA(wanAddr)
//     OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

//     OTAStamp.should.be.a('string')
//     OTAAltTokenSender.should.be.a('string')
//     OTAAltTokenRecipient.should.be.a('string')

//     stampFaceValue = -0.01
//     buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
//     buyStampData.should.be.a('string')


//     const txObj = {
//       from:sender,
//       to: stampSCAddress,
//       value: utils.toWei(stampFaceValue),
//       data: buyStampData
//     }

//     try {
//       const txHash = await utils.sendTransaction(txObj)
//     } catch(e) {
//       exception = e;
//     }

//     assert(exception != null, 'invalid argument 0');
   

//   })




// })