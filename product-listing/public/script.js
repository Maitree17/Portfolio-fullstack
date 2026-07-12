/* =========================================================
   PRODUCT LISTING — frontend
   Filters & sorts are sent as query params to the Express
   API (server.js), which reads from data/products.json.
   ========================================================= */
const categorySelect = document.getElementById('categorySelect');
const minPriceInput = document.getElementById('minPrice');
const maxPriceInput = document.getElementById('maxPrice');
const sortSelect = document.getElementById('sortSelect');
const resetBtn = document.getElementById('resetBtn');
const productGrid = document.getElementById('productGrid');
const resultCount = document.getElementById('resultCount');

async function loadCategories() {
  try {
    const res = await fetch('/api/categories');
    const categories = await res.json();
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.appendChild(opt);
    });
  } catch (err) {
    // categories are non-critical; ignore failure
  }
}

function buildQuery() {
  const params = new URLSearchParams();
  if (categorySelect.value && categorySelect.value !== 'All') {
    params.set('category', categorySelect.value);
  }
  if (minPriceInput.value) params.set('minPrice', minPriceInput.value);
  if (maxPriceInput.value) params.set('maxPrice', maxPriceInput.value);
  if (sortSelect.value) params.set('sort', sortSelect.value);
  return params.toString();
}

async function loadProducts() {
  resultCount.textContent = 'Loading products…';
  productGrid.innerHTML = '';
  try {
    const query = buildQuery();
    const res = await fetch(`/api/products${query ? '?' + query : ''}`);
    const products = await res.json();
    renderProducts(products);
  } catch (err) {
    productGrid.innerHTML = `<p class="error-text">Couldn't reach the server. Is it running? (npm start)</p>`;
    resultCount.textContent = '';
  }
}

function renderProducts(products) {
  resultCount.textContent = `${products.length} product${products.length === 1 ? '' : 's'} found`;

  if (products.length === 0) {
    productGrid.innerHTML = `<p class="hint">No products match these filters. Try widening your search.</p>`;
    return;
  }

  productGrid.innerHTML = '';
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-icon">${p.icon}</div>
      <div class="product-cat">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-footer">
        <span class="product-price">₹${p.price.toLocaleString('en-IN')}</span>
        <span class="product-rating">⭐ ${p.rating}</span>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

[categorySelect, sortSelect].forEach(el => el.addEventListener('change', loadProducts));
[minPriceInput, maxPriceInput].forEach(el => el.addEventListener('input', debounce(loadProducts, 400)));

resetBtn.addEventListener('click', () => {
  categorySelect.value = 'All';
  minPriceInput.value = '';
  maxPriceInput.value = '';
  sortSelect.value = '';
  loadProducts();
});

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

loadCategories();
loadProducts();
