/* =========================================================
   PRODUCT LISTING PAGE — Express backend
   Serves product data from data/products.json and supports
   filtering (category, price range) + sorting via query params.
   ========================================================= */
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4001;
const DATA_FILE = path.join(__dirname, 'data', 'products.json');

app.use(express.static(path.join(__dirname, 'public')));

function readProducts() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8') || '[]');
  } catch (err) {
    return [];
  }
}

// GET /api/products?category=Electronics&minPrice=0&maxPrice=5000&sort=price-asc
app.get('/api/products', (req, res) => {
  let products = readProducts();
  const { category, minPrice, maxPrice, sort } = req.query;

  if (category && category !== 'All') {
    products = products.filter(p => p.category === category);
  }
  if (minPrice) {
    products = products.filter(p => p.price >= Number(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= Number(maxPrice));
  }

  switch (sort) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating-desc':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    default:
      break; // no sort — original order
  }

  res.json(products);
});

// GET /api/categories — distinct category list for the filter UI
app.get('/api/categories', (req, res) => {
  const products = readProducts();
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`✅ Product Listing app running at http://localhost:${PORT}`);
});
