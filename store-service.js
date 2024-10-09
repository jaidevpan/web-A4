const fs = require('fs');

// Helper function to read JSON files
const readJSONFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

// Fetch all items
const getAllItems = () => {
  return readJSONFile('./data/items.json');
};

// Fetch all categories
const getAllCategories = () => {
  return readJSONFile('./data/categories.json');
};

module.exports = {
  getAllItems,
  getAllCategories
};
