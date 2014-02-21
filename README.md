# karma-ember-preprocessor-flexible

> A Karma plugin. Compile handlebars templates for ember.js on the fly. Also gives more flexibility by allowing templates to have any name by not forcing strict file naming convention. Also allows multiple templates to be within one file.

For more information on Karma see the [homepage].

Requires Karma 0.9+

To use this with karma, first you will need to install it with npm

    npm install karma-ember-preprocessor-flexible

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
                'karma-ember-preprocessor-flexible',
                'karma-phantomjs-launcher'
            ],

            preprocessors: {
                "**/*.handlebars": 'ember'
            }
        });
    };


This forked version gives a bit more flexibility that the original:
- Handlebar file can have multiple templates defined within it
- Template names do not have to match file path hierarchy

e.g.
in file: templates/app/events/event.hbs

Template name (or id) can be "events" or "anything" instead of having to be "app/events/event". In addition, multiple templates can exist within the file.

```html
// templates/app/events/events.hbs
<script type="text/x-handlebars" id="events">
  {{view Blocks.EventsContainerView  startEventBinding="startEvent"  endEventBinding="endEvent"}}
</script>
<script type="text/x-handlebars" data-template-name="somethingelse">
  // Something else
</script>
```

[homepage]: http://karma-runner.github.com