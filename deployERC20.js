const {protocol, host, port} = require('./config')
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(`${protocol}://${host}:${port}`))
const utils = require('./utils')

const contractObj = {
	from: web3.eth.accounts[0], 
     data: '0x6060604052732cc79fa3b80c5b9b02051facd02478ea88a78e2c600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550341561006457600080fd5b611420806100736000396000f3006060604052600436106100e6576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100f2578063095ea7b31461018057806318160ddd146101da578063209194e61461020357806323b872dd14610301578063313ce5671461037a57806341267ca2146103a357806370a08231146103f05780637f0bd8811461043d57806395d89b4114610492578063a3796c1514610520578063a9059cbb146105a5578063ce6ebd3d146105ff578063dd62ed3e1461064c578063df4ebd9d146106b8578063f8a5b335146106fe575b6100ef336107b0565b50005b34156100fd57600080fd5b6101056108f1565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561014557808201518184015260208101905061012a565b50505050905090810190601f1680156101725780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561018b57600080fd5b6101c0600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061092a565b604051808215151515815260200191505060405180910390f35b34156101e557600080fd5b6101ed610aae565b6040518082815260200191505060405180910390f35b341561020e57600080fd5b610286600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050610ab4565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156102c65780820151818401526020810190506102ab565b50505050905090810190601f1680156102f35780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561030c57600080fd5b610360600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610c6e565b604051808215151515815260200191505060405180910390f35b341561038557600080fd5b61038d610ede565b6040518082815260200191505060405180910390f35b34156103ae57600080fd5b6103da600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610ee3565b6040518082815260200191505060405180910390f35b34156103fb57600080fd5b610427600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610efb565b6040518082815260200191505060405180910390f35b341561044857600080fd5b610450610f44565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561049d57600080fd5b6104a5610f6a565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104e55780820151818401526020810190506104ca565b50505050905090810190601f1680156105125780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561052b57600080fd5b6105a3600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091908035906020019091905050610fa3565b005b34156105b057600080fd5b6105e5600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050611040565b604051808215151515815260200191505060405180910390f35b341561060a57600080fd5b610636600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061119d565b6040518082815260200191505060405180910390f35b341561065757600080fd5b6106a2600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506111e6565b6040518082815260200191505060405180910390f35b6106e4600480803573ffffffffffffffffffffffffffffffffffffffff169060200190919050506107b0565b604051808215151515815260200191505060405180910390f35b341561070957600080fd5b610735600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061126d565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561077557808201518184015260208101905061075a565b50505050905090810190601f1680156107a25780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6000808273ffffffffffffffffffffffffffffffffffffffff16141515156107d757600080fd5b67016345785d8a000034101515156107ee57600080fd5b610843600a3402600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461131d90919063ffffffff16565b600260008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc349081150290604051600060405180830381858888f1935050505015156108e857600080fd5b60019050919050565b6040805190810160405280600d81526020017f57616e546f6b656e2d426574610000000000000000000000000000000000000081525081565b6000808214806109b657506000600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054145b15156109be57fe5b81600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60005481565b610abc61133b565b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015610b40576040805190810160405280601481526020017f73656e64657220746f6b656e20746f6f206c6f770000000000000000000000008152509050610c67565b81600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555082600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190610c2d92919061134f565b506040805190810160405280600781526020017f737563636573730000000000000000000000000000000000000000000000000081525090505b9392505050565b600081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410158015610d3b575081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410155b15610ed25781600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050610ed7565b600090505b9392505050565b601281565b60046020528060005260406000206000915090505481565b6000600260008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b6040805190810160405280600881526020017f57616e546f6b656e00000000000000000000000000000000000000000000000081525081565b80600460008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020908051906020019061103a92919061134f565b50505050565b600081600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015156111925781600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600260008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a360019050611197565b600090505b92915050565b6000600460008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6000600360008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60056020528060005260406000206000915090508054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113155780601f106112ea57610100808354040283529160200191611315565b820191906000526020600020905b8154815290600101906020018083116112f857829003601f168201915b505050505081565b600080828401905083811015151561133157fe5b8091505092915050565b602060405190810160405280600081525090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061139057805160ff19168380011785556113be565b828001600101855582156113be579182015b828111156113bd5782518255916020019190600101906113a2565b5b5090506113cb91906113cf565b5090565b6113f191905b808211156113ed5760008160009055506001016113d5565b5090565b905600a165627a7a72305820ee82440ed891470f1052389ccaf36a939f048acbaa9467785333610a6a374f450029', 
     gas: '4700000'
}

async function deploy(obj) {
	await utils.unlockAccount(web3.eth.accounts[0], "wanglu", 9999)
	await utils.sendTransaction(obj)
}

deploy(contractObj)