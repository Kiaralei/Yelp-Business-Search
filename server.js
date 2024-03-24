
// const app = require("./backend/app");
const debug = require("debug")("node-angular");

// const express = require("express");

// const http = require("http");


const port = process.env.PORT || 8888;




const express = require("express");
const http = require("node:http");
const request = require("request");
const axios = require('axios');
const cors = require('cors');

const app = express();


app.set('port', port);





const GEO_PATH = "https://maps.googleapis.com/maps/api/geocode/json";
const API_KEY_GEO = "AIzaSyCpURsqM01ZJJnWoby5upRc2Q-1m86gmm4";

const YELP_KEY = 'egzhwVB0E2WTmRiac2EL3Zj-88wM-T4BmxZXfS6XZFN0Tk4goB6JPp2T6wkYqD-gS9gshKGh5FDmuY6dbbQN4G1Ffr4QFn_JkNxFSxFEZjmP4xqXIB3_76YkkBw5Y3Yx'
const YELP_PATH = 'https://api.yelp.com/v3/businesses/search'
// const YELP_REVIEW = 'https://api.yelp.com/v3/businesses/{id}/reviews'
const YELP_AUTO = 'https://api.yelp.com/v3/autocomplete'
const YELP_DETAIL = 'https://api.yelp.com/v3/businesses/'
const SEARCH_LIMIT = 10;

//refernce : https://www.robertthasjohn.com/post/deploying-an-angular-app-to-google-app-engine
// const path = require("path");
// const publicPath = path.join(__dirname, "/dist/homework8");
// app.use(express.static(publicPath));

// app.get("/", (req, res) => {
//   console.log(path.join(__dirname + "/dist/homework8/index.html"))
//   res.sendFile(path.join(__dirname + "/dist/homework8/index.html"));
// });

app.use(express.static(process.cwd()+"/frontend/dist/frontend/"));
app.get('/', (req,res) => {
    res.sendFile(process.cwd()+"/frontend/dist/frontend/index.html")
});

// app.get('/search', (req,res) => {
//     res.redirect('/');
// });
// app.get('/bookings', (req,res) => {
    
//     res.redirect('/');

// });

app.use(cors({
    origin:'*'
}))


//refernce : https://www.robertthasjohn.com/post/deploying-an-angular-app-to-google-app-engine
// const path = require("path");
// const publicPath = path.join(__dirname, "/dist/homework8");
// app.use(express.static(publicPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname + "/dist/homework8/index.html"));
// });



// console.log("Server Listening...");

// get Geo location
app.get('/getGeo', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");

    // console.log(req);

    console.log(req.query);

    let address = req.query.location.replace(' ', '+');

    console.log(address);

    const param = {
        'address' : address,
        'key' : API_KEY_GEO,
    };

   // Call Geo Api
   axios.get(GEO_PATH, {
        params: param,
    })
    .then(function (response) {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response);

        ans = response.data;

        statusCode = response.status;
        res.status(statusCode).json({
            message: response.statusText,
            data: ans,
        })
    }).catch(function (error) {
        console.log(error.toJSON());
        res.status(400).json({
            message: 'error',
            data: {},
        })
    });
})


// get result
app.use('/getResult',(req, res) => {

    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");

    let query = req.query;
    console.log(query);

    let ans = {};
    let statusCode = 200;

    let param = {
        'term' : query.keyword.replace(' ', '+'),
        'latitude' : query.lat,
        'longitude' : query.lng,
        'radius' : parseInt(1609.344 * query.distance),
        'categories' : query.category,
        'limit' : SEARCH_LIMIT,
    }

    // Call Yelp Api
    axios.get(YELP_PATH, {
        headers: {
            'Authorization': 'Bearer '+ YELP_KEY,
        },
        params: param,
    })
    .then(function (response) {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response);

        ans = response.data;

        statusCode = response.status;
        res.status(statusCode).json({
            message: response.statusText,
            data: ans,
        })
    }).catch(function (error) {
        console.log(error.toJSON());
        res.status(400).json({
            message: 'error',
            data: {},
        })
    });

    // res.status(200).json({
    //     message:"success",
    //     data: ans,
    // })

});

// get auto complete text
app.get('/getAutocomplete', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");
    let query = req.query;
    console.log(query);

    let ans = {};
    let statusCode = 200;

    let param = {
        'text' : query.text,
    }

    // Call Yelp Api
    axios.get(YELP_AUTO, {
        headers: {
            'Authorization': 'Bearer '+ YELP_KEY,
        },
        params: param,
    })
    .then(function (response) {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response);

        ans = response.data;

        statusCode = response.status;
        res.status(statusCode).json({
            message: response.statusText,
            data: ans,
        })
    }).catch(function (error) {
        console.log(error.toJSON());
        res.status(400).json({
            message: 'error',
            data: {},
        })
    });


});


//get business detail
app.get('/getBusiness', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");

    let query = req.query;
    console.log(query);

    let ans = {};
    let statusCode = 200;

    // let param = {
    //     'id' : query.id,
    // }

    // Call Yelp Api
    axios.get(YELP_DETAIL + query.id, {
        headers: {
            'Authorization': 'Bearer '+ YELP_KEY,
        },
    })
    .then(function (response) {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response);

        ans = response.data;

        statusCode = response.status;
        res.status(statusCode).json({
            message: response.statusText,
            data: ans,
        })
    }).catch(function (error) {
        console.log(error.toJSON());
        res.status(400).json({
            message: 'error',
            data: {},
        })
    });


});


//get review detail
app.get('/getReview', (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS,DELETE,PUT");

    let query = req.query;
    console.log(query);

    let ans = {};
    let statusCode = 200;

    // let param = {
    //     'id' : query.id,
    // }

    // Call Yelp Api
    axios.get('https://api.yelp.com/v3/businesses/'+query.id+'/reviews', {
        headers: {
            'Authorization': 'Bearer '+ YELP_KEY,
        },
    })
    .then(function (response) {
        // console.log(response.data);
        // console.log(response.status);
        // console.log(response);

        ans = response.data;

        statusCode = response.status;
        res.status(statusCode).json({
            message: response.statusText,
            data: ans,
        })
    }).catch(function (error) {
        console.log(error.toJSON());
        res.status(400).json({
            message: 'error',
            data: {},
        })
    });


});


app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});


// const server = http.createServer(app);
// server.on('request', req=>{
//     console.log(req.url);
// })

// server.listen(port);
