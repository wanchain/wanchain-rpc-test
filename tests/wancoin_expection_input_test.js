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


describe('Abnormal input test -- buy wancoin', function() {
    before(async() => {
        await utils.unlockAccount(sender, "wanglu", 999999999);
        await utils.unlockAccount(recipient1, "wanglu", 999999999);

        wanAddr = await utils.getWanAddress(recipient1);
        OTA = await utils.genOTA(wanAddr);
        buyCoinData = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
    })

    beforeEach(async() => {
    })

    it('TC1005: "from" field is not set ', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1006："from" field is a null string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1007: the length of "from" filed is too short ', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1008: the length of "from" filed is too long', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1010: invalid value(11) ', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1011: invalid value(-10)', async() => {
        const txObj = {
            from:sender,
            to: coinSCAddress,
            value: utils.toWei(-10),
            data: buyCoinData
        }

        var exception = null;
        try{
            const txHash = await utils.sendTransaction(txObj);
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.value of type *hexutil.Big';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1012: invalid value(0)', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1013: invalid value(-0)', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1015: OTA is too short', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1016: OTA is too long', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1017: OTA is one byte shorter than expectation', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1018: OTA lacks of "0x" prefix', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1019: OTA includes invalid character ', async() => {
        buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA.substring(0, 132) + 'ww', utils.toWei(coinValue));
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1020: empty OTA', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1021: OTA is "0x"', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1022: OTA is invalid as an integer', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it("TC1024: Data is invalid as it's wancoin value is 11", async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it("TC1025: Data is invalid as it's wancoin value is 0", async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it("TC1026: Data is invalid as it's wancoin value is -10", async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it("TC1027: Data is invalid as it's wancoin value is a big number", async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it("TC1028: Data is invalid as it's wancoin value is a non-digital", async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1032: data lacks of "0x" prefix', async() => {
        var exception = null;
        try{
            buyCoinDataTmp = utils.coinSC.buyCoinNote.getData(OTA, utils.toWei(coinValue));
            const txObj = {
                from:sender,
                to: coinSCAddress,
                value: utils.toWei(coinValue),
                data: buyCoinDataTmp.substring(2)
            }

            const txHash = await utils.sendTransaction(txObj);
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.data of type hexutil.Bytes';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1033: data is a fake hex string', async() => {
        var exception = null;
        try{
            buyCoinDataTmp ='0x3f8582d7000000000000000000000000000000000000000000000000000000000001400000010000000000000000000000000000000000000000018ac7230489e80000010000000000000000000000000000000000000000000000000000000000018630783033363332366133363463613762623036373364666661623165356235376134353538663930616134353033636162383739613435633938333962653436633561653032316434393864613833353133363163326664366364313139393737666531613731373134303139323332313032646138323065623561643439333966666565620000000001100000000000000000000000000000000000000000';
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1034: data is null', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1035: data includes non-hex character', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1036: data is "0x"', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1037: data is an integer', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1039: gas is zero', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1040: gas is -10000000', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1041: gas is not a number', async() => {
        var exception = null;
        try{
            const txObj = {
                from:sender,
                to: coinSCAddress,
                value: utils.toWei(coinValue),
                data: buyCoinData,
                gas: '10a0000'
            }

            const txHash = await utils.sendTransaction(txObj);
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'new BigNumber() not a number: 10a0000';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1043: gas price is 0x0', async() => {
        var exception = null;
        try{
            const txObj = {
                from:sender,
                to: coinSCAddress,
                value: utils.toWei(coinValue),
                data: buyCoinData,
                gasprice: "0x0"
            }

            const txHash = await utils.sendTransaction(txObj);
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'transaction underpriced';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1044: gas price is -20000000000', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1044: gas price is "-20000000000"', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1044: gas price is "-0x20000000000"', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1045: gas price is non-digital string', async() => {
        var exception = null;
        try{
            const txObj = {
                from:sender,
                to: coinSCAddress,
                value: utils.toWei(coinValue),
                data: buyCoinData,
                gasprice: '0xfsagfajgfskjg'
            }

            const txHash = await utils.sendTransaction(txObj);
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });
})


describe('Abnormal input test -- get a mixed OTA set', function() {
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

        let counter, receipt;
        counter = 0;

        while (counter < waitBlockNumber) {
            let blockHash = await utils.promisify(cb => utils.filter.watch(cb));
            receipt = await utils.getReceipt(txHash);
            if (!receipt) {
                counter++;
            } else {
                blockNumber = utils.getBlockNumber();
                break;
            }
        }
    })

    beforeEach(async() => {
    })

    it('TC1048: try to get 2000000000 OTA', async() => {
        var exception = null;
        try{
            OTAMixSet = await utils.getOTAMixSet(OTA, 2000000000);
        }catch(e) {
            exception = e;
        }

        expectExceptionMsg = 'Require too many OTA mix address';
        assert(exception != null, 'Exception should not be null');
        if (exception != null) {
            assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
        }
    });

    it('TC1048: try to get 21 OTA', async() => {
        var exception = null;
        try{
            OTAMixSet = await utils.getOTAMixSet(OTA, 21);
        }catch(e) {
            exception = e;
        }

        expectExceptionMsg = 'Require too many OTA mix address';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1048: try to get 0 OTA', async() => {
        var exception = null;
        try{
            OTAMixSet = await utils.getOTAMixSet(OTA, 0);
        }catch(e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid required OTA mix address number';
        assert(exception != null, 'Exception should not be null');
        if (exception != null) {
            assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
        }
    });

    it('TC1048: try to get -10 OTA', async() => {
        var exception = null;
        try{
            OTAMixSet = await utils.getOTAMixSet(OTA, -10);
        }catch(e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid required OTA mix address number';
        assert(exception != null, 'Exception should not be null');
        if (exception != null) {
            assert(exception.message.indexOf(expectExceptionMsg) >= 0 , 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
        }
    });
})

describe('Abnormal input test -- compute OTA PP keys', function() {
    before(async() => {
        wanAddr = await utils.getWanAddress(recipient1);
        OTA = await utils.genOTA(wanAddr);
    })

    beforeEach(async() => {
    })


    it('TC1051: input OTA with 60 bytes', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA.substring(0, 60));
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid wanchain address';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1052: input OTA with 67 bytes', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA+'AB');
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid wanchain address';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1053: input OTA with half byte less than expectation', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA.substring(0, 133));
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'hex string of odd length';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1054: input OTA without "0x" prefix', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, OTA.substring(2));
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'hex string without 0x prefix';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1055: input OTA with invalid hex string', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, '0xWQ' + OTA.substring(4));
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid hex string';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1056: input OTA with empty string', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, '');
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'empty hex string';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1057: input OTA only with "0x"', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, '0x');
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid wanchain address';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1058: input OTA with a integer', async() => {
        var exception = null;
        try{
            OTAOOKeys = await utils.computeOTAPPKeys(recipient1, 1345646546);
        }catch (e){
            exception = e;
        }

        expectExceptionMsg = 'invalid argument 1: json: cannot unmarshal number into Go value of type string';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });



    it('TC1059: input fake OTA', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1061: input account with null string', async() => {
        var exception = null;
        try {
            OTAOOKeys = await utils.computeOTAPPKeys('', OTA.substring(0, 60));
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'invalid address';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    // it('TC1062: input sender account', async() => {
     //    var exception = null;
    // 	try {
    // 		OTAOOKeys = await utils.computeOTAPPKeys(sender, OTA);
    // 		console.log(OTAOOKeys);
    // 	} catch (e) {
    // 		exception = e;
    // 	}
    //
    // 	expectExceptionMsg = 'invalid address';
    // 	assert(exception != null, 'Exception should not be null');
    // 	assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    // });
})

describe('Abnormal input test -- generate ring sign data', function() {
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
            let blockHash = await utils.promisify(cb => utils.filter.watch(cb));
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

    it('TC1064: input OTA private key with empty string', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, '', OTAMixSet.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid private key';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1065: input OTA private key without "0x" prefix', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0].substring(2), OTAMixSet.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid private key';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1066: input OTA private key with shorter length', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0].substring(0, keyPairs[0].length-2), OTAMixSet.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'invalid length, need 256 bits';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1067: input OTA private key with longer length', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0]+'aa', OTAMixSet.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'invalid length, need 256 bits';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });



    it('TC1068: input OTA private key with invalid hex string', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, '0xww' + keyPairs[0].substring(4), OTAMixSet.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'invalid hex string';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1069: input OTA private key with an integer', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, 456134315, OTAMixSet.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'invalid argument 1: json: cannot unmarshal number into Go value of type string';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1071: input too short OTA set', async() => {
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

            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid Waddress, try again';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1072: input too long OTA set', async() => {
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
            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid Waddress, try again';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1073: input OTA set with half byte less than expectation', async() => {
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

            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1074: input OTA set without "0x" prefix', async() => {
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

            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1075: input OTA set with invalid hex string', async() => {
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

            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1076: input invalid OTA set', async() => {
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

            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1077: input OTA set only with "0x"', async() => {
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

            // console.log('~~~~~~~'+OTAMixSetTmp.join('+'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSetTmp.join('+'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'Invalid Waddress, try again';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1078: input OTA set with $ instead of +', async() => {
        var exception = null;
        try {
            // console.log('~~~~~~~'+OTAMixSet.join('$'))
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], OTAMixSet.join('$'))
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1079: input OTA set only with +', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], '+')
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1080: input empty OTA set', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], '')
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'fail to decode wan address!';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1081: input OTA set with an integer', async() => {
        var exception = null;
        try {
            ringSignData = await utils.genRingSignData(recipient1, keyPairs[0], 156325153)
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'invalid argument 2: json: cannot unmarshal number into Go value of type string';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

})

describe('Abnormal input test -- refund wancoin', function() {
    before(async() => {
        await utils.unlockAccount(recipient1, "wanglu", 999999999);
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
        refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, utils.toWei(coinValue));
    })

    beforeEach(async() => {

    })

    it('TC1084: value is 3', async() => {
        var exception = null;
        try {
            refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, 3)
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1085: value is -3', async() => {
        var exception = null;
        try {
            refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, -3)
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1086: value is 0xai', async() => {
        var exception = null;
        try {
            refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, '0xai')
            const txObj = {
                from: recipient1,
                to: coinSCAddress,
                data: refundCoinData
            }

            const txHash = await utils.sendTransaction(txObj)
        } catch (e) {
            exception = e;
        }

        expectExceptionMsg = 'new BigNumber() not a base 16 number: ai';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1087: value is 0xb', async() => {
        var exception = null;
        try {
            refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, 0xb)
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1088: value is -0', async() => {
        var exception = null;
        try {
            refundCoinData = utils.coinSC.refundCoin.getData(ringSignData, -0)
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1090: ring sign data is empty string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1091: ring sign data is only "0x"', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1092: input a part of ring sign data', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1093: ring sign data is appended by unused bytes', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1094: ring sign data is modified with random byte', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1095: ring sign data is a number', async() => {
        var exception = null;
        try {
            refundCoinData = utils.coinSC.refundCoin.getData(154652216548455, utils.toWei(coinValue))
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1096: only input one parameter', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1097: value is 20 wancoin', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1098: value is 22 wancoin', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1099: value is 0 wancoin', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });



    it('TC1100: value is very lager', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1101: value is -10 wancoin', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1102: value is a non-digital string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1103: value is decimal digital string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1104: value is hex digital string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1105: value is empty string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1106: data is not assigned', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1106: data is empty string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1107: data is only "0x"', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1108: data is not initialised', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1108: data is cut 1 byte from', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1108: data is cut some bytes from', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1108: data is cut some bytes from', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1109: data is appended by unused bytes', async() => {
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

    it('TC1109: data is appended by unused bytes', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1110: data is modified', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1110: data is modified', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1111: data is digital', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1117: gas is 0', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1118: gas is -0', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1119: gas is -1000000', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1120: gas is non-digital string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1122: gas price is 0', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


    it('TC1123: gas price is -0', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1124: gas price is -20000000000000', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });

    it('TC1125: gas price is non-digital string', async() => {
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
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });
*/
    it('TC1127: refund twice from one OTA', async() => {
        var exception = null;
        const txObj = {
            from: recipient1,
            to: coinSCAddress,
            data: refundCoinData,
            gas: 4700000
        }
        txHash = null;
        try {
            txHash = await utils.sendTransaction(txObj);
        } catch (e) {
            exception = e;
        }
        assert(exception === null, 'Exception should be null, but is ' + exception);

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

        try {
            const txHash = await utils.sendTransaction(txObj);
        } catch (e) {
            exception = e;
        }
        expectExceptionMsg = 'OTA is reused';
        assert(exception != null, 'Exception should not be null');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    });


})

describe('Stop Filter', function() {
    it('should stop filter', () => {
        utils.filter.stopWatching()
    })
})