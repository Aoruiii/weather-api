// import express, body-parser and axios
import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import dateFormat, { masks } from "dateformat";

// create an express app and set the port number
const app = express();
const port = 3000;
const API_URL = "https://archive-api.open-meteo.com/v1/archive";

// use the public folder for static files
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


// when the user goes to the home page it should render the index.ejs file.
app.get("/",(req,res)=>{
    res.render("index.ejs");
});

// return the corresponding letter content for different weather
function weatherContent(weatherCode) {
    let content = {};
    switch (weatherCode) {
        case 0:
            content = {greeting:"Hello from a clear-skied Sydney!",
                letter:"Today, the sky is as clear as can be, offering a breathtaking canvas for the setting sun. The warm hues paint the horizon in a mesmerizing dance of colors. Sending you warm and sunny vibes from down under!"}
        return content
        break;

        case 1:
        case 2:
        case 3:
            content = {greeting:"Greetings from Sydney, where the weather is as dynamic as ever. ",
                letter:"Today, we've been graced with a mixture of mainly clear skies, delicate clouds that paint stories in the sky, and a touch of overcast that adds an intriguing backdrop. As the sun gracefully descends, it bathes everything in a gentle, golden glow. Hope you're having a truly fantastic day!"}
        return content
        break;

        case 45:
        case 48:
            content = {greeting:"Hey there, it's a bit misty in Sydney today with enchanting rime fog. ",
            letter:"The city shrouded in this ethereal mist takes on an otherworldly charm. Each step through the fog is a journey of mystery and discovery. Enjoying this day with a touch of mystique."}
        return content
        break;

        case 51:
        case 53:
        case 55:
            content = {greeting:"Hello from a drizzly Sydney! ",
            letter:"The raindrops, like a delicate ballet, grace the world with their presence today. They come in various intensities, from the lightest caresses to more substantial embraces. As the day softly transitions, the sun will set, casting a serene aura over the glistening streets. Wishing you a day as refreshing as this drizzle!"}
        return content
        break;

        case 56:
        case 57:
            content = {greeting:"Hi there!",
            letter:"Sydney's got a touch of freezing drizzle, adding a layer of icy enchantment to the city. Bundling up in cozy layers, we navigate the chilly day, knowing that the warmth of home awaits. As the sun descends toward the horizon, painting the sky in hues of pink and orange, we're reminded to cherish the snug moments. Thinking of you!"}
        return content
        break;

        case 61:
        case 63:
        case 65:
            content = {greeting:"Hello from a rainy Sydney!",
            letter:"The rain is our companion today, falling in varying intensities. It's as if the sky is sharing stories through the rhythm of raindrops. We've found comfort indoors, and as the sun gracefully sets, we're reminded of the beauty in simple moments. Wishing you coziness and contentment."}
        return content
        break;
        
        case 66:
        case 67:
            content = {greeting:"Hi there!",
            letter:"Sydney's experiencing some freezing rain, creating a delicate dance of ice. The world is adorned with an icy shimmer, and we take cautious steps through this frozen wonderland. As the day draws to a close, and the sun gracefully bows, we reflect on the beauty of winter's embrace. Take care and stay warm."}
        return content
        break;
        
        case 71:
        case 73:
        case 75:
            content = {greeting:"Greetings from snowy Sydney!",
            letter:"The city is blanketed in a pristine layer of snow, transforming it into a winter wonderland. The snowfall varies from a gentle dusting to a magical heavy snowfall. Each flake tells a unique story. As the sun slowly descends, the snowy landscape reflects the warm hues of twilight. Sending you snowy greetings and winter's magic!"}
        return content
        break;

        case 77:
            content = {greeting:"Hey, it's snow grains in Sydney! ",
            letter:"Tiny ice particles fill the air, creating an atmosphere of wonder. It's a day where every breath feels like a frosty adventure. As the sun dips below the horizon, we embrace the frosty fun and the joy of the unexpected. Wishing you a day filled with wonder!"}
        return content
        break;

        case 80:
        case 81:
        case 82:
            content = {greeting:"Hello from Sydney with its ever-changing weather!",
            letter:"Today, we've encountered rain showers of varying intensities, from the lightest drizzles to more vigorous downpours. The city glistens in the rain's embrace. As the sun gradually sets, we find comfort indoors and appreciate the cozy moments. Thinking of you on this dynamic day."}
        return content
        break;

        case 85:
        case 86:
            content = {greeting:"Hello from Sydney!",
            letter:"Sydney is experiencing snow showers, turning the city into a snowy paradise. The snowfall ranges from gentle flurries to hearty snow showers. Each snowflake adds to the enchantment of the day. As the sun bids adieu, we're reminded of the beauty of winter's embrace. Sending you warm and snowy greetings!"}
        return content
        break;

        default:
            content = {greeting:"Hello from Sydney!",
            letter:"As I take in the bustling energy of this vibrant place, I'm reminded of the warmth and camaraderie that fills the streets. From the iconic landmarks to the hidden gems, every corner of this city is brimming with life and adventure."}
        return content
            break;
    }
}

// call the weather API to search the weather for given date
app.post("/search",async(req,res)=>{
    const inputDate = req.body.pastDate;
try{
    // get the weather data from API
    const result = await axios.get(API_URL,{
        params: {
        latitude: -33.8678,
        longitude: 151.2073,
        start_date: inputDate,
        end_date: inputDate,
        timezone: "auto",
        daily: "weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset",
        }
    })

    // format the weather data to show on postcard
    const fullDate = dateFormat(new Date(inputDate), "fullDate");
    const letterContent = weatherContent(result.data.daily.weathercode[0]);
    const temperature = Math.round(result.data.daily.temperature_2m_min[0]) + result.data.daily_units.temperature_2m_min + " - " + Math.round(result.data.daily.temperature_2m_max[0]) + result.data.daily_units.temperature_2m_max;
    const sunriseTime = result.data.daily.sunrise[0].slice(-5);
    const sunsetTime =  result.data.daily.sunset[0].slice(-5);

    // render the ejs file
    res.render("index.ejs",{
        date: fullDate,
        content:letterContent,
        temp: temperature,
        sunrise:sunriseTime,
        sunset:sunsetTime,
    })
    // res.redirect("/");

} catch (error) {
    console.log("Error",error);
    // res.render("index.ejs",{
    //     error:error,
    // });
}
})

// listen on your predefined port and start the server
app.listen(port,()=>{
    console.log(`Server running on port: ${port}`);
});
