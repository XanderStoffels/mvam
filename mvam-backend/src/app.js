const express = require('express');
const bodyParser = require('body-parser');

const port = 3000;
const app = express();

// Enable support for JSON bodies from incoming requests.
app.use(bodyParser.json());

// Add API routes.
require("./routes/TranslationRoutes")(app);


app.listen(port, async () => {
    console.log(`Listening on port ${port}!`);
})




