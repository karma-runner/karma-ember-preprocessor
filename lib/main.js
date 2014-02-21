require('./cli');

var makeSubTemplatesArray = function makeSubTemplatesArray(template) {
    var templates = []
    // Finding all sub templates within file
    while (template.indexOf("<script") >= 0) {
        var scriptTag = template.indexOf("<script")
        var contentStart = template.indexOf(">") + 1
        var closeScriptTag = template.indexOf("</script>")
        var firstTemplateLine = template.substring(scriptTag, contentStart)
        templates.push({
            name: firstTemplateLine,
            template: template.substring(contentStart, closeScriptTag) // Only grab stuff between script tags
        })
        template = template.substring(closeScriptTag + 9)
    }
    return templates;
}
var parseSubTemplates = function parseSubTemplates(template) {
    var templates = makeSubTemplatesArray(template)

    // Extracting the name of the template for each subtemplate
    templates.forEach(function(obj) {
        var templateFirstLine = obj.name // At this moment name is the first line of each sub template
        // Template name is either id or data-template-name
        var idIndex = templateFirstLine.indexOf("id=")
        var dataTmpName = templateFirstLine.indexOf("data-template-name=")
        var index = idIndex != -1 ? idIndex : dataTmpName
        if (index >= 0) {
            templateFirstLine = templateFirstLine.substring(index)
            var firstApost = templateFirstLine.indexOf("\'")
            var firstQuote = templateFirstLine.indexOf("\"")
            var secondApost = templateFirstLine.lastIndexOf("\'")
            var secondQuote = templateFirstLine.lastIndexOf("\"")
            var firstDelim = firstApost != -1 ? firstApost : firstQuote
            var secondDelim = secondApost != -1 ? secondApost : secondQuote
            if (firstDelim > 0 && secondDelim > 0) {
                obj.name = templateFirstLine.substring(firstDelim + 1, secondDelim)
            }
        }
    })
    return templates;
}
var createEmberPreprocessor = function() {
    var compiler = require('ember-template-compiler');
    return function(filePath, done) {
        var processed = "";
        try {
            var template = new Cli({args: [filePath]}).parseCommandLineArgs();
            // Case where script tags are included in file
            if (template['content'].indexOf('<script') >= 0) {
                var templates = parseSubTemplates(template['content'])
                templates.forEach(function(templateObj) {
                    var precompiledTemplate = compiler.precompile(templateObj.template.toString()).toString();
                    processed += "Ember.TEMPLATES['" + templateObj.name + "'] = Ember.Handlebars.template(" + precompiledTemplate + "); \n";
                })
            } else {
                // Do it the old way where only one naked template with forced naming convention exists
                var precompiledTemplate = compiler.precompile(template['content']).toString();
                processed = "Ember.TEMPLATES['" + template['name'] + "'] = Ember.Handlebars.template(" + precompiledTemplate + ");";
            }
        } catch (e) {
            console.warn('%s  at %s', e.message, filePath)
        }
        done(processed);
    };
};

createEmberPreprocessor.$inject = ['logger', 'config.basePath'];

module.exports = {
    'preprocessor:ember': ['factory', createEmberPreprocessor],
    'createEmberPreprocessor': createEmberPreprocessor,
    'parseSubTempaltes': parseSubTemplates,
    'makeSubTemplatesArray': makeSubTemplatesArray
};