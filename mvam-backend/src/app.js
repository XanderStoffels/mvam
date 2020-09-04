const express = require('express');
const bodyParser = require('body-parser');
const upload = require('express-fileupload');
const cors = require('cors');

const app = express();
const port = 3000;

// Enable CORS for specific routes.
const allowedOrigins = ["http://localhost:8080", "https://mercier.xanderapp.com", "http://mercier.anderapp.com"];
app.use(cors({
    origin: function(origin, callback){
        // do not allow requests with no origin
        // (like mobile apps or curl requests)
        // if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            let msg = `Blocked by CORS protection. You are not allowed to use this service from your origin.`;
            return callback(msg, false);
        }
        return callback(null, true);
    }
}));

// Enable support for uploading files, no options needed.
app.use(upload(undefined));

// Enable support for JSON bodies from incoming requests.
app.use(bodyParser.json());

// Add API routes.
require("./routes/TranslationRoutes")(app);


app.listen(port, async () => {
    console.log(`Listening on port ${port}!`);
})




