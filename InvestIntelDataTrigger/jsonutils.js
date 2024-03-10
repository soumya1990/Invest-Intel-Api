const Papa = require("papaparse");
function convertCsvToJson(csvContent) {
    const parsedData = Papa.parse(csvContent, { header: true });
    return parsedData.data;
  }

function removeSpacesFromKeys(obj) {
    if (typeof obj !== "object" || obj === null) {
      return obj;
    }

    const newObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
      const newKey = key.replace(/\s+/g, ""); // Remove all whitespace characters

      // Handle potential issues with empty key names
      if (newKey) {
        newObj[newKey] = removeSpacesFromKeys(obj[key]);
      }
    }

    return newObj;
  }

  module.exports = {
    convertCsvToJson: convertCsvToJson,
    removeSpacesFromKeys: removeSpacesFromKeys
  }