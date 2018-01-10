const {accounts, protocol, host, port, coinSCAddress, coinValue, waitBlockNumber, OTASetSize, tokenSCAddress, stampSCAddress} = require('../config')
const utils = require('../utils')
const assert = require('chai').assert
const expect = require('chai').expect
const should = require('chai').should()
const Tx = require('wanchain-util').wanchainTx;
const keythereum = require("keythereum");


sender = '0xdb05642eabc8347ec78e21bdf0d906ba579d423a';
recipient1 = '0xf9b32578b4420a36f132db32b56f3831a7cc1804';

let senderBalanceBefore,
	recipient1BalanceBefore,
	recipient2BalanceBefore,
	senderBalanceAfter,
	recipient1BalanceAfter,
	recipient2BalanceAfter,
	wanAddr,
	OTA,
	OTABalance,
	ringSignData,
	buyCoinData,
	refundCoinData,
	blockNumber,
	OTAMixSet,
	keyPairs


var realTokenSCAddress = tokenSCAddress;


describe('transaction type checking', function() {
	before(async() => {


        await utils.unlockAccount(sender, "wanglu", 999999999);
        await utils.unlockAccount(recipient1, "wanglu", 999999999);

		senderKeyA = {version:3, crypto: crytoTextSenderA};
	    senderKeyB = {version:3, crypto: crytoTextSenderB};

    	recipientKeyA = {version:3, crypto: crytoTextRecipientA};
    	recipientKeyB = {version:3, crypto: crytoTextRecipientB};

		senderPrivKeyA = keythereum.recover("wanglu", senderKeyA);
    	senderPrivKeyB = keythereum.recover("wanglu", senderKeyB);

		recipientPrivKeyA = keythereum.recover("wanglu", recipientKeyA);
		recipientPrivKeyB = keythereum.recover("wanglu", recipientKeyB);

	})

	beforeEach(async() => {
	})



    it('invalid from: TC4001', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        console.log("nonce:", serial);

        let rawTx = {
            Txtype: '0x01',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gas: '0xf4240',
            to: recipient1,
            value: '0x01',
        };

        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }


        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception == null, 'exception is null');
    });


    it('invalid from: TC4002', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        console.log("nonce:", serial);

        let rawTx = {
            Txtype: '0x06',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gas: '0xf4240',
            to: recipient1,
            value: '0x' + utils.toWei(1).toString('hex'),
        };

        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
    });


    it('invalid from: TC4002', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        console.log("nonce:", serial);

        let rawTx = {
            Txtype: '0x06',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gas: '0xf4240',
            to: recipient1,
            value: '0x00',
        };

        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
    });



    it('invalid from: TC4003', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        console.log("nonce:", serial);

        let rawTx = {
            Txtype: '0x02',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gas: '0xf4240',
            to: recipient1,
            value: '0x' + utils.toWei(1).toString('hex'),
        };

        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
    });



    it('invalid from: TC4004', async() => {
        var coinValue = 10;
        var wanAddr = await utils.getWanAddress(recipient1);
        var OTA = await utils.genOTA(wanAddr);
        var buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));

        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);

        var rawTx = {
            Txtype: '0x1',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gasLimit: '0xf4240',
            to: coinSCAddress,
            value: '0x' + utils.toBig(utils.toWei(coinValue)).toString(16),
            data: buyCoinData
        };


        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }


        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception == null, 'exception is null');
    });

    it('invalid from: TC4005', async() => {
        var coinValue = 10;
        var wanAddr = await utils.getWanAddress(recipient1);
        var OTA = await utils.genOTA(wanAddr);
        var buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));

        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);

        var rawTx = {
            Txtype: '0x6',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gasLimit: '0xf4240',
            to: coinSCAddress,
            value: '0x0',
            data: buyCoinData
        };


        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }


        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
    });



    it('invalid from: TC4006', async() => {
        var coinValue = 10;
        var wanAddr = await utils.getWanAddress(recipient1);
        var OTA = await utils.genOTA(wanAddr);
        var buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));

        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);

        var rawTx = {
            Txtype: '0x2',
            nonce: serial,
            gasPrice: '0x2e90edd000',
            gasLimit: '0xf4240',
            to: coinSCAddress,
            value: '0x' + utils.toBig(utils.toWei(coinValue)).toString(16),
            data: buyCoinData
        };


        var exception = null;
        try{
            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }


        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
    });



    it('invalid from: TC4007', async() => {

        var stampFaceValue = 0.5;
		var wanAddr = await utils.getWanAddress(sender)
		var wanAddrR = await utils.getWanAddress(recipient1)
		var OTAStamp = await utils.genOTA(wanAddr)
		var OTAAltTokenSender = await utils.genOTA(wanAddr)
		var OTAAltTokenRecipient = await utils.genOTA(wanAddrR)
		var buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))

        var exception = null;
	    try{

			var serialNum = await utils.getTransactionCount(sender);
			var serial = '0x' + serialNum.toString(16);

			var rawTx = {
				Txtype: '0x1',
				nonce: serial,
				gasPrice: '0x2e90edd000',
				gasLimit: '0xf4240',
				to: stampSCAddress,
				value: '0x' + utils.toBig(utils.toWei(stampFaceValue)).toString(16),
				data: buyStampData
			};

			let tx = new Tx(rawTx);
			tx.sign(senderPrivKeyA);
			let serializedTx = tx.serialize();
			let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
			console.log('buy stamp transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

            OTAStampBalance = await utils.getOTABalance(OTAStamp, blockNumber)
			console.log("OTAStampBalance:" + OTAStampBalance);

        }catch (e){
			exception = e;
			console.log('catched exception:' + e.message)
		}

		assert(exception == null, 'exception is null');


		var tokenValue = 1000;
		var StampOTAMixSet = await utils.getOTAMixSet(OTAStamp, OTASetSize)
		var KPsOTAStamp = (await utils.computeOTAPPKeys(sender, OTAStamp)).split('+')
		var skOTAStamp = KPsOTAStamp[0]
		var KPsOTAAltTokenSender = (await utils.computeOTAPPKeys(sender, OTAAltTokenSender)).split('+')
		var skOTAAltTokenSender = KPsOTAAltTokenSender[0]
		var tokenSender = KPsOTAAltTokenSender[2]
		var KPsOTAAltTokenRecipient = (await utils.computeOTAPPKeys(recipient1, OTAAltTokenRecipient)).split('+')
		var skOTAAltTokenRecipient = KPsOTAAltTokenRecipient[0]
		var tokenRecipient = KPsOTAAltTokenRecipient[2]
		var mintTokenData = utils.tokenSC.initPrivacyAsset.getData(tokenSender, OTAAltTokenSender, utils.toWei(tokenValue))
		try {
            var serialNum = await utils.getTransactionCount(sender);
            var serial = '0x' + serialNum.toString(16);

            var rawTx = {
                Txtype: '0x1',
                nonce: serial,
                gasPrice: '0x2e90edd000',
                gasLimit: '0xf4240',
                to: realTokenSCAddress,
                value: '0x0',
                data: mintTokenData
            };

            let tx = new Tx(rawTx);
            tx.sign(senderPrivKeyA);
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('mint token transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

            console.log("init token finish. blockNumber:" + blockNumber);

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

    	assert(exception == null, 'exception is null');

	    otaTransferData = utils.tokenSC.otatransfer.getData(tokenRecipient, OTAAltTokenRecipient, utils.toWei(tokenValue/2+100))
	    stampRingSignData = await utils.genRingSignData(tokenSender, skOTAStamp, StampOTAMixSet.join('+'))
	    combinedData = utils.glueSC.combine.getData(stampRingSignData, otaTransferData)
		try {
            var rawTx = {
                Txtype: '0x2',
                nonce: '0x0',
                gasPrice: '0x2e90edd000',
                gas: '0x0',
                from: tokenSender,
                to: realTokenSCAddress,
                data: combinedData,
                value: 0x0
            };

            let tx = new Tx(rawTx);
            tx.sign(Buffer.from(skOTAAltTokenSender.slice(2), 'hex'));
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('token privacy transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

            console.log("init token finish. blockNumber:" + blockNumber);


            senderTokenBalance = utils.tokenSC.privacyBalance(tokenSender)
            recipientTokenBalance = utils.tokenSC.privacyBalance(tokenRecipient)
            console.log('tokenSender:' + tokenSender + ', balance:' + senderTokenBalance);
            console.log('tokenRecipient:' + tokenSender + ', balance:' + recipientTokenBalance);

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
        exception = null;

        try {
            var rawTx = {
                Txtype: '0x1',
                nonce: '0x0',
                gasPrice: '0x2e90edd000',
                gas: '0x0',
                from: tokenSender,
                to: realTokenSCAddress,
                data: combinedData,
                value: 0x0
            };

            let tx = new Tx(rawTx);
            tx.sign(Buffer.from(skOTAAltTokenSender.slice(2), 'hex'));
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('token privacy transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

            console.log("init token finish. blockNumber:" + blockNumber);


            senderTokenBalance = utils.tokenSC.privacyBalance(tokenSender)
            recipientTokenBalance = utils.tokenSC.privacyBalance(tokenRecipient)
            console.log('tokenSender:' + tokenSender + ', balance:' + senderTokenBalance);
            console.log('tokenRecipient:' + tokenSender + ', balance:' + recipientTokenBalance);

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception != null, 'exception is not null');
        exception = null;

        try {
            var rawTx = {
                Txtype: '0x6',
                nonce: '0x0',
                gasPrice: '0x2e90edd000',
                gas: '0x0',
                from: tokenSender,
                to: realTokenSCAddress,
                data: combinedData,
                value: 0x0
            };

            let tx = new Tx(rawTx);
            tx.sign(Buffer.from(skOTAAltTokenSender.slice(2), 'hex'));
            let serializedTx = tx.serialize();
            let hash = await utils.sendRawTransaction('0x' + serializedTx.toString('hex'));
            console.log('token privacy transaction hash:' + hash);

            let counter, receipt
            counter = 0
            while (counter < waitBlockNumber) {
                let blockHash = await utils.promisify(cb => utils.filter.watch(cb))
                receipt = await utils.getReceipt(hash)
                if (!receipt) {
                    counter++
                } else {
                    blockNumber = utils.getBlockNumber()
                    break
                }
            }

            console.log("init token finish. blockNumber:" + blockNumber);


            senderTokenBalance = utils.tokenSC.privacyBalance(tokenSender)
            recipientTokenBalance = utils.tokenSC.privacyBalance(tokenRecipient)
            console.log('tokenSender:' + tokenSender + ', balance:' + senderTokenBalance);
            console.log('tokenRecipient:' + tokenSender + ', balance:' + recipientTokenBalance);

        }catch (e){
            exception = e;
            console.log('catched exception:' + e.message)
        }

        assert(exception == null, 'exception is null');

    });

})


