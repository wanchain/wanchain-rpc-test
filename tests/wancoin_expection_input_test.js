const {accounts, protocol, host, port, coinSCAddress, coinValue, waitBlockNumber, OTASetSize} = require('../config')
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
	wanAddr, 
	OTA, 
	OTABalance,
	ringSignData, 
	buyCoinData, 
	refundCoinData,
	blockNumber,
	OTAMixSet,
	keyPairs



describe('wancoin expection input--buy wancoin', function() {
	before(async() => {
        // await utils.unlockAccount(sender, "wanglu", 999999999);
        // await utils.unlockAccount(recipient1, "wanglu", 999999999);

        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
	})

	beforeEach(async() => {
	})

	it('invalid from: TC1005', async() => {
		const txObj = {
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid from: TC1006', async() => {
		const txObj = {
			from:"",
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid from: TC1007', async() => {
        const txObj = {
            from:sender.substring(0, 41),
            to: coinSCAddress,
            value: utils.toWei(coinValue),
            data: buyCoinData
        }

        var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid from: TC1008', async() => {
        const txObj = {
            from:sender + '55',
            to: coinSCAddress,
            value: utils.toWei(coinValue),
            data: buyCoinData
        }

        var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid value: TC1010', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(11));
        const txObj = {
            from:sender,
            to: coinSCAddress,
            value: utils.toWei(11),
            data: buyCoinDataTmp
        }

        var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'wancoin value is not support';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1011', async() => {
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(-11),
			data: buyCoinData
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.value of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1012', async() => {
        const txObj = {
            from:sender,
            to: coinSCAddress,
            value: utils.toWei(0),
            data: buyCoinData
        }

        var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1013', async() => {
        const txObj = {
            from:sender,
            to: coinSCAddress,
            value: utils.toWei(-0),
            data: buyCoinData
        }

        var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});



    it('invalid value: TC1015', async() => {
    	buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA.substring(0, 130), utils.toWei(coinValue));
    	const txObj = {
            from:sender,
            to: coinSCAddress,
            value: utils.toWei(coinValue),
            data: buyCoinDataTmp
        }

        var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid OTA addrss';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1016', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA+'77', utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid OTA addrss';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid value: TC1017', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA.substring(0, 133), utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'hex string of odd length';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1018', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA.substring(2, 1024), utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'hex string without 0x prefix';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1019', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA.substring(0, 130) + 'ww', utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid hex string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1020', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData('', utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'empty hex string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1021', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData('0x', utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid OTA addrss';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1022', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(12356484545, utils.toWei(coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'empty hex string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1024', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue+1));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid value: TC1025', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(0));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1026', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(-coinValue));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1027', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(1000000000000000000000000000));
		const txObj = {
			from:sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinDataTmp
		}

		var exception = null;
		try{
			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1028', async() => {
        var exception = null;
    	try{
			buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, "text");
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'new BigNumber() not a number: text';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1029', async() => {
        var exception = null;
		try{
			buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue+1).toString());
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1030', async() => {
        var exception = null;
		try{
			buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, '0xafcb5546d22354');
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1032', async() => {
        var exception = null;
		try{
			buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp.substring(2, 100000000)
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.data of type hexutil.Bytes';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});



    it('invalid value: TC1033', async() => {
        var exception = null;
		try{
            buyCoinDataTmp ='0x3f8582d700000000000000000000000000000000000000000000000000000000000001400000010000000000000000000000000000000000000000018ac7230489e80000010000000000000000000000000000000000000000000000000000000000018630783033363332366133363463613762623036373364666661623165356235376134353538663930616134353033636162383739613435633938333962653436633561653032316434393864613833353133363163326664366364313139393737666531613731373134303139323332313032646138323065623561643439333966666565620000000001100000000000000000000000000000000000000000';
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'error in buy coin';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1034', async() => {
        var exception = null;
		try{
			buyCoinDataTmp ='';
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1035', async() => {
        var exception = null;
		try{
			buyCoinDataTmp ='0x3f8582d70000000W000000000000000000000000000000000000000000000000000001400000010000000000000000000000000000000000000000018ac7230489e80000010000000000000000000000000000000000000000000000000000000000018630783033363332366133363463613762623036373364666661623165356235376134353538663930616134353033636162383739613435633938333962653436633561653032316434393864613833353133363163326664366364313139393737666531613731373134303139323332313032646138323065623561643439333966666565620000000001100000000000000000000000000000000000000000';
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field SendTxArgs.data of type hexutil.Bytes';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid value: TC1036', async() => {
        var exception = null;
		try{
			buyCoinDataTmp ='0x';
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid value: TC1037', async() => {
        var exception = null;
		try{
			buyCoinDataTmp = 456255654;
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.data of type hexutil.Bytes';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

})



describe('wancoin expection input--buy wancoin', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
	})

	beforeEach(async() => {
	})

    it('invalid gas: TC1039', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gas: 0
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'intrinsic gas too low';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid gas: TC1040', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gas: -10000000
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gas of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid gas: TC1040', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gas: '-10000000'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gas of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gas: TC1040', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gas: '-0x10000000'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gas of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gas: TC1040', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gas: 'dsafdagfdsh'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'new BigNumber() not a number: dsafdagfdsh';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

})


describe('wancoin expection input--buy wancoin', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
	})

    beforeEach(async() => {
    })

    it('invalid gasprice: TC1043', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gasprice: 0
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gasprice: TC1043', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gasprice: '0x0'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'transaction underpriced';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gasprice: TC1044', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gasprice: -20000000000
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gasprice: TC1044', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gasprice: '-20000000000'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid gasprice: TC1044', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gasprice: '-0x20000000000'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gasprice: TC1045', async() => {
        var exception = null;
		try{
			const txObj = {
				from:sender,
				to: coinSCAddress,
				value: utils.toWei(coinValue),
				data: buyCoinData,
				gasprice: 'fsagfajgfskjg'
			}

			const txHash = await utils.sendTransaction(txObj);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


})


describe('wancoin expection input--get ota mix set', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
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
	})

    beforeEach(async() => {
	})

    it('invalid ota mix set number: TC1048', async() => {
		var exception = null;
		try{
			OTAMixSet = await utils.getOTAMixSet(OTA, 2000000000);
		}catch(e) {
			exception = e;
		}

		expectExceptionMsg = 'Require too many OTA mix address';
		assert(exception != null, 'exception is not null');
		if (exception != null) {
            assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
		}
    });

    it('invalid ota mix set number: TC1048', async() => {
        var exception = null;
		try{
			OTAMixSet = await utils.getOTAMixSet(OTA, 21);
		}catch(e) {
			exception = e;
		}

		expectExceptionMsg = 'Require too many OTA mix address';
		assert(exception != null, 'exception is not null');
		if (exception != null) {
			assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
		}
	});

    it('invalid ota mix set number: TC1048', async() => {
        var exception = null;
		try{
			OTAMixSet = await utils.getOTAMixSet(OTA, 0);
		}catch(e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid required OTA mix address number';
		assert(exception != null, 'exception is not null');
		if (exception != null) {
			assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
		}
	});

    it('invalid ota mix set number: TC1048', async() => {
        var exception = null;
		try{
			OTAMixSet = await utils.getOTAMixSet(OTA, -10);
		}catch(e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid required OTA mix address number';
		assert(exception != null, 'exception is not null');
		if (exception != null) {
			assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
		}
	});


})

describe('wancoin expection input--compute OTA PP keys', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
	})

    beforeEach(async() => {
    })


    it('invalid ota: TC1051', async() => {
        var exception = null;
		try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA.substring(0, 60));
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid wanchain address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1052', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA+'AB');
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid wanchain address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1053', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA.substring(0, 133));
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'hex string of odd length';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1054', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA.substring(2));
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'hex string without 0x prefix';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1055', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, '0xWQ' + OTA.substring(4));
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid hex string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1056', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, '');
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'empty hex string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1057', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, '0x');
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid wanchain address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid ota: TC1058', async() => {
        var exception = null;
		try{
			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, 1345646546);
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 1: json: cannot unmarshal number into Go value of type string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});



    it('invalid ota: TC1059', async() => {
        var exception = null;
		try{
			strReplace = '0xaa'
			if (OTA.indexOf(strReplace) == 0) {
				strReplace = '0xbb'
			}

			OTAOOKeys = await utils.computeOTAPPKeys(recipient1, strReplace + OTA.substring(4));
		}catch (e){
			exception = e;
		}

		expectExceptionMsg = 'invalid magic in compressed pubkey string: 170';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


})


describe('wancoin expection input--compute OTA PP keys', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await
		utils.genOTA(wanAddr);
	})

	beforeEach(async() => {
	})

    it('invalid account: TC1061', async() => {
        var exception = null;
		try {
			OTAOOKeys = await utils.computeOTAPPKeys('', OTA.substring(0, 60));
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid account: TC1062', async() => {
        var exception = null;
		try {
			OTAOOKeys = await utils.computeOTAPPKeys(sender, OTA);
			console.log(OTAOOKeys);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid address';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});
})



describe('wancoin expection input--generate ring sign data', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
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

    	keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+');
	    OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize);
	})

	beforeEach(async() => {

	})


    it('invalid OTA private key: TC1064', async() => {
        var exception = null;
		try {
            ringSignData = await utils.genRingSignData(recipient1, '', OTAMixSet.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid private key';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA private key: TC1065', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0].substring(2), OTAMixSet.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid private key';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA private key: TC1066', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0].substring(0, keyPairs[0].length-2), OTAMixSet.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid length, need 256 bits';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA private key: TC1067', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0]+'aa', OTAMixSet.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid length, need 256 bits';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});



    it('invalid OTA private key: TC1068', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, '0xww' + keyPairs[0].substring(4), OTAMixSet.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid hex string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA private key: TC1069', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, 456134315, OTAMixSet.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 1: json: cannot unmarshal number into Go value of type string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});




})




describe('wancoin expection input--generate ring sign data', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		const txHash = await
		utils.sendTransaction(txObj)
		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await
			utils.promisify(cb => utils.filter.watch(cb)
		)
			receipt = await
			utils.getReceipt(txHash)
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+');
		OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize);
	})

    beforeEach(async() => {

	})


    it('invalid OTA mix set: TC1071', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
            	if (i == 0) {
                    OTAMixSetTmp.push(OTAMixSet[i].substring(0, 30));
				} else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
				}
            }

            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid Waddress, try again';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA mix set: TC1072', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
                if (i == 0) {
                    OTAMixSetTmp.push(OTAMixSet[i]+'ab');
                } else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
                }
            }
            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid Waddress, try again';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA mix set: TC1073', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
                if (i == 0) {
                    OTAMixSetTmp.push(OTAMixSet[i].substring(0, 133));
                } else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
                }
            }

            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA mix set: TC1074', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
                if (i == 0) {
                    OTAMixSetTmp.push(OTAMixSet[i].substring(2));
                } else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
                }
            }

            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA mix set: TC1075', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
                if (i == 0) {
                    OTAMixSetTmp.push('0xqw' + OTAMixSet[i].substring(4));
                } else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
                }
            }

            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA mix set: TC1076', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
                if (i == 0) {
                    OTAMixSetTmp.push('');
                } else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
                }
            }

            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA mix set: TC1077', async() => {
        var exception = null;
		try {
            var OTAMixSetTmp = []
            for (i = 0; i < OTAMixSet.length; i++){
                if (i == 0) {
                    OTAMixSetTmp.push('0x');
                } else {
                    OTAMixSetTmp.push(OTAMixSet[i]);
                }
            }

            console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid Waddress, try again';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid OTA mix set: TC1078', async() => {
        var exception = null;
		try {
            console.log('~~~~~~~'+OTAMixSet.join('$'))
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('$'))
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA mix set: TC1079', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], '+')
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA mix set: TC1080', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], '')
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'fail to decode wan address!';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid OTA mix set: TC1081', async() => {
        var exception = null;
		try {
			ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], 156325153)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 2: json: cannot unmarshal number into Go value of type string';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


})


