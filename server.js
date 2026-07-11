require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('./db/connect');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', require('./routes'));

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Connected to DB and listening on port ${port}`);
    });
  }
});