require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const postToDevTo = require("./services/postToDevTo");
const port = process.env.PORT || 9000

// Initialize the middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize services
app.use('/post/devto', postToDevTo)

app.listen(port, () => console.log('Listening on port ' + port));
