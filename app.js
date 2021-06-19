// 'use strict';

// // [START gae_node_request_example]
const express = require('express');
const app = express();
// var request = require("request");
const axios = require('axios');
const util = require('util');
var geohash = require('ngeohash');
var SpotifyWebApi = require('spotify-web-api-node');

// Search for events
app.get('/', (req, res) => {
  console.log("req.query::::")
  console.log(req.query)

  // Get geohash code
  console.log("***geohash: ", geohash.encode(req.query.latitude, req.query.longitude, precision=7));
  var geohashResult = geohash.encode(req.query.latitude, req.query.longitude, precision=7)

  // 
  ticketmasterBaseUrl = "https://app.ticketmaster.com/discovery/v2/events.json?apikey=Qf8PRg3ggae12R8TRPqlTRnJdD6EE3q3" 
  ticketmasterBaseUrl += "&geoPoint=" + geohashResult
  ticketmasterBaseUrl += "&radius=" + req.query.distance
  if(req.query.category != 'All'){
    if(req.query.category == 'Music'){
      segmentId = 'KZFzniwnSyZfZ7v7nJ'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'Sports'){
      segmentId = 'KZFzniwnSyZfZ7v7nE'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'ArtsTheatre'){
      segmentId = 'KZFzniwnSyZfZ7v7na'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'Films'){
      segmentId = 'KZFzniwnSyZfZ7v7nn'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
    else if(req.query.category == 'Miscellaneous'){
      segmentId = 'KZFzniwnSyZfZ7v7n1'
      ticketmasterBaseUrl += "&segmentId=" + segmentId
    }
  }
  
  ticketmasterBaseUrl += "&unit=" + req.query.distanceUnit
  ticketmasterBaseUrl += "&keyword=" + req.query.keyword
  console.log(ticketmasterBaseUrl)
  axios.get(ticketmasterBaseUrl)
  .then(response => {
    console.log(response.data)
    // Send feedback to front-end
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data))
    console.log("send finished!")
  })
  .catch(error => {
    console.log(error);
  });

});

// Auto-complete
app.get('/autocomplete', (req, res) => {
  console.log("req.query::::")
  console.log(req.query)

  // Request ticketmaster api
  axios.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=Qf8PRg3ggae12R8TRPqlTRnJdD6EE3q3&keyword=' + req.query.keyword)
  .then(response => {

    // Send feedback to front-end
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data._embedded));
    console.log("Auto-complete send finished!")
  })
  .catch(error => {
    console.log(error);
  });
  
});

// Search artists
app.get('/spotify', (req, res) => {
  console.log("req.query::")
  console.log(req.query)

  // Set necessary parts of the credentials on the constructor
  var spotifyApi = new SpotifyWebApi({
    clientId: 'cd1d239d6a7b4a71bfb5e4fb9ea1b579',
    clientSecret: 'f76c7399e1354769b184780920f7b568'
  });

  // Get an access token and 'save' it using a setter
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
      console.log('The access token is ' + data.body['access_token']);

      var spotifyApi = new SpotifyWebApi({
        clientId: 'cd1d239d6a7b4a71bfb5e4fb9ea1b579',
        clientSecret: 'f76c7399e1354769b184780920f7b568'
      });
      spotifyApi.setAccessToken(data.body['access_token']);

      // Set the credentials when making the request
      var spotifyApi = new SpotifyWebApi({
        accessToken: data.body['access_token']
      });

      // Do search using the access token
      spotifyApi.searchArtists(req.query['artist']).then(
      // spotifyApi.searchArtists(["Maroon 5", "Blackbear"]).then(
        function(data) {
          console.log("artist:", data.body);
          res.header("Access-Control-Allow-Origin","*");
          res.send(JSON.stringify(data.body));
          console.log("artists send finished!")
        },
        function(err) {
          console.log('Something went wrong!', err);
        }
      );


    },
    function(err) {
      console.log('Something went wrong!', err);
    }
  );

  
});

// Search venue details
app.get('/venueDetail', (req, res) => {
  console.log("req.query:")
  console.log(req.query)

  // Request ticketmaster api
  axios.get('https://app.ticketmaster.com/discovery/v2/venues.json?apikey=Qf8PRg3ggae12R8TRPqlTRnJdD6EE3q3&id=' + req.query.id)
  .then(response => {

    // Send feedback to front-end
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data._embedded));
    console.log("Auto-complete send finished!")
  })
  .catch(error => {
    console.log(error);
  });
  
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
