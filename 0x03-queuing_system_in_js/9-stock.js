const express = require('express');
const redis = require('redis');
const { promisify } = require('util');

const app = express();
const port = 1245;

const client = redis.createClient();

// Promisify Redis functions
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Sample product data
const listProducts = [
  {
    itemId: 1, itemName: 'Suitcase 250', price: 50, initialAvailableQuantity: 4,
  },
  {
    itemId: 2,
    itemName: 'Suitcase 450',
    price: 100,
    initialAvailableQuantity: 10,
  },
  {
    itemId: 3,
    itemName: 'Suitcase 650',
    price: 350,
    initialAvailableQuantity: 2,
  },
  {
    itemId: 4,
    itemName: 'Suitcase 1050',
    price: 550,
    initialAvailableQuantity: 5,
  },
];

function getItemById(itemId) {
  return listProducts.find((product) => product.itemId === itemId);
}

// Middleware to parse JSON requests
app.use(express.json());

// Route to list all products
app.get('/list_products', (req, res) => {
  res.json(listProducts);
});

// Route to get product details by itemId
app.get('/list_products/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  // Get the current reserved stock from Redis
  const currentReservedStock = await getCurrentReservedStockById(itemId);

  // Calculate the current available stock
  const currentAvailableQuantity = product.initialAvailableQuantity - currentReservedStock;

  res.json({
    itemId: product.itemId,
    itemName: product.itemName,
    price: product.price,
    initialAvailableQuantity: product.initialAvailableQuantity,
    currentQuantity: currentAvailableQuantity,
  });
});

// Function to reserve stock by itemId
async function reserveStockById(itemId) {
  // Increment the reserved stock in Redis
  await setAsync(`item.${itemId}`, '1');
}

// Function to get current reserved stock by itemId
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);

  return reservedStock ? parseInt(reservedStock) : 0;
}

// Route to reserve a product by itemId
app.get('/reserve_product/:itemId', async (req, res) => {
  const itemId = parseInt(req.params.itemId);
  const product = getItemById(itemId);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const currentReservedStock = await getCurrentReservedStockById(itemId);

  if (currentReservedStock >= product.initialAvailableQuantity) {
    return res.json({ status: 'Not enough stock available', itemId: itemId });
  }

  // Reserve one item (increment reserved stock in Redis)
  await reserveStockById(itemId);

  res.json({ status: 'Reservation confirmed', itemId: itemId });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
