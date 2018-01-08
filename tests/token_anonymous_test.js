<<<<<<< Updated upstream
const {accounts, protocol, host, port, coinSCAddress, stampSCAddress, tokenSCAddress, stampFaceValue, waitBlockNumber, OTASetSize, tokenValue, tokenTransferGasPrice} = require('../config')
=======
const {accounts, protocol, host, port, coinSCAddress, stampSCAddress, tokenSCAddress, stampFaceValue, waitBlockNumber, OTASetSize, tokenValue} = require('../config')
>>>>>>> Stashed changes
const utils = require('../utils')
const assert = require('chai').assert
const expect = require('chai').expect
const should = require('chai').should()
<<<<<<< Updated upstream
const errInvalidRingSignData = new Error('invalid ring signed info')

=======
>>>>>>> Stashed changes

sender = accounts[0]
recipient1 = accounts[1]

let senderBalanceBefore, 
	recipient1BalanceBefore, 
	recipient2BalanceBefore, 
	senderBalanceAfter, 
	recipient1BalanceAfter, 
	recipient2BalanceAfter,
	OTAAltTokenBalance,

	tokenSender,
	tokenRecipient,

	wanAddr, 
	wanAddrR,
	OTAStamp, 
	OTAStampBalance,
	OTAAltTokenSender,
	OTAAltTokenRecipient,

	stampRingSignData, 
	buyStampData, 
	mintTokenData, 
	refundCoinData,
	combinedData, 
	
	blockNumber,
	StampOTAMixSet,
	
	KPsOTAStamp,
	KPsOTAAltTokenSender,
	KPsOTAAltTokenRecipient,
	
	skOTAStamp,
	skOTAAltTokenSender,
	skOTAAltTokenRecipient


<<<<<<< Updated upstream

describe('Anonymous Alt-Token Transfer - [TC2002]: Should PASS', function() {
=======
describe('Anonymous Alt-Token Transfer', function() {
>>>>>>> Stashed changes
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
<<<<<<< Updated upstream
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
=======
		// 0x03e2e552cee8d95053a20bd8bba20c10cd480a009b42e8820761b02f05b1ef4de703c7386ae146707f6bceb3bd8367ac233c8e60cd57e6010d6fb1e7320ed7df2ee6
		// 0x03aa60aedbf0b089559546b3d07471c8e4006b4fb4d256c974a831ad158b49f2030321d99439c520a51544fb67acb6f68a5b5953c81f2e7ce1abc2641709a9c47b89
		// 0xb83d700f67985e406515e562bf2806c9393cc1d7
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))

		// StampOTAMixSet[1] = '0x03e2e552cee8d95053a20bd8bba20c10cd480a009b42e8820761b02f05b1ef4de703c7386ae146707f6bceb3bd8367ac233c8e60cd57e6010d6fb1e7320ed7df'
		// stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
>>>>>>> Stashed changes
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
<<<<<<< Updated upstream
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
=======
			gasprice:'0x' + (20000000000).toString(16),
>>>>>>> Stashed changes
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		assert.equal(utils.fromWei(fee), stampFaceValue)
		assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
<<<<<<< Updated upstream
})

describe('Anonymous Alt-Token Transfer - [TC2048]: sendPrivacyCxtTransaction without from filed', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid address')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2049]: sendPrivacyCxtTransaction with null from filed', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: '',
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid address')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2050]: sendPrivacyCxtTransaction with less bytes', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender.substring(0, tokenSender.length - 2),
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid address')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2051]: sendPrivacyCxtTransaction with more bytes', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender + '5f',
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid address')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2052]: sendPrivacyCxtTransaction with recipient\'s address', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenRecipient,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'from address mismatch private key')

		// let counter, receipt, txInfo, fee
		// counter = 0
		// while (counter < 20) {
		// 	let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
		// 	receipt = await utils.getReceipt(txHash)
		// 	if (!receipt) {
		// 		counter++
		// 	} else {
		// 		txInfo = await utils.getTransaction(txHash)
		// 		blockNumber = utils.getBlockNumber()
		// 		break
		// 	}
		// }

		// fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		// assert.equal(utils.fromWei(fee), stampFaceValue)
		// assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2054]: sendPrivacyCxtTransaction with value filed > 0', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x01,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16)
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid privacy transaction value')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2055]: sendPrivacyCxtTransaction with value filed < 0', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0xff,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16)
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid privacy transaction value')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2056]: sendPrivacyCxtTransaction with texted value filed', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: '12345',
			gasprice:'0x' + (tokenTransferGasPrice).toString(16)
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid privacy transaction value')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2057]: sendPrivacyCxtTransaction with numerical value filed', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 100,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16)
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid privacy transaction value')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2058]: sendPrivacyCxtTransaction with value filed = 0', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16)
		}

		// let err, sklen
		// sklen = skOTAAltTokenSender.length
		// try {
		// 	const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		// } catch (e) {
		// 	err = e
		// }
		// assert.equal(err.message, 'invalid privacy transaction value')

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		assert.equal(utils.fromWei(fee), stampFaceValue)
		assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2060]: genRingSignData with empty hashMsg', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should thorw stampRingSignData\'s exception ', async() => {
		let eMsg
		try {
			await utils.genRingSignData('', skOTAStamp, StampOTAMixSet.join('+'))
		} catch (e) {
			eMsg = e
		}
		assert.equal(eMsg, 'Error: empty hex string')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2061]: genRingSignData with hashMsg \'0x\'', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData('0x', skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})
})

