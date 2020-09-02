const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("<h1>Hello Xander</h1>");
});

app.listen(port, async () => {
    const text = "Hello, world!";
    const target = "nl";

   // await translateText(text, target);
    console.log(`Listening on port ${port}!`);
});



async function translateText(text, target) {

}


