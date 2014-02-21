require('../lib/cli');

var path = require('path');
var main = require('../lib/main');

describe("Ember Preprocessor Tests", function() {
    var makeSubTemplatesArray = main.makeSubTemplatesArray
    var parseSubTemplates = main.parseSubTemplates
    var preprocessor = main.createEmberPreprocessor
    it("testing makeSubTemplatesArray for a file with only one template", function() {
        var sut = new Cli({
            args: [path.join('file-system', 'app', 'flexible-templates', 'stuff.handlebars')]
        });
        result = sut.parseCommandLineArgs();
        var subTemplates = makeSubTemplatesArray(result['content'])
        expect(subTemplates.length).toEqual(1)
        expect(subTemplates[0].name).toEqual("<script type=\"text/x-handlebars\" id=\"employments\">")
        expect(subTemplates[0].template.replace(/\n/, '').trim())
            .toEqual("{{#view Blocks.EmploymentNavigationView}}{{/view}}{{#view Blocks.EmploymentNavigationView}}{{/view}}".trim())
    });

    it("testing makeSubTemplatesArray for a file with multiple templates and using apostrophe instead of quotations for name", function() {
        var sut = new Cli({
            args: [path.join('file-system', 'app', 'flexible-templates', 'employments', 'multipletemplates.hbs')]
        });
        result = sut.parseCommandLineArgs();
        var subTemplates = makeSubTemplatesArray(result['content'])
        expect(true).toEqual(true)
        expect(subTemplates.length).toEqual(2)
        expect(subTemplates[0].name).toEqual("<script type=\"text/x-handlebars\" id=\'dashboard\'>")
        expect(subTemplates[0].template.replace(/\n/, '').trim()).toEqual("<div id=\"dashboard\"></div>".trim())
        expect(subTemplates[1].name).toEqual("<script type=\"text/x-handlebars\" data-template-name=\'dashboard-helper\'>")
        expect(subTemplates[1].template.replace(/\n/, '').trim()).toEqual("<div><span></span></div>".trim())
    });

    it("testing emberpreprocessor function on one file (flexible-templates)", function() {
        var filePath = path.join('file-system', 'app', 'flexible-templates', 'stuff.handlebars')
        var callback = function(processed) {
            expect(processed.indexOf("Ember.TEMPLATES[\'employments\']")).not.toBeLessThan(0)
        }
        preprocessor()(filePath, callback)
    });

    it("testing emberpreprocessor function on multiple template in a file (flexible-templates)", function() {
        var filePath = path.join('file-system', 'app', 'flexible-templates', 'employments', 'multipletemplates.hbs')
        var callback = function(processed) {
            expect(processed.indexOf("Ember.TEMPLATES[\'dashboard-helper\']")).not.toBeLessThan(0)
            expect(processed.indexOf("Ember.TEMPLATES[\'dashboard\']")).not.toBeLessThan(0)
        }
        preprocessor()(filePath, callback)
    });

    it("testing emberpreprocessor function on a root path level file (traditional-templates)", function() {
        var filePath = path.join('file-system', 'app', 'templates', 'foo.handlebars')
        var callback = function(processed) {
            expect(processed.indexOf("Ember.TEMPLATES[\'foo\']")).not.toBeLessThan(0)
        }
        preprocessor()(filePath, callback)
    });

    it("testing emberpreprocessor function on nested file (traditional-templates)", function() {
        var filePath = path.join('file-system', 'app', 'templates', 'tables', 'other.hbs')
        var callback = function(processed) {
            console.warn(processed)
            expect(processed.indexOf("Ember.TEMPLATES[\'tables/other\']")).not.toBeLessThan(0)
        }
        preprocessor()(filePath, callback)
    });
});