describe('Anonymous Alt-Token Transfer - [TC2062]: genRingSignData with truncated hashMsg', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		const l = tokenSender.length
		stampRingSignData = await utils.genRingSignData(tokenSender.substring(0, l - 8), skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})
})

describe('Anonymous Alt-Token Transfer - [TC2063]: genRingSignData with expanded hashMsg', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender + 'abff55', skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})
})

describe('Anonymous Alt-Token Transfer - [TC2064]: genRingSignData with tampered hashMsg', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenRecipient, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})
})

describe('Anonymous Alt-Token Transfer - [TC2065]: genRingSignData with numerical hashMsg', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should throw stampRingSignData\' exception', async() => {
		let exception
		try {
			await utils.genRingSignData(0xb83d700f67985e406515e562bf2806c9393cc1d7, skOTAStamp, StampOTAMixSet.join('+'))
		} catch (e) {
			exception = e
		}
		assert.equal(exception, 'Error: invalid argument 0: json: cannot unmarshal number into Go value of type string')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2067]: genRingSignData with empty privateKeyStamp', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should throw stampRingSignData\' exception', async() => {
		let exception
		try {
			await utils.genRingSignData(tokenSender, '', StampOTAMixSet.join('+'))
		} catch (e) {
			exception = e
		}
		assert.equal(exception, 'Error: Invalid private key')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2068]: genRingSignData with \'0x\' privateKeyStamp', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should throw stampRingSignData\' exception', async() => {
		let exception
		try {
			await utils.genRingSignData(tokenSender, '0x', StampOTAMixSet.join('+'))
		} catch (e) {
			exception = e
		}
		assert.equal(exception, 'Error: invalid length, need 256 bits')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2069]: genRingSignData with truncated privateKeyStamp', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should throw stampRingSignData\' exception', async() => {
		let exception
		try {
			await utils.genRingSignData(tokenSender, skOTAStamp.substring(0, skOTAStamp.length - 8), StampOTAMixSet.join('+'))
		} catch (e) {
			exception = e
		}
		assert.equal(exception, 'Error: invalid length, need 256 bits')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2070]: genRingSignData with expanded privateKeyStamp', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should throw stampRingSignData\' exception', async() => {
		let exception
		try {
			await utils.genRingSignData(tokenSender, skOTAStamp + '55eeff', StampOTAMixSet.join('+'))
		} catch (e) {
			exception = e
		}
		assert.equal(exception, 'Error: invalid length, need 256 bits')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2071]: genRingSignData with tampered privateKeyStamp', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp.substring(0, skOTAStamp.length - 4) + '55ff', StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let exception 
		try {
			await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch(e) {
			exception = e
		}

		assert.equal(exception.message.substring(0, 17), 'ota balance is 0!')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2072]: genRingSignData with numerical privateKeyStamp', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should throw stampRingSignData\' exception', async() => {
		let exception
		try {
			await utils.genRingSignData(tokenSender, 0xb83d700f67985e406515e562bf2806c9393cc1d7, StampOTAMixSet.join('+'))
		} catch (e) {
			exception = e
		}
		assert.equal(exception.message, 'invalid argument 1: json: cannot unmarshal number into Go value of type string')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2073]: genRingSignData with recipient\'s privateKey', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAAltTokenRecipient, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let exception
		try {
			await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			exception = e
		}

		assert.equal(exception.message.substring(0, 17), 'ota balance is 0!')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2109]: combinedData with empty ringSignData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData('', otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})

})

describe('Anonymous Alt-Token Transfer - [TC2110]: combinedData with "Ox" ringSignData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData('0x', otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})

})

describe('Anonymous Alt-Token Transfer - [TC2111]: combinedData with illegal truncated ringSignData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = stampRingSignData.length
		combinedData = utils.glueSC.combine.getData(stampRingSignData.substring(0, l - 8), otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})

})

describe('Anonymous Alt-Token Transfer - [TC2112]: combinedData with illegal expanded ringSignData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = stampRingSignData.length
		combinedData = utils.glueSC.combine.getData(stampRingSignData + 'abcd1234', otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')
	
	})

})

