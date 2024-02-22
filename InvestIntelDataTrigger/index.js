const { BlobServiceClient } = require("@azure/storage-blob");
const connectionString = process.env.AzureWebJobsStorage;
const containerName = "invest-intel-raw-data";
const blobName = "MW-NIFTY-50-11-Feb-2024.csv";
const Papa = require("papaparse");

async function makeTwoCalls() {
  try {
    // First Call
    const firstResponse = await fetch(
      "https://www.nseindia.com/market-data/live-equity-market",
      {
        method: "GET",
      }
    );

    // Extract the cookie from the first response
    const cookieString = firstResponse.headers.get("Set-Cookie");
    console.log(cookieString);

    // Extract "nsit" value
    const nsitMatch = cookieString.match(/nsit=([^;]*)/);
    const nsitValue = nsitMatch ? nsitMatch[1] : null;

    // Extract "nseappid" value
    const nseappidMatch = cookieString.match(/nseappid=([^;]*)/);
    const nseappidValue = nseappidMatch ? nseappidMatch[1] : null;

    console.log("nsit:", nsitValue);
    console.log("nseappid:", nseappidValue);

    // Second Call with Cookie from the First Call
    const url =
      "https://www.nseindia.com/api/equity-stockIndices?csv=true&index=NIFTY%2050&selectValFormat=crores";
    const cookieHeader = new Headers();
    cookieHeader.append(
      "Cookie",
      `nseappid=${nseappidValue}; nsit=${nsitValue}`
    );
    console.log(cookieHeader);

    var requestOptions = {
      method: "GET",
      headers: cookieHeader,
      redirect: "follow",
    };

    var resp = "{}";

    await fetch(url, requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        resp = result;
      })
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.error("An error occurred:", error);
  }
  return resp;
}

// Call the function to make the two requests

module.exports = async function GetLatestStockData(context, req) {
  try {
    const csvContent = await makeTwoCalls();
    var jsonData = convertCsvToJson(csvContent);
    jsonData = JSON.stringify(jsonData).replace(/\\n/g, "");

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

// Helper function to convert CSV to JSON
function convertCsvToJson(csvContent) {
  const parsedData = Papa.parse(csvContent, { header: true });
  return parsedData.data;
}
