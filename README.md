# karma-ember-preprocessor

> Preprocessor to compile handlebars templates for ember.js on the fly

For more information on Karma see the [homepage].

Requires Karma 0.9+

To use this with karma, first you will need to install it with npm

    npm install karma-ember-preprocessor

Next you need to create a configuration file using karma init


    module.exports = function(karma) {
        karma.set({
            basePath: 'js',

            files: [
              "vendor/jquery/jquery.min.js",
              "vendor/handlebars/handlebars.js",
              "vendor/ember/ember.js",
              "app.js",
              "tests/*.js",
              "templates/*.handlebars"
            ],

            logLevel: karma.LOG_ERROR,
            browsers: ['PhantomJS'],
            singleRun: true,
            autoWatch: false,

            frameworks: ["qunit"],

            plugins: [
                'karma-qunit',
                'karma-chrome-launcher',
                'karma-ember-preprocessor',
                'karma-phantomjs-launcher'
            ],

            preprocessors: {
                "**/*.handlebars": 'ember'
            }
        });
    };

In case you want to use your custom Ember template compiler, you can specify path for it in the preprocessor configuration
    
    module.exports = function(karma) {
        karma.set({

            ...

            emberPreprocessor: {
                compilerPath: 'bower_components/ember/ember-template-compiler.js'
            }
        });
    };

Processed templates will made available in Ember.TEMPLATES. For example:

    templates/parent.hbs // => Ember.TEMPLATES['parent']
    templates/parent/child.hbs // => Ember.TEMPLATES['parent/child']
    templates/parent/child/index.hbs // => Ember.TEMPLATES['parent/child/index']

[homepage]: http://karma-runner.github.com

