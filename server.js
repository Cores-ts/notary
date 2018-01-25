const express = require('express');
const path = require('path');
const notary = require('./notaryServerLib.js')

const app = express();

notary.init();



app.set('port', process.env.PORT || 3000);
app.use(express.static('front'));

app.post('/doc/:hash', async function(req, res) {
  notary.sendHash(req.params.hash, function (error, result) {
    if (error) console.log(error);
    res.json(result);
  });
});


app.get('/doc/:hash', function(req, res) {
  notary.findHash(req.params.hash, function (error, result) {
    res.json(result);
  });
});

// 404 catch-all handler (middleware)
app.use(function (req, res, next) {
    res.status(404);
    res.json({
        error: 'route not found'
    });
});

// 500 error handler (middleware)
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.json({
        error: 'server error'
    });

});



app.listen(app.get('port'), function () {
  console.log( 'Server started in ' + app.get('env') +
      ' mode on port: ' + app.get('port') +
      '; press Ctrl-C to terminate.' );
});
