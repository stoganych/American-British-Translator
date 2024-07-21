'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {

  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const text = req.body.text;
      const locale = req.body.locale;
      const translation = translator.translate(text, locale)
      if(text === translation.text) {
        return res.json({translation: "Everything looks good to me!", text})
      }
      if(!translation.result) {
        return  res.json({ error: translation.text })
      }
      res.json({translation: translation.text, text})

    });
};
