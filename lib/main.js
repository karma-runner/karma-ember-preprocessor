(function() {

  require('./cli');

  var createEmberPreprocessor = function(logger, config) {
    var compiler = require(config && config.compilerPath ? config.compilerPath : 'ember-template-compiler');
    var log = logger.create('preprocessor.ember');

    return function(content, file, done) {
      var processed = null;

      log.debug('Processing "%s".', file.originalPath);

      try {
        var template = new Cli({args: [file.originalPath, config.nameTransform]}).parseCommandLineArgs();
        var input = compiler.precompile(template['content']).toString();
        var processed = "Ember.TEMPLATES['" + template['name'] + "'] = Ember.Handlebars.template(" + input + ");";
      } catch (e) {
        log.error('%s\n  at %s', e.message, file.originalPath);
      }

      done(processed);
    };
  };

  createEmberPreprocessor.$inject = ['logger', 'config.emberPreprocessor'];

  module.exports = {
    'preprocessor:ember': ['factory', createEmberPreprocessor]
  };

}).call(this);
