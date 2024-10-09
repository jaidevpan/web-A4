/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source 
(including 3rd party web sites) or distributed to other students.

Name: Jaidev Panchal
Student ID: 115682239
Date: 09/10/2024
Replit Web App URL: 
GitHub Repository URL:
********************************************************************************/
const express = require('express');
const app = express();
const storeService = require('./store-service');
const path = require('path');


const PORT = process.env.PORT || 8080;

// Serving static files
app.use(express.static('public'));

// Route to about page
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
  });
  

// Redirect root to /about
app.get('/', (req, res) => {
    res.redirect('/about');
});


// Route to fetch all published items for /shop
app.get('/shop', (req, res) => {
    storeService.getPublishedItems()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ message: err }));
  });
  
  
  // Route to fetch all items for /items
  app.get('/items', (req, res) => {
    storeService.getAllItems()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ message: err }));
  });
  
  
  // Route to fetch all categories for /categories
  app.get('/categories', (req, res) => {
    storeService.getCategories()
      .then((data) => res.json(data))
      .catch((err) => res.status(500).json({ message: err }));
  });
  
  // Handle non-matching routes (404)
  app.use((req, res) => {
    res.status(404).send("Page Not Found");
  });
  
  // Initialize the store service and then start the server
storeService.initialize()
.then(() => {
  app.listen(PORT, () => {
    console.log(`Express http server listening on port ${PORT}`);
  });
})
.catch((err) => {
  console.log("Failed to initialize the store: " + err);
});
