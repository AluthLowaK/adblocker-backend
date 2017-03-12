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


app.get('/', function (req, res) {
    res.send('Hello World!')
});

app.get('/wallet', function (req, res) {
    res.send('Hello World!')
});

app.post('/register', function (req, res) {
    console.log(req.body);
    bucket.manager().createPrimaryIndex(function() {
        bucket.upsert('user:' + req.body.cid, {
                //todo: md5 the pass
                'email': req.body.user, 'password': req.body.pass
            },
            function (err, result) {
                console.log(result);
                /*bucket.get('user:king_arthur', function (err, result) {
                    console.log('Got result: %j', result.value);
                    bucket.query(
                        N1qlQuery.fromString('SELECT * FROM default WHERE $1 in interests LIMIT 1'),
                        ['African Swallows'],
                        function (err, rows) {
                            console.log("Got rows: %j", rows);
                        });
                });*/
            });
    });
});

app.get('/login', function (req, res) {
    res.send('Hello World!')
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
