/*
 * eye-of-git
 *
 * Ben Postlethwaite
 * May 2013
 * License MIT
 */
var path = require('path')
  , fs = require('fs')
  , tiny = require('tiny-watcher')
  , EventEmitter = require('events').EventEmitter

module.exports = function(repoPath, branches) {


  var self = new EventEmitter
  self.branchHead = {}


  var repo = path.basename(repoPath)
  var headPath = path.resolve(repoPath, '.git', 'refs', 'heads')


  /*
   * Route branches argument
   * directly to tiny-watcher.
   */
  var watcher = tiny(headPath, branches)


  watcher.on('added', function(branch) {

    /*
     * Git produces these .lock files
     * that we want to ignore
     */
    if ( gitlock(branch) ) return

    var branchPath = path.join(headPath, branch)

    getCommit(branchPath, function (commit) {

      self.branchHead[branchPath] = commit

      self.emit("commit", {
        repo: repo
      , branch: branch
      , commit: commit
      })

    })
  })


  watcher.on('removed', function (branch) {

    var branchPath = path.join(headPath, branch)

    delete self.branchHead[branchPath]

  })


  watcher.on("changed", function (branch) {

    if ( gitlock(branch) ) return

    var branchPath = path.join(headPath, branch)

    /*
     * Get the commit from the changed head
     */
    getCommit(branchPath, function (commit) {

      /*
       * Check if it's different than the previous commit
       */
      if (self.branchHead[branchPath] !== commit) {

        self.branchHead[branchPath] = commit

        self.emit("commit", {
          repo: repo
        , branch: branch
        , commit: commit
        })
      }

    })
  })




  function getCommit (file, cb) {

    fs.readFile(file, {encoding: 'utf8'}, function (err, data) {

      if (err) throw err

      /*
       * Might want to strip off whitespace off commit text to be sure
       * of a match
       */
      cb(data)
    })
  }


  function gitlock (file) {
    return (file.indexOf(".lock") > -1 )
  }


  function emitHeads () {
    /*
     * Asks tiny-watcher emitWatched function
     * to emit a added events for each file
     * tiny-watcher is monitoring.
     * These will be caught by eye-of-git
     */
    watcher.emitWatched("added")
  }


  self.emitHeads = emitHeads

  return self
}
