const fs = require('fs');

let items = [];
let categories = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/items.json', 'utf8', (err, data) => {
      if (err) {
        reject("Unable to read file");
        return;
      }
      items = JSON.parse(data);

      fs.readFile('./data/categories.json', 'utf8', (err, data) => {
        if (err) {
          reject("Unable to read file");
          return;
        }
        categories = JSON.parse(data);
        resolve();
      });
    });
  });
}

function getAllItems() {
  return new Promise((resolve, reject) => {
    if (items.length === 0) {
      reject("No results returned");
    } else {
      resolve(items);
    }
  });
}

function getPublishedItems() {
  return new Promise((resolve, reject) => {
    const publishedItems = items.filter(item => item.published);
    if (publishedItems.length === 0) {
      reject("No results returned");
    } else {
      resolve(publishedItems);
    }
  });
}

function getCategories() {
  return new Promise((resolve, reject) => {
    if (categories.length === 0) {
      reject("No results returned");
    } else {
      resolve(categories);
    }
  });
}


function addItem(itemData) {
  return new Promise((resolve, reject) => {
    // Set 'published' property
    if (itemData.published === undefined) {
      itemData.published = false;
    } else {
      itemData.published = true;
    }

    // Assign a unique ID to the item
    itemData.id = items.length + 1;

    // Add the item to the items array
    items.push(itemData);

    // Resolve the promise with the new itemData
    resolve(itemData);
  });
}

function getItemsByCategory(category) {
  return new Promise((resolve, reject) => {
    const itemsByCategory = items.filter(item => item.category == category);
    if (itemsByCategory.length > 0) {
      resolve(itemsByCategory);
    } else {
      reject("No results returned");
    }
  });
}

function getItemsByMinDate(minDateStr) {
  return new Promise((resolve, reject) => {
    const minDate = new Date(minDateStr);
    const itemsByDate = items.filter(item => new Date(item.postDate) >= minDate);
    if (itemsByDate.length > 0) {
      resolve(itemsByDate);
    } else {
      reject("No results returned");
    }
  });
}

function getItemById(id) {
  return new Promise((resolve, reject) => {
    const item = items.find(item => item.id == id);
    if (item) {
      resolve(item);
    } else {
      reject("No result returned");
    }
  });
}


module.exports = { initialize, getAllItems, getPublishedItems, getCategories, addItem , getItemsByCategory, getItemsByMinDate, getItemById};