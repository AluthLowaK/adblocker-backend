/**
 * Created by nayana on 3/12/17.
 */
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());

const https = require('https');
const fs = require('fs');

var couchbase = require('couchbase')
var cluster = new couchbase.Cluster('couchbase://localhost/');
var bucket = cluster.openBucket('default');
var N1qlQuery = couchbase.N1qlQuery;

var bitcoin_rpc = require('node-bitcoin-rpc');
bitcoin_rpc.init('54.235.237.34', 49568, 'coind', '*****');

app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.post('/wallet', function (req, resp) {
    bucket.get('user:' + req.body.cid, function (err, result) {
        if (result.value.coinaddr === null || result.value.coindaddr === undefined) {
            console.log(result);
            bitcoin_rpc.call("getnewaddress", {account: req.body.cid}, function (err, res) {
                if (err !== null) {
                    console.log('error creating');
                    return false;
                } else {
                    resp.setHeader('Content-Type', 'application/json');

                    var wallet = {addr: res.result, account: req.body.cid};
                    bucket.upsert('user:' + req.body.cid, {wallet: wallet}, function (err, cresp) {
                        console.log(cresp);
                    });
                    resp.send(JSON.stringify({status: 0, wallet: wallet }));
                }
            });
        }
    });
});

app.post('/register', function (req, res) {
    bucket.upsert('user:' + req.body.cid, {
            'email': req.body.user, 'password': req.body.pass
        },
        function (err, result) {
            res.setHeader('Content-Type', 'application/json');
            var status = -1;
            if (err === null) status = 0;
            return res.send(JSON.stringify({"status": status, "result": result}));
        }
    );
});

app.post('/login', function (req, res) {
    bucket.get('user:' + req.body.cid, function (err, result) {
        console.log('Got result: %j', result.value);

        var rex = {status: -1, result: "failed"};

        if (result.value.email === req.body.user && result.value.password === req.body.pass) {
            rex = {status: 0, result: "success", wallet: result.value.wallet};
        }
        res.setHeader('Content-Type', 'application/json');
        return res.send(JSON.stringify(rex));
    });
});

app.get('/logout', function (req, res) {
    res.send('Hello World!')
});

/*
app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});
*/


var privateKey = fs.readFileSync( 'privkey.pem' );
var certificate = fs.readFileSync( 'cert.pem' );

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(3000);
