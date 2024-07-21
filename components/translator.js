const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    objectFlip(obj) {
        return Object.entries(obj).reduce((acc, [key, value]) => (acc[value] = key, acc), {})
    }

    capitalizeFirstLetter(word) {
        return word[0].toUpperCase() + word.slice(1);
    }

    changeWordsToRegex(text, wordDiffAndSpelling, titles) {
        const textLowerCase = text.toLowerCase();
        let translated;
        const timeRegex = /(([0-9]|0[0-9]|1[0-9]|2[0-3])(:|\.)([0-5][0-9]))/g;

        // searching for  Titles and replace them
        Object.entries(titles) //[ [key1, value1],[key1, value1] ]
            .map(([key, value]) => {
                if (textLowerCase.includes(key)) {
                    translated = text.replace(new RegExp(key, "gi"), `<span class="highlight">${this.capitalizeFirstLetter(value)}</span>`) || text;
                }
            })

        translated = translated || text; //make sure that translated not null || undefiend


        // change time format  12:15 <=> 12.15
        const changeTime = textLowerCase.match(timeRegex); //['12.15','11.15']
        if (changeTime) {
            changeTime.map(time => {
                translated = translated.replace(time, `<span class="highlight">${time.replace(':', '.')}</span>`) || text;
            })
        }

        // replace words that are diffrent and check Spelling
        // a word can be in the middle or in the end of the string
        // 'ta' or 'ta!' or 'ta654' will translated to thank you *
        Object.entries(wordDiffAndSpelling)
            .map(([key, value]) => {
                if (new RegExp(`${key} `, "gi").test(textLowerCase) ||
                    new RegExp(`${key}[^A-Za-z]`, "gi").test(textLowerCase) ||
                    new RegExp(`${key}$`, "gi").test(textLowerCase)) {

                    translated = translated.replace(new RegExp(key, "gi"), `<span class="highlight">${value}</span>`) || text;
                }
            });

        return translated || text;
    }


    translateToAmerican(text) {
        const wordDiffAndSpelling = {...britishOnly, ...this.objectFlip(americanToBritishSpelling) }
        const titles = this.objectFlip(americanToBritishTitles);
        return this.changeWordsToRegex(text, wordDiffAndSpelling, titles);
    }

    translateToBritish(text) {
        const wordDiffAndSpelling = {...americanOnly, ...americanToBritishSpelling }
        const titles = americanToBritishTitles;
        return this.changeWordsToRegex(text, wordDiffAndSpelling, titles);
    }

    translate(text, locale) {
        const result = { result: true };
        if (text === '') {
            result.result = false;
            result.text = 'No text to translate';
            return result;
        }
        if (!text || !locale) {
            result.result = false;
            result.text = 'Required field(s) missing';
            return result;
        }
        switch (locale) {
            case "british-to-american": {
                result.text = this.translateToAmerican(text);
                break;
            }
            case "american-to-british": {
                result.text = this.translateToBritish(text);
                break;
            }
            default: {
                result.result = false;
                result.text = 'Invalid value for locale field';
            }
        }
        return result;
    }
}

module.exports = Translator;