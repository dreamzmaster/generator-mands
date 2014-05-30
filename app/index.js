'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

var MandsGenerator = module.exports = function Generator(args, options) {
  yeoman.generators.Base.apply(this, arguments);
  // this.argument('appname', { type: String, required: false });
  // this.appname = this.appname || path.basename(process.cwd());
  // this.appname = this._.camelize(this._.slugify(this._.humanize(this.appname)));

  // this.option('app-suffix', {
  //   desc: 'Allow a custom suffix to be added to the module name',
  //   type: String,
  //   required: 'false'
  // });
  // this.scriptAppName = this.appname + angularUtils.appName(this);

  var args = ['main'];

  // if (typeof this.env.options.appPath === 'undefined') {
  //   try {
  //     this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
  //   } catch (e) {}
  //   this.env.options.appPath = this.env.options.appPath || 'app';
  // }

  // this.appPath = this.env.options.appPath;

  this.hookFor('angular-require:common', {
    args: args
  });

  this.hookFor('angular-require:main', {
    args: args
  });

  this.hookFor('angular-require:controller', {
    args: args
  });

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
};

util.inherits(MandsGenerator, yeoman.generators.Base);

MandsGenerator.prototype.askFor = function askFor() {

    var done = this.async();
    
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
      },
      {
        type: 'checkbox',
        name: 'modules',
        message: 'Which modules would you like to include?',
        choices: [{
          value: 'resourceModule',
          name: 'angular-resource.js',
          checked: true
        }, {
          value: 'cookiesModule',
          name: 'angular-cookies.js',
          checked: true
        }, {
          value: 'sanitizeModule',
          name: 'angular-sanitize.js',
          checked: true
        }]
      } 
    ];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      this.require = props.require;
      this.protractor = props.protractor;
      this.spa = props.spa;
      this.modernizr = props.modernizr;

      var hasMod = function (mod) { return props.modules.indexOf(mod) !== -1; };
      this.resourceModule = hasMod('resourceModule');
      this.cookiesModule = hasMod('cookiesModule');
      this.sanitizeModule = hasMod('sanitizeModule');
      this.routeModule = hasMod('routeModule');

      var angMods = [];

      if (this.cookiesModule) {
        angMods.push("'ngCookies'");
      }

      if (this.resourceModule) {
        angMods.push("'ngResource'");
      }
      if (this.sanitizeModule) {
        angMods.push("'ngSanitize'");
      }
      if (this.routeModule) {
        angMods.push("'ngRoute'");
        this.env.options.ngRoute = true;
      }

      if (angMods.length) {
        this.env.options.angularDeps = "\n  " + angMods.join(",\n  ") +"\n";
      }

      done();
    }.bind(this));
  };

MandsGenerator.prototype.app = function app() {

    this.mkdir('app');
    this.mkdir('app/scripts/directives');
    this.mkdir('app/scripts/services');
    this.mkdir('app/scripts/controllers');
    this.mkdir('app/scripts/filters');
    this.mkdir('app/scripts/config');
    this.mkdir('app/views');

    this.template('_package.json', 'package.json');
    this.template('_README.md', 'README.md');

    // RequireJS App config
    this.template('../../templates/common/scripts/main.js', 'app/scripts/main.js');
    // RequireJS Test config
    this.template('../../templates/common/scripts/test-main.js', 'test/test-main.js');

    this.copy('_bower.json', 'bower.json');
  };

  MandsGenerator.prototype.projectfiles = function projectfiles() {

    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  };


module.exports = MandsGenerator;
