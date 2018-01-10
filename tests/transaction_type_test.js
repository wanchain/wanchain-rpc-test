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

		senderKeyA = {version:3, crypto:{"cipher":"aes-128-ctr","ciphertext":"9685d96c27432ed71aa927e72e850ed800171e3d253d1120ab5ab51b8d0c61b4","cipherparams":{"iv":"a37239a055e309a4c698e9c6a6fa8b9d"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"e473ae4f8ad60cc9bd0619bcf5167cda8a8e7f7c4de28e07040d4aef57e022dc"},"mac":"0bbc9c5f2280e73140879dcc1fa4332d188eeb0adcf32e017e29c3c9abe2dc11"}};
	    senderKeyB = {version:3, crypto:{"cipher":"aes-128-ctr","ciphertext":"34f8906be698c2d9f92ed27359f13640e378f868bb6b23d7dce0d8faae57082b","cipherparams":{"iv":"a5e9c9d657f826af0a94b33072eeafeb"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"8a867946ee70befbb5be621f35bfbd2cc06a7f12d3b8c81cf3b3b8af9b269831"},"mac":"16651e17a54d2d90a0738dd263581345c6c231bc7dac797d68af0099f4c546d7"}};

    	recipientKeyA = {version:3, crypto:{"cipher":"aes-128-ctr","ciphertext":"924b7474186f9833d117ac1ef9a13c1c1105164a9dccaa37e2e8310b7a916287","cipherparams":{"iv":"5495d995974f1fbff4bb77fc15d21d41"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"ae60b89e41fcc8758a11562c9b713e8ff0454fcdb5528631b0dccf16941cf4a0"},"mac":"a195ea735ddbdc7d9ac8b6856b74ed05bb6c12f318c692ae48e5de74d5b879ff"}};
    	recipientKeyB = {version:3, crypto:{"cipher":"aes-128-ctr","ciphertext":"053edbb0d818056f5e0a9ba129802511859e6f5cc90b8a35f6e9d9e579daca54","cipherparams":{"iv":"b0b78edc5f336816593903270a34590d"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":262144,"p":1,"r":8,"salt":"0df5d16a9433ca08990dc52d8a805f53fb506ce7c0b412c155da26859a112502"},"mac":"cf47ea5d057b240ea20e7ea303d18bbf0b948a544aa3c6d8aabec1a77fb5c597"}};

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


