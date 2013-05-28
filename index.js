/*
 * eye-of-git
 *
 * Ben Postlethwaite
 * May 2013
 * License MIT
 */
var path = require('path')
  , fs = require('fs')
  , EventEmitter = require('events').EventEmitter

module.exports = function() {


  var self = new EventEmitter
  self.previousCommits = {}


  function watch(repoPath, options) {

    /*
     * Parse option object
     */
    options = options || {}

    var branches = options.branches || ['master']
    if (!Array.isArray(branches))
      branches = Array(branches)

    var repo = path.basename(repoPath)

    /*
     * Set watcher for each branch head
     */
    branches.forEach( function (branch) {
      var repoHead = path.resolve(repoPath, '.git', 'refs', 'heads', branch)
      monitor(repo, branch, repoHead)
    })
  }


  function monitor(repo, branch, repoHead) {

    console.log('about to monitor', repoHead)
    var monitor = fs.watch(repoHead)

    monitor.on("change", function (event, f) {
      /*
       * Get the commit from the changed head
       */
      getCommit(repoHead, function (commit) {

        /*
         * Check if it's different than the previous commit
         */
        if (!self.previousCommits[repoHead] ||
            self.previousCommits[repoHead] !== commit) {

          self.emit("change", {
            repo: repo
          , branch: branch
          , commit: commit
          })

          self.previousCommits[repoHead] = commit

        }
      })
    })
  }


  function getCommit (file, cb) {

    fs.readFile(file, {encoding: 'utf8'}, function (err, data) {

      if (err) throw err

      /*
       * Might want to strip off possible whitespace here
       */
      cb(data)
    })
  }


  self.watch = watch


  return self
}