describe('wancoin expection input--refund wancoin', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		const txHash = await
		utils.sendTransaction(txObj)
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

		keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+');
		OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize);
	    ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('+'));
	})

    beforeEach(async() => {

	})


    it('invalid data: TC1090', async() => {
        var exception = null;
		try {
            refundCoinData = utils.coinSC.refundCoin.getData('', utils.toWei(coinValue))
            const txObj = {
                from: recipient1,
                to: coinSCAddress,
                data: refundCoinData
            }

            const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid ring signed info';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1091', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData('0x', utils.toWei(coinValue))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid ring signed info';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1092', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData('0x'+ ringSignData.substring(4), utils.toWei(coinValue))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid ring signed info';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1093', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData + 'ab', utils.toWei(coinValue))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid ring signed info';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1094', async() => {
        var exception = null;
		try {
            var ringSignDataTmp = '';
            if (ringSignData.indexOf('0xaa') == 0) {
                ringSignDataTmp = '0xbb' + ringSignData.substring(4)
			} else {
                ringSignDataTmp = '0xaa' + ringSignData.substring(4)
			}

			refundCoinData = utils.coinSC.refundCoin.getData(ringSignDataTmp, utils.toWei(coinValue))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid ring signed info';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1095', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData)
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'Invalid number of arguments to Solidity function';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1095', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, '')
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1097', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue*2))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1098', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue*2+2))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1099', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, 0)
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});



    it('invalid data: TC1100', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(10000000000000000))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1101', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(-coinValue))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1102', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, 'fdsajldsag')
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'new BigNumber() not a number: fdsajldsag';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1103', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, '45613564646')
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1104', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, '0x486e56468ba')
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData
			}

			const txHash = await utils.sendTransaction(txObj)
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'mismatched wancoin value';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});



})





