const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = process.env.AzureWebJobsStorage;
const containerName = "invest-intel-raw-data";
const blobName = "MW-NIFTY-50-11-Feb-2024.csv";
const Papa = require('papaparse');

module.exports = async function GetLatestStockData(context, req) {
    // Create BlobServiceClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

    // Get a reference to a container
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Get a reference to a blob
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    try {
        // Download blob content
        const downloadResponse = await blockBlobClient.download();

        // Read the downloaded content as a string
        const csvContent = await streamToString(downloadResponse.readableStreamBody);

        // Convert CSV to JSON
        var jsonData = convertCsvToJson(csvContent);

        jsonData = JSON.stringify(jsonData).replace(/\\n/g, '');

        // Send JSON response
        context.res = {
            status: 200,
            body: jsonData,
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error.message,
        };
    }
};

// Helper function to convert a readable stream to a string
async function streamToString(readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        readableStream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        readableStream.on("end", () => {
            resolve(Buffer.concat(chunks).toString("utf-8"));
        });
        readableStream.on("error", reject);
    });
}

// Helper function to convert CSV to JSON
function convertCsvToJson(csvContent) {
    // Here, you can use the CSV parsing library of your choice (e.g., papaparse)
    // to convert the CSV string to JSON.
    // The example below uses papaparse:
   // const Papa = require('papaparse');
    
    const parsedData = Papa.parse(csvContent, { header: true });
    return parsedData.data;
}