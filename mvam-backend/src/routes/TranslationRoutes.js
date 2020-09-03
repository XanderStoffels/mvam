const TranslationService = require("../services/TranslationService");

module.exports = function (app) {
    app.get('/translate/languages', (req, res) => {
        let translator = new TranslationService();
        res.status(200);
        res.send(translator.availableLanguages());
    });

    app.post("/translate", async (req, res) => {
        let text = req.body.text;
        let target = req.body.target;

        if (!text || !target) {
            res.status(400).send("Text and language target are required.");
            return;
        }

        try {
            let translator = new TranslationService();
            let translation = await translator.detectAndTranslate(text, target);
            res.status(200);
            res.send(translation);
        } catch (ex) {
            console.log("Unable to fetch data from the Google Translate API.")
            console.error(ex);
            res.status(503);
            res.send("Google Translate API is unavailable.");
        }

    });
}