describe('wancoin expection input--refund wancoin', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await
		utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		const txHash = await
		utils.sendTransaction(txObj)
		let counter, receipt
		counter = 0
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb));
			receipt = await utils.getReceipt(txHash);
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+');
		OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize);
		ringSignData = await
		utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('+'));
	    refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue));
	})

    beforeEach(async() => {

	})


    it('invalid data: TC1106', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1106', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: ''
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1107', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: '0x'
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1108', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: '0x' + refundCoinData.substring(4)
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1108', async() => {
        var exception = null;
		try {
			refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue))
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: '0x' + refundCoinData.substring(4)
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error parameters';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1108', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData.substring(0, 30) + refundCoinData.substring(40)
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error in refund coin';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1108', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData.substring(0, 100) + refundCoinData.substring(200)
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'error in refund coin';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid data: TC1109', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData+'56ab'
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		assert(exception == null, 'exception is null');
	});

    it('invalid data: TC1109', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData+'wwqq'
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field SendTxArgs.data of type hexutil.Bytes';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1110', async() => {
        var exception = null;
		try {
            refundCoinDataTmp = refundCoinData.substring(0, 200) + 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb' + refundCoinData.substring(230)
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid ring signed info';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1110', async() => {
        var exception = null;
		try {
			refundCoinDataTmp = refundCoinData.substring(230) + refundCoinData.substring(0, 230)
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinDataTmp
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.data of type hexutil.Bytes';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid data: TC1111', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: 524654657
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.data of type hexutil.Bytes';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

})


describe('wancoin expection input--refund wancoin', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		const txHash = await utils.sendTransaction(txObj);
		let counter, receipt
		counter = 0;
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb));
			receipt = await utils.getReceipt(txHash);
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+');
		OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize);
		ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('+'));
		refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue));
	})

    beforeEach(async() => {

	})

    it('invalid gas: TC1117', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: 0
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'intrinsic gas too low';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gas: TC1118', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: -0
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'intrinsic gas too low';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gas: TC1119', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: -1000000
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gas of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid gas: TC1120', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: 'fgfdh'
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'new BigNumber() not a number: fgfdh';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});
})




