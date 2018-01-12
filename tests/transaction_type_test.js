const {accounts, protocol, host, port, coinSCAddress, coinValue, waitBlockNumber, OTASetSize, tokenSCAddress, stampSCAddress, debug} = require('../config')
const utils = require('../utils')
const assert = require('chai').assert
const expect = require('chai').expect
const should = require('chai').should()
const Tx = require('wanchain-util').wanchainTx;
const keythereum = require("keythereum");


sender = accounts[0]
recipient1 = accounts[1]

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

var crytoTextSenderA = {"cipher":"aes-128-ctr","ciphertext":"3c1f14cdadb270707a796bbe5e7cdcc4eb61b9633f2f323d3d1da70722595e67","cipherparams":{"iv":"7a555bc7e2ed099365684e71ab283d53"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"047e3c3d41152d1163e8d0648f30b5d89579821d3e82738ec5b9ccc90b69c573"},"mac":"a549ad8b9d9138ba6ca5776f5a3999e64bc60ab6ed142933a1f7f4fdcb78f707"}
var crytoTextSenderB = {"cipher":"aes-128-ctr","ciphertext":"d785f3a1230fb3f3baad4f9b5b6eb527a28bee8d8100ff3af91aa850a6c984fd","cipherparams":{"iv":"7fd1578bb1d935c70c822627146be8a9"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"2b991e50c459839e6806bb84c7fe932bcb4c159697978c2efae5436a782877e1"},"mac":"e385b95cc45c2417c5bb9be07135ebd2a3a9f57f8cf135a58c4a16f2f57baa9d"}
var crytoTextRecipientA = {"cipher":"aes-128-ctr","ciphertext":"f6b46dc33cb6aed85a1ad995dae68b54d105b56c1888bd3b60c247a836d71a77","cipherparams":{"iv":"2194a0a0b137d52b13913b4370f45c41"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"63ed104aa2e5e0cca414776cc66067cf9c4141d17db10f0d54cf191b8ef60d6b"},"mac":"7ad59289e54aaeea74d82c8009c0dd2b9796cec21839abca7fa1decae9039ccb"}
var crytoTextRecipientB = {"cipher":"aes-128-ctr","ciphertext":"eb833cff010836a460bc698070128d833b2e115727496e62c1ac1e07a2cfaac4","cipherparams":{"iv":"1d810052f72a91ddabaaa5d6bba4f962"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"003d9d3381eb7a9f9b39cea62f0afb314c10bb241996672d92e702f33a8512be"},"mac":"d9117250aff169312be97ac031432b8d217db7bb8a319b6ac4d8a7ebd0a344c7"}


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
        if (debug) {
            console.log("nonce:", serial);
        }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }

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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
        }

        assert(exception == null, 'exception is null');
    });


    it('invalid from: TC4002', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        if (debug) {
            console.log("nonce:", serial);
        }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }
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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
        }

        assert(exception != null, 'exception is not null');
    });


    it('invalid from: TC4002', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        if (debug) {
            console.log("nonce:", serial);
        }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }
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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
        }

        assert(exception != null, 'exception is not null');
    });



    it('invalid from: TC4003', async() => {
        var serialNum = await utils.getTransactionCount(sender);
        var serial = '0x' + serialNum.toString(16);
        if (debug) {
            console.log("nonce:", serial);
        }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }
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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }
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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }
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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('transaction hash:' + hash);
            }
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
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('buy stamp transaction hash:' + hash);
            }
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
            if (debug) {
                console.log("OTAStampBalance:" + OTAStampBalance);
            }
        }catch (e){
			exception = e;
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('mint token transaction hash:' + hash);
            }
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

            if (debug) {
                console.log("init token finish. blockNumber:" + blockNumber);
            }
        }catch (e){
            exception = e;
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('token privacy transaction hash:' + hash);
            }
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

            if (debug) {
                console.log("init token finish. blockNumber:" + blockNumber);
            }

            senderTokenBalance = utils.tokenSC.privacyBalance(tokenSender)
            recipientTokenBalance = utils.tokenSC.privacyBalance(tokenRecipient)
            if (debug) {
                console.log('tokenSender:' + tokenSender + ', balance:' + senderTokenBalance);
                console.log('tokenRecipient:' + tokenSender + ', balance:' + recipientTokenBalance);
            }
        }catch (e){
            exception = e;
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('token privacy transaction hash:' + hash);
            }
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

            if (debug) {
                console.log("init token finish. blockNumber:" + blockNumber);
            }

            senderTokenBalance = utils.tokenSC.privacyBalance(tokenSender)
            recipientTokenBalance = utils.tokenSC.privacyBalance(tokenRecipient)
            if (debug) {
                console.log('tokenSender:' + tokenSender + ', balance:' + senderTokenBalance);
                console.log('tokenRecipient:' + tokenSender + ', balance:' + recipientTokenBalance);
            }
        }catch (e){
            exception = e;
            if (debug) {
                console.log('catched exception:' + e.message)
            }
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
            if (debug) {
                console.log('token privacy transaction hash:' + hash);
            }
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

            if (debug) {
                console.log("init token finish. blockNumber:" + blockNumber);
            }

            senderTokenBalance = utils.tokenSC.privacyBalance(tokenSender)
            recipientTokenBalance = utils.tokenSC.privacyBalance(tokenRecipient)
            if (debug) {
                console.log('tokenSender:' + tokenSender + ', balance:' + senderTokenBalance);
                console.log('tokenRecipient:' + tokenSender + ', balance:' + recipientTokenBalance);
            }
        }catch (e){
            exception = e;
            if (debug) {
                console.log('catched exception:' + e.message)
            }
        }

        assert(exception == null, 'exception is null');

    });

})

describe('Stop Filter', function() {
    it('should stop filter', () => {
        utils.filter.stopWatching()
    })
})
