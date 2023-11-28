import { promisify } from 'util';

const express = require('express');
const redis = require('redis');

const app = express();
const port = 1245;

const listProducts = [
  {
    itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4,
  },
  {
    itemId: 2, itemName: 'Suitcase 450', price: 100, initialAvailableQuantity: 10,
  },
  {
    itemId: 3, itemName: 'Suitcase 650', price: 350, initialAvailableQuantity: 2,
  },
  {
    itemId: 4, itemName: 'Suitcase 1050', price: 550, initialAvailableQuantity: 5,
  },
];

const getItemById = (id) => {
  const itemList = listProducts.filter((item) => item.itemId === id);
  return itemList[0];
};
let redisClient;
(async () => {
  redisClient = redis.createClient();
  redisClient.on('error', (error) => {
    console.error(`Redis client not connected to the server : ${error}`);
  });
  redisClient.on('ready', () => {
    console.log('Redis client connected to the server');
  });
})();

const reserveStockById = (itemId, stock) => {
  redisClient.set(itemId, stock);
};

const getCurrentReservedStockById = async (itemId) => {
  const promiseData = promisify(redisClient.get).bind(redisClient);
  const stock = await promiseData(itemId);
  if (stock === null) return 0;
  return stock;
};
app.get('/list_products/', (req, res) => {
  res.json(listProducts);
});

app.get('/list_products/:itemId(\\d+)', async (req, res) => {
  const param = parseInt(req.params.itemId, 10);
  const item = getItemById(param);
  if (item) {
    const stock = await getCurrentReservedStockById(param);
    const result = item.initialAvailableQuantity - parseInt(stock, 10);
    // store positive values
    const curr = result < 0 ? 0 : result;
    item.currentQuantity = curr;
    res.json(item);
    return;
  }
  res.json({ status: 'Product not found' });
});

app.get('/reserve_product/:itemId', async (req, res) => {
  const param = parseInt(req.params.itemId, 10);
  const item = getItemById(param);
  if (item) {
    let stock = await getCurrentReservedStockById(param);
    if (stock > item.initialAvailableQuantity) {
      res.json({ status: 'Not enough stock available', itemId: param });
      return;
    }
    stock = parseInt(stock, 10);
    reserveStockById(param, stock + 1);
    res.json({ status: 'Reservation confirmed', itemId: param });
    return;
  }
  res.json({ status: 'Product not found' });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
