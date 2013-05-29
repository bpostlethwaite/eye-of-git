var eog = require('../index')

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
