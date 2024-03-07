var getNifty50LiveDataAsync = require("./nsecalls");
var jsonUtils =  require( "./jsonutils");

module.exports = async function GetLatestStockData(context, req) {
  try {
    const csvContent = await getNifty50LiveDataAsync();
    var jsonData = jsonUtils.convertCsvToJson(csvContent);
    const formattedResponse = JSON.stringify(
      jsonData.map(jsonUtils.removeSpacesFromKeys)
    );
    context.res = {
      status: 200,
      body: formattedResponse,
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
