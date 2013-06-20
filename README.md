# karma-ember-preprocessor

> Preprocessor to compile handlebars templates for ember.js on the fly

For more information on Karma see the [homepage].

Requires Karam 0.9.2+

To use this with karma, first you will need to install it with npm

    npm install karma-ember-preprocessor

Next install karma 0.9.2 with npm and add some configuration (sample karma.conf.js)

    frameworks = ["qunit"];

    plugins = [
        'karma-qunit',
        'karma-chrome-launcher',
        'karma-ember-preprocessor',
        'karma-phantomjs-launcher'
    ];

    preprocessors = {
        "**/*.handlebars": 'ember'
    };

    files = [
      "lib/jquery/jquery.min.js",
      "lib/handlebars/handlebars.js",
      "lib/ember/ember.js",
      "app.js",
      "tests/*.js",
      "templates/*.handlebars"
    ];

    browsers = ['PhantomJS'];
    singleRun = true;
    autoWatch = false;


[homepage]: http://karma-runner.github.com

