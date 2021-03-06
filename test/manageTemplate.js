'use strict';
let chai = require('chai');
chai.should();
chai.use(require('chai-as-promised'));

let path = require('path');

let uut = require('../lib/manageTemplate').promise;
let amazonES = {
  region: process.env.ELASTICSEARCH_AWS_DEFAULT_REGION,
  accessKey: process.env.ELASTICSEARCH_AWS_ACCESS_KEY_ID,
  secretKey: process.env.ELASTICSEARCH_AWS_SECRET_ACCESS_KEY
};

describe('#manageTemplate.promise()', function() {
  this.timeout(10000);

  describe('overwrite flag is true', () => {
    it('should fail due to upper case letter in template name', function() {
      return uut({
        host: process.env.ELASTICSEARCH_HOST,
        amazonES,
        retries: 2,
        manageTemplate: true,
        templateName: 'testTemplate',
        templateOverwrite: true,
        templateDir: path.join(__dirname, './fixtures/templates')
      })
      .should.be.rejectedWith('index_template [testTemplate] invalid, cause [name must be lower cased]');
      ;
    });

    it('should fail due to unavailable server', function() {
      return uut({
        host: process.env.ELASTICSEARCH_HOST + 'x',
        amazonES,
        retries: 2,
        manageTemplate: true,
        templateName: 'testTemplate',
        templateOverwrite: true,
        templateDir: path.join(__dirname, './fixtures/templates')
      })
      .should.be.rejectedWith('No Living connections');
      ;
    });

    it('should create template', function() {
      return uut({
        host: process.env.ELASTICSEARCH_HOST,
        amazonES,
        manageTemplate: true,
        templateName: 'testtemplate',
        templateOverwrite: true,
        templateDir: path.join(__dirname, './fixtures/templates')
      })
      .should.eventually.equal(true)
      ;
    });
  });

  describe('should not overwrite template', () => {
    it('if manageTemplate flag is false', function() {
      return uut({
        host: process.env.ELASTICSEARCH_HOST,
        amazonES,
        manageTemplate: false,
        templateName: 'testtemplate',
        templateOverwrite: false,
        templateDir: path.join(__dirname, './fixtures/templates')
      })
      .should.eventually.equal(false)
      ;
    });

    it('manageTemplate flag is undefined', function() {
      return uut({
        host: process.env.ELASTICSEARCH_HOST,
        amazonES,
        templateName: 'testtemplate',
        templateOverwrite: false,
        templateDir: path.join(__dirname, './fixtures/templates')
      })
      .should.eventually.equal(false)
      ;
    });

    it('if it already exists and templateOverwrite is false', function() {
      return uut({
        host: process.env.ELASTICSEARCH_HOST,
        amazonES,
        manageTemplate: true,
        templateName: 'testtemplate',
        templateOverwrite: false,
        templateDir: path.join(__dirname, './fixtures/templates')
      })
      .should.eventually.equal(false)
      ;
    });
  });
});
