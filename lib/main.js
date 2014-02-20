(function() {

  require('./cli');

  var parseSubTemplates = function parseSubTemplates(template) {
      var templates = []
      // Finding all sub templates within file
      while (template.indexOf("<script") >= 0) {
          var scriptTag = template.indexOf("<script")
          var closeScriptTag = template.indexOf("</script") + 9 // Adding to skip tag
          var newLine = template.indexOf("\">")
          var firstTemplateLine = template.substring(scriptTag, newLine + 4) // same here
          templates.push({name: firstTemplateLine, template: template.substring(scriptTag, closeScriptTag)})
          template = template.substring(closeScriptTag)
      }

      // Extracting the name of the template for each subtemplate
      templates.forEach(function(obj) {
          var templateFirstLine = obj.name // At this moment name is the first line of each sub template
          // Template name is either id or data-template-name
          var idIndex = templateFirstLine.indexOf("id=")
          var dataTmpName = templateFirstLine.indexOf("data-template-name=")
          var index =  idIndex != -1 ? idIndex : dataTmpName
          if (index >= 0) {
              templateFirstLine = templateFirstLine.substring(index)
              var firstApost = templateFirstLine.indexOf("\'")
              var firstQuote = templateFirstLine.indexOf("\"")
              var secondApost = templateFirstLine.lastIndexOf("\'")
              var secondQuote = templateFirstLine.lastIndexOf("\"")
              var firstDelim = firstApost != -1 ? firstApost : firstQuote
              var secondDelim = secondApost != -1 ? secondApost : secondQuote
              if (firstDelim  > 0 && secondDelim > 0) {
                  obj.name = templateFirstLine.substring(firstDelim + 1, secondDelim)
              }
          }
      })
      return templates;
    }
  var createEmberPreprocessor = function(logger, basePath) {
    var compiler = require('ember-template-compiler');
    var log = logger.create('preprocessor.ember');
    return function(content, file, done) {
      var processed = "";
      log.debug('Processing "%s".', file.originalPath);
      try {
        var template = new Cli({args: [file.originalPath]}).parseCommandLineArgs();
        var templates = parseSubTemplates(template['content'])
        templates.forEach(function(templateObj) {
            var precompiledTemplate = compiler.precompile(templateObj.template.toString()).toString();
            processed += "Ember.TEMPLATES['" + templateObj.name + "'] = Ember.Handlebars.template(" + precompiledTemplate + "); \n";

        })
      } catch (e) {
        log.error('%s\n  at %s', e.message, file.originalPath);
      }
      done(processed);
    };
  };

  createEmberPreprocessor.$inject = ['logger', 'config.basePath'];

  module.exports = {
    'preprocessor:ember': ['factory', createEmberPreprocessor]
  };

}).call(this);
