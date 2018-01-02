const config = {};

// web3 parameter
config.protocol = 'http'
config.host = '192.168.1.58'; // http://localhost
config.port = 5555;

// precompiled contracts 
config.glueSCAddress = '0x0000000000000000000000000000000000000000'
config.coinSCAddress = '0x0000000000000000000000000000000000000064'
config.stampSCAddress = '0x00000000000000000000000000000000000000c8'
config.tokenSCAddress = '0x03a765f3479d816f589ea7004e06426f96a180fb'

config.coinABI = [{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}],"name":"buyCoinNote","outputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}],"name":"refundCoin","outputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"inputs":[],"name":"getCoins","outputs":[{"name":"Value","type":"uint256"}]}]

config.stampABI = [{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}],"name":"buyStamp","outputs":[{"name":"OtaAddr","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}],"name":"refundCoin","outputs":[{"name":"RingSignedData","type":"string"},{"name":"Value","type":"uint256"}]},{"constant":false,"type":"function","stateMutability":"nonpayable","inputs":[],"name":"getCoins","outputs":[{"name":"Value","type":"uint256"}]}]

config.tokenABI = [{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_toKey","type":"bytes"},{"name":"_value","type":"uint256"}],"name":"otatransfer","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"privacyBalance","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":false,"inputs":[{"name":"initialBase","type":"address"},{"name":"baseKeyBytes","type":"bytes"},{"name":"value","type":"uint256"}],"name":"initPrivacyAsset","outputs":[],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function","stateMutability":"nonpayable"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"otabalanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function","stateMutability":"view"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"otaKey","outputs":[{"name":"","type":"bytes"}],"payable":false,"type":"function","stateMutability":"view"}]

config.glueABI = [{"constant":false,"type":"function","inputs":[{"name":"RingSignedData","type":"string"},{"name":"CxtCallParams","type":"bytes"}],"name":"combine","outputs":[{"name":"RingSignedData","type":"string"},{"name":"CxtCallParams","type":"bytes"}]}]

config.accounts = [
	"0xdb05642eabc8347ec78e21bdf0d906ba579d423a",
	"0xf9b32578b4420a36f132db32b56f3831a7cc1804",
	"0x5af4e0db44487d59503f1ce5925de63da78fd645",
	"0x0036805b6846f26ac35f2a7d7eda4a2a58f08e8e",
	"0xc38eb01bce9bcb61327532dc5a540da4cf484ae5",
	"0x3a46ef1eb55428b3b88a222d80d23531054ef51d", 
	"0x810524175efa012446103d1a04c9f4263a962acc", 
	"0xb5eb9bf02a924367ed9d4f86dfcb1c572cd9a4f8", 
	"0xf073d4e52c506f3f288faa9db1c1e5ae0f1e70f8", 
	"0x7e98bc5a465c1d2afa6b9376709a525981f53d49", 
	"0xfb34f7ce48591f3fa6f30a62fcdba8da38583c42"
]

config.waitBlockNumber = 12
config.OTASetSize = 2

config.pwd = "wanglu"

// wan coin transfer test
config.coinValue = 10

// alts transfer test
config.tokenValue = 100
config.stampFaceValue = 0.09

module.exports = config;
