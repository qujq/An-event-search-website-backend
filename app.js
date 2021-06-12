// 'use strict';

// // [START gae_node_request_example]
const express = require('express');
const app = express();
var request = require("request");

app.get('/', (req, res) => {
  // res.status(200).send('Hello, world!').end();
  console.log("req.query")
  console.log(req.query)
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
