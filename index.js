'use strict';
var later = require('later'),
    Twitter = require('twitter'),
    request = require('superagent');
require('dotenv').config();
var client = new Twitter({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token_key: process.env.access_token_key,
  access_token_secret: process.env.access_token_secret,
});
later.date.localTime();
var statApi = process.env.PEGKEAPI;
var textSched = later.parse.text('every 6 hour');
var timer2 = later.setInterval(logTime, textSched);
function logTime() {
  request
    .get(statApi)
    .end(function(err, res){
      var d = res.body.last_mod;
      var sstatus = res.body.sstatus.API;
      var theTweet = "All systems " + sstatus + " #PegkeStat Last updated on:" + d + " https://pegke.com/about/system-status";
      client.post('statuses/update', {status: theTweet},  function(error, tweet, response){
        if(error) throw error;
      });
  });
}
