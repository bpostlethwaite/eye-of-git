var eye = require('./index')


var watcher = eye()

var watchdir = '../brikabrak'

watcher.watch(watchdir, {
  'branches' : ['master', 'publish']
})


watcher.on("change", function (head) {
  console.log(head.branch)
  console.log(head.commit)
})
