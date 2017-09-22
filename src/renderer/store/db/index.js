import LinvoDB from 'linvodb3'

let modelName = 'audio'

LinvoDB.dbPath = [process.cwd(), 'db/audio.db'].join('/')
LinvoDB.defaults.store = { db: require('level-js') }

let db = new LinvoDB(modelName, { })

export default {
  db,
  install: function (vue) {
    vue.prototype.$db = db
  }
}