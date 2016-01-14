# meteor-locksmith
Lock a function over several app instances or builds.

Inspired by the API of [shepelt:locksmith](http://fastosphere.meteor.com/shepelt%253Alocksmith?q=locks). Couldn't find any repo with source, so I reimplemented.

## Why use this package?
TODO

## How to use?
```javascript

// override default number of seconds to keep lock
// default: 60s
LockSmith.lockTTL = 3;

// setup an observer that can only run once over all instances
LockSmith.once("unique name of your lock", function() {
    console.log('do something that can only run once');
    Projects.find().observe({
        'added': function() {
            // all projects will only be added once
            // even when you run multiple instance of your app
            // or this source was built in multiple apps
            console.log('added')
        }
    })
});
```

## License
Licensed under the MIT License.