describe('wancoin expection input--refund wancoin', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
		OTA = await utils.genOTA(wanAddr);
		buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
		const txObj = {
			from: sender,
			to: coinSCAddress,
			value: utils.toWei(coinValue),
			data: buyCoinData
		}

		const txHash = await utils.sendTransaction(txObj);
		let counter, receipt
		counter = 0;
		while (counter < waitBlockNumber) {
			let blockHash = await utils.promisify(cb => utils.filter.watch(cb));
			receipt = await utils.getReceipt(txHash);
			if (!receipt) {
				counter++
			} else {
				blockNumber = utils.getBlockNumber()
				break
			}
		}

		keyPairs = (await utils.computeOTAPPKeys(recipient1, OTA)).split('+');
		OTAMixSet = await utils.getOTAMixSet(OTA, OTASetSize);
		ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('+'));
		refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue));
	})

    beforeEach(async() => {

    })

    it('invalid gasprice: TC1122', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: 1000000,
				gasprice: 0
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gasprice: TC1123', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: 1000000,
				gasprice: -0
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});


    it('invalid gasprice: TC1124', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
                gas: 1000000,
                gasprice: -20000000000000
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});

    it('invalid gasprice: TC1124', async() => {
        var exception = null;
		try {
			const txObj = {
				from: recipient1,
				to: coinSCAddress,
				data: refundCoinData,
				gas: 1000000,
				gasprice: 'rgfhhjjjk'
			}

			const txHash = await utils.sendTransaction(txObj);
		} catch (e) {
			exception = e;
		}

		expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
		assert(exception != null, 'exception is not null');
		assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
	});
})

