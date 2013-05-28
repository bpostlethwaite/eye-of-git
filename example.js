var eye = require('./index')


var watcher = eye()

var watchdir = '../brikabrak'

watcher.watch(watchdir, {
  'branches' : ['master']
})


watcher.on("change", function (head) {
  console.log(head.branch)
  console.log(head.commit)
})