describe('Anonymous Alt-Token Transfer - [TC2113]: combinedData with tampered ringSignData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = stampRingSignData.length
		combinedData = utils.glueSC.combine.getData(stampRingSignData.substring(0, l - 4) + 'ffff1234', otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')	
	})
})

describe('Anonymous Alt-Token Transfer - [TC2114]: combinedData with numerical ringSignData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = stampRingSignData.length

		combinedData = utils.glueSC.combine.getData(0x123546372636372732abcde83737ffffff9193938eeee7327, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'invalid ring signed info')	
	})
})

describe('Anonymous Alt-Token Transfer - [TC2116]: combinedData with empty cxtInterfaceCallData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData('', OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		console.log("sender's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		console.log("sender's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		assert.equal(utils.fromWei(fee), stampFaceValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2117]: combinedData with "0x" cxtInterfaceCallData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, '0x')
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		console.log("sender's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		console.log("sender's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		assert.equal(utils.fromWei(fee), stampFaceValue)
		// assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2118]: combinedData with truncated cxtInterfaceCallData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = otaTransferData.length
		truncatedOtaTransferData = otaTransferData.substring(0, 128)
		console.log('otaTransferData: ', otaTransferData)
		console.log('truncatedOtaTransferData: ', truncatedOtaTransferData)
		combinedData = utils.glueSC.combine.getData(stampRingSignData, truncatedOtaTransferData)
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		console.log("sender's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		console.log("sender's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		assert.equal(utils.fromWei(fee), stampFaceValue)
		// assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2119]: combinedData with expanded cxtInterfaceCallData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = otaTransferData.length
		truncatedOtaTransferData = otaTransferData.substring(0, 128)
		console.log('otaTransferData: ', otaTransferData)
		console.log('truncatedOtaTransferData: ', truncatedOtaTransferData)
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData + 'e123456789aaaaaaaaaa')
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		console.log("sender's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		console.log("sender's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		assert.equal(utils.fromWei(fee), stampFaceValue)
		// assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2120]: combinedData with tampered cxtInterfaceCallData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = otaTransferData.length
		// truncatedOtaTransferData = otaTransferData.substring(0, 128)
		// console.log('otaTransferData: ', otaTransferData)
		// console.log('truncatedOtaTransferData: ', truncatedOtaTransferData)
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData.substring(l - 4) + '55ff')
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		console.log("sender's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		console.log("sender's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		assert.equal(utils.fromWei(fee), stampFaceValue)
		// assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2121]: combinedData with numerical cxtInterfaceCallData', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		let l = otaTransferData.length
		// truncatedOtaTransferData = otaTransferData.substring(0, 128)
		// console.log('otaTransferData: ', otaTransferData)
		// console.log('truncatedOtaTransferData: ', truncatedOtaTransferData)
		combinedData = utils.glueSC.combine.getData(stampRingSignData, 0xb83d700f67985e406515e562bf2806c9393cc1d7)
		combinedData.should.be.a('string')
	})

	it('should transfer correct quantity of alt-tokens to OATAltTokenReceipt', async() => {
		console.log("sender's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance before privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender)

		let counter, receipt, txInfo, fee
		counter = 0
		while (counter < 20) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				txInfo = await utils.getTransaction(txHash)
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		fee = utils.times(txInfo.gasPrice.toNumber(), receipt.gasUsed)
		console.log("sender's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenSender)))
		console.log("recipient's token balance after privacyTransaction: ", utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)))
		assert.equal(utils.fromWei(fee), stampFaceValue)
		// assert.equal(utils.fromWei(utils.tokenSC.otabalanceOf(tokenRecipient)), tokenValue)
	})
})

describe('Anonymous Alt-Token Transfer - [TC2123]: sendPrivacyCxtTransaction with empty sender\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err

		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, '')
		} catch (e) {
			err = e
		}

		assert.equal(err.message, 'Invalid private key')
	
	})

})

describe('Anonymous Alt-Token Transfer - [TC2124]: sendPrivacyCxtTransaction with \'0x\' sender\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid token sender ota private key', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, '0x')
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid length, need 256 bits')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2125]: sendPrivacyCxtTransaction with truncated sender\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ota sender private key', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender.substring(0, sklen - 4))
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid length, need 256 bits')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2126]: sendPrivacyCxtTransaction with expanded sender\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ota sender private key', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender + 'ffff')
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid length, need 256 bits')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2127]: sendPrivacyCxtTransaction with tampered sender\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw invalid ring signed info', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenSender.replace('f', '5'))
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'from address mismatch private key')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2128]: sendPrivacyCxtTransaction with numerical sender\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, 0xb83d700f67985e406515e562bf2806c9393cc1d7)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'invalid argument 1: json: cannot unmarshal number into Go value of type string')
	})
})

