async function getNifty50LiveDataAsync() {
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

module.exports = getNifty50LiveDataAsync