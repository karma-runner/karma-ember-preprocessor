var fs = require('fs')
, path = require('path')
, compiler = require('ember-template-compiler');

Cli = (function() {

  var CliObject = function(params) {
    this.args = params.args;
  };

  CliObject.prototype.parseCommandLineArgs = function() {
    var filename = this.args[0];
    var templateName = filename.toString().split(path.sep + 'templates' + path.sep).reverse()[0].replace('.handlebars', '');
    templateName = templateName.replace(path.sep, '/');
    var template = fs.readFileSync(filename.toString(), 'utf8');
    return {'name': templateName, 'content': template};
  };

  return CliObject;

})();

var createEmberPreprocessor = function(logger, basePath) {
  var log = logger.create('preprocessor.ember');

  return function(content, file, done) {
    var processed = null;

    log.debug('Processing "%s".', file.originalPath);

    try {
      var template = new Cli({args: [file.originalPath]}).parseCommandLineArgs();
      var input = compiler.precompile(template['content']).toString();
      var processed = "Ember.TEMPLATES['" + template['name'] + "'] = Ember.Handlebars.template(" + input + ");";
    } catch (e) {
      log.error('%s\n  at %s', e.message, file.originalPath);
    }

    done(processed);
  };
};

createEmberPreprocessor.$inject = ['logger', 'config.basePath'];

// PUBLISH DI MODULE
module.exports = {
  'preprocessor:ember': ['factory', createEmberPreprocessor]
};
