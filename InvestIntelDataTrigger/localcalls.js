const fs = require('fs').promises;


async function GetLotSizeJsonAsync() {
  try {
    const filePath = "InvestIntelDataTrigger/data/lotsize.json";
    const response = await fs.readFile(filePath, 'utf8');
    const lotSizeData = JSON.parse(response);
    return lotSizeData;
  } catch (error) {
    throw error;
  }
}

module.exports = GetLotSizeJsonAsync

