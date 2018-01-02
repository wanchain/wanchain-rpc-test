const {accounts, protocol, host, port, coinSCAddress, stampSCAddress, tokenSCAddress, stampFaceValue, waitBlockNumber, OTASetSize, tokenValue} = require('../config')
const utils = require('../utils')
const assert = require('chai').assert
const expect = require('chai').expect
const should = require('chai').should()

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


describe('Anonymous Alt-Token Transfer', function() {
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
		// 0x03e2e552cee8d95053a20bd8bba20c10cd480a009b42e8820761b02f05b1ef4de703c7386ae146707f6bceb3bd8367ac233c8e60cd57e6010d6fb1e7320ed7df2ee6
		// 0x03aa60aedbf0b089559546b3d07471c8e4006b4fb4d256c974a831ad158b49f2030321d99439c520a51544fb67acb6f68a5b5953c81f2e7ce1abc2641709a9c47b89
		// 0xb83d700f67985e406515e562bf2806c9393cc1d7
		stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))

		// StampOTAMixSet[1] = '0x03e2e552cee8d95053a20bd8bba20c10cd480a009b42e8820761b02f05b1ef4de703c7386ae146707f6bceb3bd8367ac233c8e60cd57e6010d6fb1e7320ed7df'
		// stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
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
			gasprice:'0x' + (20000000000).toString(16),
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

})