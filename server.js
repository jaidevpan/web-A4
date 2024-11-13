/*********************************************************************************
WEB322 – Assignment 02
I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source 
(including 3rd party web sites) or distributed to other students.

Name: Jaidev Panchal
Student ID: 115682239
Date: 09/10/2024
Replit Web App URL: https://replit.com/@jnpanchal/Web322-app
GitHub Repository URL: https://github.com/jaidevpan/Web322-app
********************************************************************************/
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');



// Import required modules
const express = require('express');
const path = require('path');
const storeService = require('./store-service.js'); // Import the store-service module

// Initialize express app
const app = express();
const PORT = process.env.PORT || 8080;

cloudinary.config({
  cloud_name: 'dgen5lfsi',
  api_key: '538496142288271',
  api_secret: 'qQzQRSAgze6McUkBuug7jnR3u3c',
  secure: true
  })

const upload = multer(); // No disk storage, we’re using Cloudinary directly.


//
app.get('/items/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'addItem.html'));  
});

app.post('/items/add', upload.single('featureImage'), (req, res) => {
  // Check if there’s an uploaded file
  if (req.file) {
    // Helper function to upload image as a stream to Cloudinary
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result); // Image uploaded successfully
          } else {
            reject(error); // Image upload failed
          }
        });
        // Convert file buffer to stream and pipe it to Cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    // Async function to perform the upload
    async function upload(req) {
      let result = await streamUpload(req);
      console.log(result); // Log upload result for debugging
      return result;
    }

    // Call the upload function and handle the uploaded URL
    upload(req).then((uploaded) => {
      processItem(uploaded.url); // Pass image URL to processItem
    }).catch((error) => {
      console.error("Upload failed:", error); // Log any errors
      res.redirect('/items'); // Redirect to /items if upload fails
    });
  } else {
    processItem(""); // No image uploaded, pass empty string
  }

  // Function to process form data and add a new item
  function processItem(imageUrl) {
    req.body.featureImage = imageUrl; // Assign image URL to featureImage in req.body

    // TODO: Add code here to save req.body as a new item in your items array

    res.redirect('/items'); // Redirect to the items list after adding the new item
  }
});




// Middleware for serving static files from the public folder
app.use(express.static('public'));

// Redirect the root route ("/") to the about page ("/about")
app.get('/', (req, res) => {
  res.redirect('/about');
});

// Serve the about.html page from the views folder
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Route to get all items (from items.json)
app.get('/items', (req, res) => {
  storeService.getAllItems()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

// Route to get published items (published == true)
app.get('/shop', (req, res) => {
  storeService.getPublishedItems()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});

// Route to get all categories (from categories.json)
app.get('/categories', (req, res) => {
  storeService.getCategories()
    .then((data) => res.json(data))
    .catch((err) => res.status(500).json({ message: err }));
});




// 404 Route (for routes not matching any of the above)
app.use((req, res) => {
  res.status(404).send("Page Not Found");
});




app.get('/items', (req, res) => {
  if (req.query.category) {
    storeService.getItemsByCategory(req.query.category)
      .then(items => res.json(items))
      .catch(err => res.status(500).json({ message: err }));
  } else if (req.query.minDate) {
    storeService.getItemsByMinDate(req.query.minDate)
      .then(items => res.json(items))
      .catch(err => res.status(500).json({ message: err }));
  } else {
    storeService.getAllItems()
      .then(items => res.json(items))
      .catch(err => res.status(500).json({ message: err }));
  }
});


app.get('/item/:id', (req, res) => {
  storeService.getItemById(req.params.id)
    .then(item => res.json(item))
    .catch(err => res.status(500).json({ message: err }));
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
