// Heroku Concurrency
const throng = require('throng'),
  // Requirements
  generalConfig = require('./config/generalConfig')

// Use cluster (more node services executing this)
throng(
  {
    workers: generalConfig.workers,
    lifetime: Infinity,
  },
  start
)

// Express server runned by workers
function start(workerId) {
  const debug = require('debug')(`HTTP Worker ${workerId}`),
    app = require('./config/express')

  // If server is turned off
  process.on('SIGTERM', () => {
    debug(`Worker ${workerId} exiting...`)
    process.exit()
  })

  // Initialize server
  const server = app.listen(app.get('port'), function() {
    debug(
      `
      Express server
      Listening on port ${server.address().port}
      In ${generalConfig.env} mode
      On host ${server.address().address}`
    )
  })
}
