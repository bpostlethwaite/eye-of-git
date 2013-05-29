# eye-of-git

**eye-of-git** tracks the `.git/refs/heads` directory in a git repo for changes to the `head commit`. It emits `commit` events with the repo name, the branch that was changed and the commit it has been changed to.

## Example
```javascript
var eog = require('eye-of-git')

var watcher = eog('../../brikabrak', ['master', 'publish'])

/*
 * Lets get some "commit" events for the
 * heads already in the .git repo
 */
watcher.emitHeads()

/*
 * Changes to branch heads will now
 * emit "commit" events.
 */
watcher.on("commit", function (head) {

  console.log(head.branch)
  console.log(head.commit)

  /*
   * Twilio txt updates or other fun
   * here :)
   */

})
```

## API

#### watcher = eog("/path/to/dir" [, ["list", "of", "files"]])
Call the module with the directory to be watched as well as an optional list of files to track specifically. **eog** just hands these argument directly into a [**tiny-watcher**](https://github.com/bpostlethwaite/tiny-watcher) instance.

#### watcher.on("commit", callback)
This is the only event currently supported. The callback is called with the `head` object.
```javascript
var head = {
          repo: "repo"
        , branch: "branch"
        , commit: "commit"
        }
```
more information may be included in future versions.

#### watcher.emitHeads()
force `eog` instance to emit `commit` events for all of the `head files` that the underlying [tiny-watcher](https://github.com/bpostlethwaite/tiny-watcher) is tracking.

## Install
```shell
npm install eye-of-git
```

## License
MIT
