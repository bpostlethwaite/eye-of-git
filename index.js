/*
 * eye-of-git
 *
 * Ben Postlethwaite
 * May 2013
 * License MIT
 */
var path = require('path')
  , fs = require('fs')
  , tiny = require('../tiny-watcher/.')
  , EventEmitter = require('events').EventEmitter

module.exports = function() {


  var self = new EventEmitter
  self.previousCommits = {}
  self.branches = []
  self.monitors = {}

  function watch(repoPath, options) {

    /*
     * Parse option object
     */
    options = options || {}

    var branches = options.branches || ['master']
    if (!Array.isArray(branches))
      branches = Array(branches)
    self.branches = branches

    var repo = path.basename(repoPath)
    var headPath = path.resolve(repoPath, '.git', 'refs', 'heads')

    /*
     * Set a watcher on head directory for specified branch creation
     */
    var watcher = tiny(headPath, branches)

    watcher.on('added', function(branch) {
      console.log("APP added", branch)

      var branchPath = path.join(headPath, branch)

      if (!self.previousCommits[branchPath]) {
        self.previousCommits[branchPath] = ''

        console.log("dwatcher about to set monitor on", branchPath)
        watcher.emit("changed", branch)
      }
    })


    watcher.on('removed', function (branch) {
      console.log("APP removed", branch)
      var branchPath = path.join(headPath, branch)

      console.log("dwatcher about to unmonitor on", branchPath)

      delete self.previousCommits[branchPath]

    })


    watcher.on("changed", function (branch) {
      console.log("APP changed", branch)
      var branchPath = path.join(headPath, branch)
      /*
       * Get the commit from the changed head
       */
      getCommit(branchPath, function (commit) {

        /*
         * Check if it's different than the previous commit
         */
        if (self.previousCommits[branchPath] !== commit) {

          self.emit("change", {
            repo: repo
          , branch: branch
          , commit: commit
          })

          self.previousCommits[branchPath] = commit

        }
      })
    })



  }


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

  self.watch = watch


  return self
}


// { domain: null,
//   _events: { change: [Function] },
//   _maxListeners: 10,
//   _handle: { owner: [Circular], onchange: [Function] } }
