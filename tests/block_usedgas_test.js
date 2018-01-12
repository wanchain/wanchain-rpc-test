const {accounts, protocol, host, port, coinSCAddress, coinValue, waitBlockNumber, OTASetSize, debug} = require('../config')
const utils = require('../utils')
const assert = require('chai').assert
const expect = require('chai').expect
const should = require('chai').should()

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
	keyPairs,
	beginBlockNum,
	endBlockNum


async function IsBlockGasusedEqualTotalTxUsed(block) {
	var txTotalUsedGas = 0;
	var txTotalGasFee = utils.toBig(0);
	for (i = 0; i < block.transactions.length; i++) {
		if (debug) {
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
            console.log("tx hash:" + block.transactions[i]);
        }

		tx = await utils.getTransaction(block.transactions[i]);
        if (tx == null) {
            throw "get tx fail. txhash:" + block.transactions[i];
        }
		if (debug) {
            console.log("tx:");
            console.log(tx);
        }

        txReceipt = await utils.getReceipt(block.transactions[i]);
		if (txReceipt == null) {
			throw "get receipt fail. txhash:" + block.transactions[i];
		}
		if (debug) {
            console.log("tx receipt:");
            console.log(txReceipt);
        }

		txTotalUsedGas += txReceipt.gasUsed;
        txTotalGasFee = txTotalGasFee.plus(utils.toBig(txReceipt.gasUsed).times(tx.gasPrice));
	}
	if (debug) {
        console.log("block.gasUsed:" + block.gasUsed + ", txTotalUsedGas:" + txTotalUsedGas);
    }
	return {equ: (txTotalUsedGas == block.gasUsed), totalGasFee: txTotalGasFee};
}

async function IsGasAddToMiner(block, totalGasFee) {
    var preBlockNumber = block.number - 1;
    if (preBlockNumber < 0) {
    	preBlockNumber = 0;
	}

	var minerPreBalance = await utils.getBalance2(block.miner, preBlockNumber);
    if (debug) {
        console.log("miner:" + block.miner + ", preBlockNum:" + preBlockNumber + ", preBalance:" + minerPreBalance);
    }

    var minerBalance = await utils.getBalance2(block.miner, block.number);
    if (debug) {
        console.log("miner:" + block.miner + ", blockNum:" + block.number + ", balance:" + minerBalance);
    }

    increment = utils.toBig(minerBalance).minus(minerPreBalance);
    if (debug) {
        console.log("minerBalance - minerPreBalance:" + increment.toString() + ", totalGasFee:" + totalGasFee.toString())
    }
    return increment.equals(totalGasFee);
}


describe('block usedgas equilibrium', function() {
    before(async() => {
    })

    beforeEach(async() => {
	})

    it('should return correct balance of receipt1', async() => {
	    beginBlockNum = 7000;
		endBlockNum = -1;

		var lastBlockNum = utils.getBlockNumber();
		console.log("last block number: " + lastBlockNum);
		if (endBlockNum == -1 || endBlockNum > lastBlockNum) {
			endBlockNum = lastBlockNum;
		}

		console.log("begin:" + beginBlockNum + "; end:" + endBlockNum);

    	let i = 0;
		for (i = beginBlockNum; i <= endBlockNum; i++) {
			var block = await utils.getBlock(i);
            if (debug) {
                console.log("begin block " + i);
                console.log(block);
            }

			var usedGasRet = await IsBlockGasusedEqualTotalTxUsed(block);
			assert(usedGasRet.equ, "block usedgas does not equilibrium. blockNumber:" + i);

			var feeEqu = await IsGasAddToMiner(block, usedGasRet.totalGasFee);
            assert(feeEqu, "block used gas fee does not equilibrium to miner reward. blockNumber:" + i);
		}

    	assert(true, "success. last blocknum:" + i);
	});
})

