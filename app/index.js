'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');


var MandsGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();

        if (this.spa) {
          this.bowerInstall('angular-route');
        }

        if (this.modernizr) {
          this.bowerInstall('modernizr');
        }

        if (this.require) {
          this.bowerInstall('requirejs');
        }

        if (this.protractor) {
          this.npmInstall('protractor');
        }
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the M&S application generator!'));

    var prompts = [
      {
        name: 'appName',
        message: 'What is the name of your application?'
      },
      {
        type: 'confirm',
        name: 'require',
        message: 'Would you like your app to use requireJs?',
        default: true
      },
      {
        type: 'confirm',
        name: 'protractor',
        message: 'Would you like your app to use Protractor e2e tests?',
        default: true
      },
      {
        type: 'confirm',
        name: 'spa',
        message: 'Is your app a single page application?',
        default: true
      },
      {
        type: 'confirm',
        name: 'modernizr',
        message: 'Would you like your app to use Modernizr feature detection?',
        default: true
      }
    ];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.require = props.require;
      this.protractor = props.protractor;
      this.spa = props.spa;
      this.modernizr = props.modernizr;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('app');
    this.mkdir('app/scripts/directives');
    this.mkdir('app/scripts/services');
    this.mkdir('app/scripts/controllers');
    this.mkdir('app/scripts/filters');
    this.mkdir('app/scripts/config');
    this.mkdir('app/views');

    this.template('_package.json', 'package.json');
    this.template('_README.md', 'README.md');

    this.copy('_bower.json', 'bower.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = MandsGenerator;
