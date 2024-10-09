const express = require('express');
const app = express();
const storeService = require('./store-service');


const PORT = process.env.PORT || 8080;

// Serving static files
app.use(express.static('public'));

// Route to about page
app.get('/about', (req, res) => {
    res.sendFile(__dirname + '/views/about.html');
});

// Redirect root to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});

app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
});
// Route to fetch all published items for /shop
app.get('/shop', (req, res) => {
    storeService.getAllItems().then(items => {
      const publishedItems = items.filter(item => item.published === true);
      res.json(publishedItems);
    }).catch(err => {
      res.status(500).send("Unable to retrieve items.");
    });
  });
  
  // Route to fetch all items for /items
  app.get('/items', (req, res) => {
    storeService.getAllItems().then(items => {
      res.json(items);
    }).catch(err => {
      res.status(500).send("Unable to retrieve items.");
    });
  });
  
  // Route to fetch all categories for /categories
  app.get('/categories', (req, res) => {
    storeService.getAllCategories().then(categories => {
      res.json(categories);
    }).catch(err => {
      res.status(500).send("Unable to retrieve categories.");
    });
  });
  
  // Handle non-matching routes (404)
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  