/**
 * Created by 212612730 on 7/13/2017.
 */
const port = process.env.PORT || 3010;
const serveStatic = require('serve-static');

var express = require('express') // express 4
    , app = express()


/*app.get('/', function(req, res) {
 res.sendFile(__dirname + '/index.html');
 });*/
app.use('/', serveStatic('./', {}));


app.listen(port, function() {
    console.log("Server up on : " + port);
});