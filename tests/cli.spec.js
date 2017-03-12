require('../lib/cli');
var os = require('os');
var path = require('path');

describe("CommandLineParser Tests", function() {

  it("returns templateName without handlebars extension when valid filepath passed in", function() {
    var tpl = path.join('file-system', 'app', 'templates', 'foo.handlebars');
    var sut = new Cli({args:[tpl]});
    result = sut.parseCommandLineArgs();
    expect(result['name']).toEqual('foo');
  });

  it("returns template content when valid filepath passed in and it exists on the filesystem", function() {
    var tpl = path.join('file-system', 'app', 'templates', 'foo.handlebars');
    var sut = new Cli({args:[tpl]});
    result = sut.parseCommandLineArgs();
    expect(result['content']).toEqual('{{outlet}}' + os.EOL);
  });

  it("returns template content and name when file extension is handlebars", function() {
    var tpl = path.join('file-system', 'app', 'templates', 'tables', 'index.handlebars');
    var sut = new Cli({args:[tpl]});
    result = sut.parseCommandLineArgs();
    expect(result['content']).toEqual('{{outlet}}' + os.EOL);
    expect(result['name']).toEqual('tables/index');
  });

  it("returns template content and name when file extension is hbs", function() {
    var tpl = path.join('file-system', 'app', 'templates', 'tables', 'other.hbs');
    var sut = new Cli({args:[tpl]});
    result = sut.parseCommandLineArgs();
    expect(result['content']).toEqual('{{outlet}}' + os.EOL);
    expect(result['name']).toEqual('tables/other');
  });

  it('returns nested template paths', function () {
    var tpl = path.join('file-system', 'app', 'templates', 'tables', 'child', 'index.handlebars');
    var sut = new Cli({args:[tpl]});
    result = sut.parseCommandLineArgs();
    expect(result['content']).toEqual('{{outlet}}' + os.EOL);
    expect(result['name']).toEqual('tables/child/index');
  });

  it("returns template content and name when a path is used that is not normalized for the current operating system",
      function() {
        var tpl = './file-system/app/templates/tables/other.hbs'
        var sut = new Cli({args:[tpl]});
        result = sut.parseCommandLineArgs();
        expect(result['content']).toEqual('{{outlet}}' + os.EOL);
        expect(result['name']).toEqual('tables/other');
      });

  it('returns template name from transform function', function () {
    var tpl = path.join('file-system', 'app', 'templates', 'tables', 'child', 'index.handlebars');
    function trFn(templateName) {
      return 'foo/' + templateName.replace(/\\/g, '/').split('/')[4];
    }
    var sut = new Cli({args: [tpl, trFn]});
    result = sut.parseCommandLineArgs();
    expect(result['content']).toEqual('{{outlet}}' + os.EOL);
    expect(result['name']).toEqual('foo/child');
  });

});
