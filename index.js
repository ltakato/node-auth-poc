const express = require('express');
const app = express();

const products = require('./products');

app.get('/products', (req, res) => {
  res.send(products);
});

app.listen(3000, () => console.log('app listening on port 3000'));
