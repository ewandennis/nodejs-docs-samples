'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const SparkPost = require('sparkpost');
const spClient = new SparkPost(process.env.SPARKPOST_API_KEY);

const app = express();

// Setup view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Parse form data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => res.render('index'));

app.post('/hello', (req, res, next) => {
  spClient.transmissions.send({
    options: { sandbox: true },
    content: {
      from: 'appengine-node-demo@sparkpostbox.com',
      subject: 'Hello from Google AppEngine!',
      html:'<html><body><p>Google AppEngine + Node.js + SparkPost = awesome!</p></body></html>'
    },
    recipients: [
      {address: req.body.email} 
    ]
  }).then(result => {
    res.render('index', {sent: true});
  }).catch(err => {
    res.render('index', {err: err});
    console.error(err);
  });
});

app.listen(process.env.PORT || 8080);

