var path = require('path');

describe("Compiler path configuration tests", function() {
  var createPreprocessor, mockLogger;
  beforeEach(function() {
    createPreprocessor = require('../lib/main')['preprocessor:ember'][1];
    mockLogger = {
      create: function() {
        return {
          error: function() {
            throw new Error(util.format.apply(util, arguments));
          },
          warn: function() {
            return null;
          },
          info: function() {
            return null;
          },
          debug: function() {
            return null;
          }
        };
      }
    }; 
  });

  it("compiles template with default compiler", function() {
    var compiledTemplate = '';
    var process          = createPreprocessor(mockLogger, {});

    process(null, {
      originalPath: path.join('file-system', 'app', 'templates', 'foo.handlebars')
    }, function(template) {
      compiledTemplate = template;          
    });
    expect(compiledTemplate).toContain("Ember.TEMPLATES['foo'] = Ember.Handlebars.template");
  });

  it("compiles template with custom compiler", function() {
    var compiledTemplate = '';
    var process          = createPreprocessor(mockLogger, {
      compilerPath: '../node_modules/ember-template-compiler/vendor/ember-template-compiler'
    });

    process(null, {
      originalPath: path.join('file-system', 'app', 'templates', 'foo.handlebars')
    }, function(template) {
      compiledTemplate = template;          
    });
    expect(compiledTemplate).toContain("Ember.TEMPLATES['foo'] = Ember.Handlebars.template");      
  });

  it("fails with no custom compiler found", function() {
    var compilerExecuted = false;
    try {
      var process  = createPreprocessor(mockLogger, {
        compilerPath: 'notExistingCompilerPath'
      });
      // should never reach next line
      compilerExecuted = true;          
    } catch(err) {
      expect(err.code).toEqual('MODULE_NOT_FOUND');
    }
    expect(compilerExecuted).toBe(false);  
  });

  it("process templates with custom template name", function() {
    var compiledTemplate = '';
    var process = createPreprocessor(mockLogger, {
      nameTransform: function nameTransform() {
        return 'customTemplateName';
    }});

    process(null, {
      originalPath: path.join('file-system', 'app', 'templates', 'foo.handlebars')
    }, function(template) {
      compiledTemplate = template;
    });
    expect(compiledTemplate).toContain("Ember.TEMPLATES['customTemplateName'] = Ember.Handlebars.template");
  });
});