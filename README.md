# Maitree Jain — Portfolio + Full-Stack Mini Apps

This repo combines three deliverables into one site:

1. **Personal Portfolio** (`index.html`) — About, Experience, Projects, Skills, Hackathons, Contact. Static, fully responsive (media queries at 768px / 640px / 480px).
2. **Notes & Tasks** (`/todo-app`) — full-stack to-do/notes app. Node.js + Express backend, JSON-file persistence (no external DB to install). CRUD via REST API, with filtering, priorities, and due dates.
3. **Product Listing** (`/product-listing`) — full-stack catalog page. Node.js + Express backend filters and sorts products **server-side** via query params (category, price range, sort order).
4. `/quiz-carousel-app` — the earlier "Advanced Styling & JavaScript" mini app (image carousel + quiz + weather/joke APIs), kept as-is.

All three interactive pieces share the same design system (rose/lavender/mint palette, Playfair Display + DM Sans) so the whole site feels like one product.

## How to run

### 1. Portfolio (static, no server needed)
Just open `index.html` in a browser, or serve the root folder with any static server / GitHub Pages.

### 2. Notes & Tasks (full-stack)
```bash
cd todo-app
npm install
npm start
```
Visit **http://localhost:4000**. Tasks are saved to `todo-app/data/todos.json` — restart the server and your tasks are still there.

### 3. Product Listing (full-stack)
```bash
cd product-listing
npm install
npm start
```
Visit **http://localhost:4001**. Product data lives in `product-listing/data/products.json`; filtering/sorting happens on the server via `/api/products?category=&minPrice=&maxPrice=&sort=`.

### Running everything together
Open three terminals (or use a process manager like `concurrently`):
```bash
# terminal 1
cd todo-app && npm install && npm start        # http://localhost:4000

# terminal 2
cd product-listing && npm install && npm start # http://localhost:4001

# terminal 3 (optional) — serve the portfolio
npx serve .                                     # or just open index.html
```
The portfolio's "Projects" section links directly to both live apps.

## API reference

**To-Do app** (`todo-app/server.js`)
| Method | Route            | Body                                   | Description            |
|--------|------------------|-----------------------------------------|-------------------------|
| GET    | `/api/todos`     | —                                       | List all tasks          |
| POST   | `/api/todos`     | `{ text, priority, dueDate }`           | Create a task           |
| PUT    | `/api/todos/:id` | `{ text?, completed?, priority?, dueDate? }` | Update a task      |
| DELETE | `/api/todos/:id` | —                                       | Delete a task            |
| DELETE | `/api/todos`     | —                                       | Clear all completed tasks|

**Product Listing** (`product-listing/server.js`)
| Method | Route              | Query params                                      | Description                  |
|--------|--------------------|----------------------------------------------------|-------------------------------|
| GET    | `/api/products`   | `category, minPrice, maxPrice, sort`              | Filtered + sorted product list |
| GET    | `/api/categories` | —                                                  | Distinct category list for the filter dropdown |

## Tech used
HTML5, CSS3 (Flexbox, Grid, media queries), vanilla JavaScript (`fetch`, `async/await`, DOM manipulation), Node.js, Express, JSON-file persistence.
