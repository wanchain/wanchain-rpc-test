const config = {};

// web3 parameter
config.protocol = 'http'
config.host = 'localhost'; // http://localhost
config.port = 8545;
// config.host = '52.221.20.190'; // http://localhost
// config.port = 8545;

config.debug = false

// precompiled contracts 
config.glueSCAddress = '0x0000000000000000000000000000000000000000'
config.coinSCAddress = '0x0000000000000000000000000000000000000064'
config.stampSCAddress = '0x00000000000000000000000000000000000000c8'
// config.tokenSCAddress = '0x03a765f3479d816f589ea7004e06426f96a180fb'  // test net
config.tokenSCAddress = '0x58e9c6d0fda50fb344a4b4117629ac6076b716c4'     // main net

config.coinABI = [{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}],"name":"buyCoinNote","outputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}],"name":"refundCoin","outputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"inputs":[],"name":"getCoins","outputs":[{"name":"Value","type":"uint256"}]}]

config.stampABI = [{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}],"name":"buyStamp","outputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}],"name":"refundCoin","outputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[],"name":"getCoins","outputs":[{"name":"Value","type":"uint256"}]}]

config.tokenABI = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_toKey","type":"bytes"},{"name":"_value","type":"uint256"}],"name":"otatransfer","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"privacyBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[{"name":"initialBase","type":"address"},{"name":"baseKeyBytes","type":"bytes"},{"name":"value","type":"uint256"}],"name":"initPrivacyAsset","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"otabalanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"otaKey","outputs":[{"name":"","type":"bytes"}],"payable":false,"type":"function","stateMutability":"view"}]

config.glueABI = [{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"CxtCallParams","type":"bytes"}],"name":"combine","outputs":[{"name":"RingSignedData","type":"string"},{"name":"CxtCallParams","type":"bytes"}]}]

config.accounts = [
    "0xeD1Baf7289c0acef52dB0c18E1198768EB06247e",
    "0x6A8299deccd420d5b6970d611AFB25Cc8e910220",
    "0x8Da69Cf031fe52C370aF261c193364e43aA01222"
]

config.stampsValue = [
 	0.001,
	0.002,
	0.005,
	0.003,
	0.006,
  0.009,
 	0.03,
  0.06,
  0.09,
//  0.5,
//	1,
//  1.5

]

config.waitBlockNumber = 12
config.OTASetSize = 2

config.pwd = "wanglu"

// wan coin transfer test
config.coinValue = 10

// alts transfer test
config.tokenValue = 100
config.stampFaceValue = 0.5
config.tokenTransferGasPrice = 200000000000

module.exports = config;
