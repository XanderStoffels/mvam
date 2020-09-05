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
            res.status(503).send(ex);
        }
    });

    /**
     * The user can upload a text file, which contents should be translated.
     */
    app.post("/translate/file", async (req, res) => {
        let target = req.query.target;
        let source = req.query.source;
        if (isEmptyOrSpaces(target) || isEmptyOrSpaces(source)) {
            res.status(400).send("The language target and language source are required using a URL query.");
            return;
        }
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).send('No files were uploaded.');

        let toTranslate = req.files.file.data.toString();
        let translator = new TranslationService();
        try {
            let translated = await translator.translateText(toTranslate, source, target);
            res.status(200).send(translated);
        } catch (ex) {
            res.status(503).send(ex);
        }
    });

    function isEmptyOrSpaces(str){
        return str === null || str.match(/^\s*$/) !== null;
    }
}