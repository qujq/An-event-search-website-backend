// 'use strict';

// // [START gae_node_request_example]
const express = require('express');
const app = express();
// var request = require("request");
const axios = require('axios');
const util = require('util');

// Search for events
app.get('/', (req, res) => {
  console.log("req.query::::")
  console.log(req.query)
  res.header("Access-Control-Allow-Origin","*");
  res.send(JSON.stringify({"body": 123}));
  console.log("send finished!")
});

// Auto-complete
app.get('/autocomplete', (req, res) => {
  console.log("req.query::::")
  console.log(req.query)

  // Request ticketmaster api
  axios.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey=Qf8PRg3ggae12R8TRPqlTRnJdD6EE3q3&keyword=' + req.query.keyword)
  .then(response => {
    console.log("response from ticketmaster auto-complete");
    console.log(response.data._embedded)
    // console.log(util.inspect(response,{depth:2}));
    res.header("Access-Control-Allow-Origin","*");
    res.send(JSON.stringify(response.data._embedded));
    // res.send(util.inspect(response,{depth:null}));
    console.log("send finished!")
  })
  .catch(error => {
    console.log(error);
  });
  // Send feedback to front-end
  // res.header("Access-Control-Allow-Origin","*");
  // res.send(JSON.stringify({"body": 123456777}));
  // console.log("send finished!")
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
