if(typeof require === 'function') {
  const buster    = require("buster")
      , Sequelize = require("../index")
      , config    = require("./config")
      , dialects  = ['sqlite', 'mysql', 'postgres']
}

buster.spec.expose()

dialects.forEach(function(dialect) {
  describe('DAO@' + dialect, function() {
    before(function(done) {
      var self = this

      this.sequelize = new Sequelize(config.database, config.username, config.password, {
        logging: false
      })

      this.User = this.sequelize.define('User', {
        username: { type: Sequelize.STRING },
        touchedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      })

      self.sequelize
        .getQueryInterface()
        .dropAllTables()
        .success(function() {
          self.User
            .sync({ force: true })
            .success(done)
            .error(function(err) {
              console.log(err)
            })
        })
        .error(function(err) { console.log(err) })
    })

    describe('default values', function() {
      describe('current date', function() {
        it('should store a date in touchedAt', function() {
          var user = this.User.build({ username: 'a user'})
          expect(user.touchedAt instanceof Date).toBeTrue()
        })

        it("should store the current date in touchedAt", function() {
          this.useFakeTimers().tick(5000)

          var user = this.User.build({ username: 'a user'})
          expect(+user.touchedAt).toBe(5000)
        })
      })
    })
  })
})
