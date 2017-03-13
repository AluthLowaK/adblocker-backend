/**
 * Created by nayana on 3/13/17.
 */

var bitcoin_rpc = require('node-bitcoin-rpc');
bitcoin_rpc.init('54.235.237.34', 49568, 'coind', 'dnioc');

bitcoin_rpc.call('getnewaddress', {account: 'foobar'}, function (err, res) {
    if (err !== null) {
        console.log('I have an error :( ' + err + ' ' + res);
    } else {
        console.log('Yay! I need to do whatevere now with ' + res.result);
    }
});