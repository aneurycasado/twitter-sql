var Sequelize = require('sequelize');
var tweetBank = require('../models/index.js');
module.exports = function(io){
  io.sockets.on("connection",function(sockets){
    sockets.on("editTweet", function(id){
      tweetBank.Tweet.findOne({where: {id: parseInt(id.id)}}).then(function(tweet){
        console.log(tweet);
      });
    });
    sockets.on("deleteTweetServer", function(idObj){
      tweetBank.Tweet.findOne({where: {id: parseInt(idObj.id)}}).then(function(tweet){
        tweet.destroy();
        return tweet.id;}).then(function(id){
          console.log("The data has been deleted from the server");
          console.log(idObj);
          io.emit("deleteTweetClient",idObj);
        });
      });
    });
};
