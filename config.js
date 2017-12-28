const config = {};

// web3 parameter
config.protocol = 'http'
config.host = '192.168.1.58'; // http://localhost
config.port = 5555;

// precompiled contracts 
config.coinSCAddress = '0x0000000000000000000000000000000000000064';
config.stampSCAddress = '0x00000000000000000000000000000000000000c8';

config.coinABI = [{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}],"name":"buyCoinNote","outputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}],"name":"refundCoin","outputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"inputs":[],"name":"getCoins","outputs":[{"name":"Value","type":"uint256"}]}];

config.accounts = [
	"0xdb05642eabc8347ec78e21bdf0d906ba579d423a",
	"0xf9b32578b4420a36f132db32b56f3831a7cc1804",
	"0x5af4e0db44487d59503f1ce5925de63da78fd645"
]

config.waitBlockNumber = 12
config.setSize = 2

config.pwd = "wanglu"

// wan coin transfer 
config.coinValue = 10

module.exports = config;
