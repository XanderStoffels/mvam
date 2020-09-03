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
        let source = req.body.source;
        if (isEmptyOrSpaces(text) || isEmptyOrSpaces(target)) {
            res.status(400).send("Text and language target are required.");
            return;
        }

        let translator = new TranslationService();
        try {
            let translation;
            if (isEmptyOrSpaces(source)) {
                translation = await translator.detectAndTranslate(text, target);
            } else {
                translation = await translator.translateText(text, source, target);
            }
            res.status(200);
            res.send(translation);
        } catch (ex) {
            console.log("Unable to fetch data from the Google Translate API.")
            console.error(ex);
            res.status(503);
            res.send("Google Translate API is unavailable.");
        }

    });

    function isEmptyOrSpaces(str){
        return str === null || str.match(/^\s*$/) !== null;
    }
}