describe('Anonymous Alt-Token Transfer - [TC2129]: sendPrivacyCxtTransaction with recipient\'s sk', function() {
	before(async() => {
		await utils.unlockAccount(sender, "wanglu", 9999)
		await utils.unlockAccount(recipient1, "wanglu", 9999)

		tokenSender,
		tokenRecipient,
		wanAddr, 
		wanAddrR, 
		OTAStamp, 
		OTAStampBalance, 
		OTAAltTokenSender, 
		OTAAltTokenRecipient, 
		combinedData, 
		stampRingSignData, 
		buyStampData, 
		mintTokenData, 
		refundCoinData, 
		blockNumber, 
		skOTAStamp, 
		skOTAAltTokenSender, 
		skOTAAltTokenRecipient = ''

		StampOTAMixSet, 
		KPsOTAStamp, 
		KPsOTAAltTokenSender, 
		KPsOTAAltTokenRecipient = []

		recipient1BalanceBefore = await utils.getBalance(recipient1)
	})

	beforeEach(() => {

	})

	it("should return sender's and recipient's wanchain addressess", async() => {
		wanAddr = await utils.getWanAddress(sender)
		wanAddrR = await utils.getWanAddress(recipient1)

		wanAddr.should.be.a('string')
		wanAddrR.should.be.a('string')
	})

	it('shoud generate OTAs for anonymous alt-token transaction', async() => {
		OTAStamp = await utils.genOTA(wanAddr)
		OTAAltTokenSender = await utils.genOTA(wanAddr)
		OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

		OTAStamp.should.be.a('string')
		OTAAltTokenSender.should.be.a('string')
		OTAAltTokenRecipient.should.be.a('string')
	})

	it('should generate correct buyStampData', () => {
		buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
		buyStampData.should.be.a('string')
	})

	it("should deposit correct quantity of stamp to sender's stamp OTA", async() => {
		const txObj = {
			from: sender,
			to: stampSCAddress,
			value: utils.toWei(stampFaceValue),
			data: buyStampData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
		assert.equal(utils.fromWei(OTAStampBalance), stampFaceValue)

	})	

	it('should generate sender\'s stamp OTA mix set for ', async() => {
		StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		assert.lengthOf(StampOTAMixSet, OTASetSize)
	})

	// generate various keys
	it('should generate key pairs for OTAStamp', async() => {
		KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		skOTAStamp = KPsOTAStamp[0]
		assert.lengthOf(KPsOTAStamp, 3)
		skOTAStamp.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenSender', async() => {
		KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		tokenSender = KPsOTAAltTokenSender[2]
		assert.lengthOf(KPsOTAAltTokenSender, 3)
		skOTAAltTokenSender.should.be.a('string')
		tokenSender.should.be.a('string')
	})

	it('should generate key pairs for OTAAltTokenRecipient', async() => {
		KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		tokenRecipient = KPsOTAAltTokenRecipient[2]
		assert.lengthOf(KPsOTAAltTokenRecipient, 3)
		skOTAAltTokenRecipient.should.be.a('string')
		tokenRecipient.should.be.a('string')
	})

	// generate ABI data
	it('should generate correct mint alt-token data for alt-token SC', () => {
		mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		mintTokenData.should.be.a('string')
	})

	it('should send deposit alt token to the OTA', async() => {
		const txObj = {
			from: sender,
			to: tokenSCAddress,
			value: 0,
			gas: 2000000,
			data: mintTokenData
		}

		const txHash = await utils.sendTransaction(txObj)

		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
			receipt = await utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		OTAAltTokenBalance = utils.tokenSC.otabalanceOf(tokenSender)
		assert.equal(utils.fromWei(OTAAltTokenBalance), tokenValue)

	})	

	it('should generate otatransfer data', () => {
		otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue))
		otaTransferData.should.be.a('string')
	})

	it('should generate stampRingSignData', async() => {
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
		stampRingSignData.should.be.a('string')
	})

	it('should generate combined data', () => {
		combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		combinedData.should.be.a('string')
	})

	it('should throw expected error', async() => {
		const txObj = {
			from: tokenSender,
			to: tokenSCAddress,
			data: combinedData,
			value: 0x0,
			gasprice:'0x' + (tokenTransferGasPrice).toString(16),
			gas: '0x0'
		}

		let err, sklen
		sklen = skOTAAltTokenSender.length
		try {
			const txHash = await utils.sendPrivacyCxtTransaction(txObj, skOTAAltTokenRecipient)
		} catch (e) {
			err = e
		}
		assert.equal(err.message, 'from address mismatch private key')
	})
})

=======

})
>>>>>>> Stashed changes
