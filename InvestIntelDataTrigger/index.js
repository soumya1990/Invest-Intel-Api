var getNifty50LiveDataAsync = require("./nsecalls");
var jsonUtils = require("./jsonutils");
const GetLotSizeJsonAsync = require("./localcalls");
const MergeArray = require("./arrayutils");

module.exports = async function GetLatestStockData(context, req) {
  try {
    const csvContent = await getNifty50LiveDataAsync();
    var jsonData = jsonUtils.convertCsvToJson(csvContent);
    const formattedResponse = JSON.stringify(
      jsonData.map(jsonUtils.removeSpacesFromKeys)
    );

    const lotsizeJsonData = await GetLotSizeJsonAsync();
    const liveStockJsonData = JSON.parse(formattedResponse);
    const combineResponse = MergeArray(
      liveStockJsonData,
      lotsizeJsonData,
      "SYMBOL"
    );
    console.log(typeof lotsizeJsonData);
    console.log(typeof liveStockJsonData);

    context.res = {
      status: 200,
      body: combineResponse,
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.log(error);
    context.res = {
      status: 500,
      body: error.message,
    };
  }
};
