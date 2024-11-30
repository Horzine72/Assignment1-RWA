export async function GET(req, res) {

    // Make a note we are on

    // the api. This goes to the console.

    console.log("in the weather api page")




    // api key = aa087adde14e4d00aad182425242911
const res2 = await fetch('http://api.weatherapi.com/v1/current.json?key=aa087adde14e4d00aad182425242911&q=Dublin&aqi=no');


    const data = await res2.json()

    console.log(data.current.temp_c)

    let currentTemp = data.current.temp_c



    // at the end of the process we need to send something back.

    return Response.json({"temp": currentTemp})



  }