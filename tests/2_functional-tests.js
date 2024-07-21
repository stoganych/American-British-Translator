const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

let Translator = require('../components/translator.js');
const { text } = require('body-parser');

suite('Functional Tests', () => {

    test('Translation with text and locale fields /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate',)
            .send({
                text: "look at this color",
                locale: "american-to-british"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'translation', 'response object should contain translation');
                assert.property(res.body, 'text', 'response object should contain text');
                done();
            });
    });

    test('Translation with text and invalid locale field /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate',)
            .send({
                text: "look at this color",
                locale: "french-to-british"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response object should contain error');
                assert.equal(res.body.error, 'Invalid value for locale field');
                done();
            });
    });

    test('Translation with missing text field /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate',)
            .send({
                text: null,
                locale: "american-to-british"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response object should contain error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with missing locale field /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate',)
            .send({
                text: "look at this color",
                locale: null
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response object should contain error');
                assert.equal(res.body.error, 'Required field(s) missing');
                done();
            });
    });

    test('Translation with empty text /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate',)
            .send({
                text: "",
                locale: "american-to-british"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'error', 'response object should contain error');
                assert.equal(res.body.error, 'No text to translate');
                done();
            });
    });

    test('Translation with text that needs no translation /api/translate', function (done) {
        chai.request(server)
            .post('/api/translate',)
            .send({
                text: "look at this",
                locale: "american-to-british"
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isObject(res.body, 'response should be an object');
                assert.property(res.body, 'translation', 'response object should contain translation');
                assert.property(res.body, 'text', 'response object should contain text');
                assert.equal(res.body.translation, 'Everything looks good to me!');
                done();
            });
    });
});
