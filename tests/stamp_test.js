const {accounts, protocol, host, port, stampsValue, stampSCAddress, waitBlockNumber} = require('../config')
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


    it("Buy stamp normal", async() => {

      for (i=0;i<stampsValue.length;i++) {
        console.log("index=" + i)
        OTAStamp = await utils.genOTA(wanAddr)
        OTAAltTokenSender = await utils.genOTA(wanAddr)
        OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

        OTAStamp.should.be.a('string')
        OTAAltTokenSender.should.be.a('string')
        OTAAltTokenRecipient.should.be.a('string')

        stampFaceValue = stampsValue[i]
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
        buyStampData.should.be.a('string')


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
      }

    })


    it("TC2006", async() => {
        i = 0
        OTAStamp = await utils.genOTA(wanAddr)
        OTAAltTokenSender = await utils.genOTA(wanAddr)
        OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

        OTAStamp.should.be.a('string')
        OTAAltTokenSender.should.be.a('string')
        OTAAltTokenRecipient.should.be.a('string')

        stampFaceValue = stampsValue[i]
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
        buyStampData.should.be.a('string')


        const txObj = {
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }

        try {
          const txHash = await utils.sendTransaction(txObj)
        } catch(e) {
           exception = e;
        }

        assert(exception != null, 'exception is not null');
         assert(exception.message == 'invalid address', 'exception is : invalid address');

    })


    it("TC2007", async() => {

      i = 0
      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = stampsValue[i]
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:"",
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      assert(exception != null, 'exception is not null');
      assert(exception.message == 'invalid address', 'exception is : invalid address');

    })


    it("TC2008", async() => {

      i = 0

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = stampsValue[i]
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender.substr(0,sender.length - 2) ,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      assert(exception != null, 'exception is not null');
      assert(exception.message == 'invalid address', 'exception is : invalid address');

    })


    it("TC2009", async() => {

      i = 0

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = stampsValue[i]
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender+ "00",
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      assert(exception != null, 'exception is not null');
      assert(exception.message == 'invalid address', 'exception is : invalid address');

    })

    it("TC2011", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.01
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      assert(exception != null, 'exception is not null');
      assert(exception.message == 'stamp value is not support', 'exception is : stamp value is not support');

    })


    it("TC2012", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = -0.01
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.value of type *hexutil.Big';
      assert(exception != null, 'exception is not null');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);


    })


    it("TC2013", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'stamp value is not support';
      assert(exception != null, 'invalid argument 0');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);


    })


    it("TC2014", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = -0
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'stamp value is not support';
      assert(exception != null, 'invalid argument 0');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);


    })



    it("TC2016", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp.substr(0,30), utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')


      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid OTA AX';
      assert(exception != null, 'invalid OTA AX');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);


    })



    it("TC2017", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp  + "0001", utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')

      //console.log(buyStampData.toString(16))
      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid OTA AX';
      assert(exception != null, 'invalid OTA AX');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    })



    it("TC2018", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp.substr(0,130), utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')

      //console.log(buyStampData.toString(16))
      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid OTA AX';
      assert(exception != null, 'invalid OTA AX');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    })


    it("TC2019", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp.substr(2,132), utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')

      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'hex string without 0x prefix';
      assert(exception != null, 'hex string without 0x prefix');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    })


    it("TC2020", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      OTAStamp = OTAStamp.substr(0,120) + 'pppppppppppp'
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')

      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid hex string';
      assert(exception != null, 'invalid hex string');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);
    })


    it("TC2021", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      OTAStamp = ''
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')

      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'empty hex string';
      assert(exception != null, 'empty hex string');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2022", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.003
      buyStampData = utils.stampSC.buyStamp.getData('0x', utils.toWei(stampFaceValue))
      buyStampData.should.be.a('string')

      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid OTA AX';
      assert(exception != null, 'invalid OTA AX');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


      it("TC2023", async() => {

        OTAStamp = await utils.genOTA(wanAddr)
        OTAAltTokenSender = await utils.genOTA(wanAddr)
        OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

        OTAStamp.should.be.a('string')
        OTAAltTokenSender.should.be.a('string')
        OTAAltTokenRecipient.should.be.a('string')

        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(1234567890, utils.toWei(stampFaceValue))
        buyStampData.should.be.a('string')

        //console.log(buyStampData)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }

        try {
          const txHash = await utils.sendTransaction(txObj)
        } catch(e) {
          exception = e;
        }

        expectExceptionMsg = 'empty hex string';
        assert(exception != null, 'error parameters');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

      })


      it("TC2025", async() => {

        OTAStamp = await utils.genOTA(wanAddr)
        OTAAltTokenSender = await utils.genOTA(wanAddr)
        OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

        OTAStamp.should.be.a('string')
        OTAAltTokenSender.should.be.a('string')
        OTAAltTokenRecipient.should.be.a('string')

        stampFaceValue = 0.039
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        buyStampData.should.be.a('string')

        //console.log(buyStampData)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }

        try {
          const txHash = await utils.sendTransaction(txObj)
        } catch(e) {
          exception = e;
        }

        expectExceptionMsg = 'mismatched wancoin value';
        assert(exception != null, 'mismatched wancoin value');
        assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

      })

    it("TC2026", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.039
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, 0)
      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'mismatched wancoin value';
      assert(exception != null, 'mismatched wancoin value');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2027", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.039
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, -10)
      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }

      try {
        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'mismatched wancoin value';
      assert(exception != null, 'mismatched wancoin value');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2028", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      stampFaceValue = 0.039
      try {
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000)
      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'Invalid array length';
      assert(exception != null, 'Invalid array length');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2029", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
      stampFaceValue = 'pppp'
      buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
      //console.log(buyStampData)

      const txObj = {
        from:sender,
        to: stampSCAddress,
        value: utils.toWei(stampFaceValue),
        data: buyStampData
      }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'new BigNumber() not a number: pppp';
      assert(exception != null, 'new BigNumber() not a number: pppp');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2030", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = '12'
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        //console.log(buyStampData)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'mismatched wancoin value';
      assert(exception != null, 'mismatched wancoin value');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2031", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = '0x34'
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        //console.log(buyStampData)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'mismatched wancoin value';
      assert(exception != null, 'mismatched wancoin value');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2033", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        buyStampData = buyStampData.substr(2,buyStampData.length)
        //console.log(buyStampData)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.data of type hexutil.Bytes';
      assert(exception != null, 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.data of type hexutil.Bytes');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2034", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        buyStampData = "0x8847850000000000000000000000009999599599959595995959959988490088888888"
        //console.log(buyStampData)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'error parameters';
      assert(exception != null, 'error parameters');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2035", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)

        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: ''
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'error parameters';
      assert(exception != null, 'error parameters');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2036", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        buyStampData = '0x0ieu00778899'
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field SendTxArgs.data of type hexutil.Bytes';
      assert(exception != null, 'invalid argument 0: json: cannot unmarshal invalid hex string into Go struct field SendTxArgs.data of type hexutil.Bytes');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2037", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        buyStampData = '0x'
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'error parameters';
      assert(exception != null, 'error parameters');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2038", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        buyStampData = 8939400032
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.data of type hexutil.Bytes';
      assert(exception != null, 'invalid argument 0: json: cannot unmarshal non-string into Go struct field SendTxArgs.data of type hexutil.Bytes');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2040", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData,
          gas:0
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'intrinsic gas too low';
      assert(exception != null, 'intrinsic gas too low');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2041", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData,
          gas:-1000000
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gas of type *hexutil.Big';
      assert(exception != null, 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gas of type *hexutil.Big');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2042", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, stampFaceValue)
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData,
          gas:"kkk"
        }


        const txHash = await utils.sendTransaction(txObj)
      } catch(e) {
        exception = e;
      }

      expectExceptionMsg = 'new BigNumber() not a number: kkk';
      assert(exception != null, 'new BigNumber() not a number: kkk');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


    it("TC2044", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData,
          gasPrice: 0
        }


        const txHash = await utils.sendTransaction(txObj)
        console.log(txHash)
      } catch(e) {
        exception = e;
        //console.log(e.message)
      }

      expectExceptionMsg = 'transaction underpriced';
      assert(exception != null, 'transaction underpriced');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2045", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData,
          gasPrice: -20000000000
        }


        const txHash = await utils.sendTransaction(txObj)
        console.log(txHash)
      } catch(e) {
        exception = e;
        //console.log(e.message)
      }

      expectExceptionMsg = 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gasPrice of type *hexutil.Big';
      assert(exception != null, 'invalid argument 0: json: cannot unmarshal hex string without 0x prefix into Go struct field SendTxArgs.gasPrice of type *hexutil.Big');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })

    it("TC2046", async() => {

      OTAStamp = await utils.genOTA(wanAddr)
      OTAAltTokenSender = await utils.genOTA(wanAddr)
      OTAAltTokenRecipient = await utils.genOTA(wanAddrR)

      OTAStamp.should.be.a('string')
      OTAAltTokenSender.should.be.a('string')
      OTAAltTokenRecipient.should.be.a('string')

      try {
        stampFaceValue = 0.003
        buyStampData = utils.stampSC.buyStamp.getData(OTAStamp, utils.toWei(stampFaceValue))
        const txObj = {
          from:sender,
          to: stampSCAddress,
          value: utils.toWei(stampFaceValue),
          data: buyStampData,
          gasPrice: "yeye"
        }


        const txHash = await utils.sendTransaction(txObj)
       // console.log(txHash)
      } catch(e) {
        exception = e;
        //console.log(e.message)
      }

      expectExceptionMsg = 'new BigNumber() not a number: yeye';
      assert(exception != null, 'new BigNumber() not a number: yeye');
      assert(exception.message == expectExceptionMsg, 'exception is : ' + expectExceptionMsg + "; actual is:" + exception.message);

    })


})