# karma-ember-preprocessor

For more information on Karma see the [homepage].

Requires Karma 0.9+

This forked version gives a bit more flexibility that the original:
- Handlebar file can have multiple templates defined within it
- Template names do not have to match file path hierarchy

E.g.
in file: templates/app/events/event.hbs

Template name can be "events" instead of "app/events/event"
Multiple templates can be defined within that file
```html
<script type="text/x-handlebars" id="events">
  {{view Blocks.EventsContainerView  startEventBinding="startEvent"  endEventBinding="endEvent"}}
</script>
<script type="text/x-handlebars" id="somethingelse">
  // Something else
</script>
```
Currently not downloadable through npm. Will add support soon

