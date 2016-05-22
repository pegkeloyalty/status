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

var feed = require("feed-read");

later.date.localTime();
var statApi = process.env.PEGKEAPI;
var textSched = later.parse.text('every 6 hour');
var timer2 = later.setInterval(statusTweet, textSched);

var randomTweetSched = later.parse.text('every 2 hour');
var timer3 = later.setInterval(randomTweet, randomTweetSched);

function statusTweet() {
  request
    .get(statApi)
    .end(function(err, res){
      var d = res.body.last_mod;
      var sstatus = res.body.sstatus.API;
      var theTweet = "All systems " + sstatus + " #PegkeStat Last updated on:" + d + " https://pegke.com/about/system-status";
      client.post('statuses/update', {status: theTweet, trim_user: 1},  function(error, tweet, response){
        if(error) throw error;
      });
  });
}

function randomTweet() {
  feed("https://pegke.com/feed.xml", function(err, articles) {
    if (err) throw err;
    var feedIndex = Math.floor((Math.random() * 19) + 1);
    var aRandomblog = articles[feedIndex];
    console.log(aRandomblog);
    var tweetContent = aRandomblog.title;
    var myTruncatedTweet = tweetContent.substring(0, 136);
    var myFinalTweet = myTruncatedTweet + '... ' + aRandomblog.link;
    client.post('statuses/update', {status: myFinalTweet, trim_user: 1},  function(error, tweet, response){
      if(error) throw error;
    });
  });
}
