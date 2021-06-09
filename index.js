// Datadog tracing (APM)
// This line must come before importing any instrumented module.
// See https://docs.datadoghq.com/tracing/setup_overview/setup/nodejs/
const tracer = require('dd-trace').init({
  // Connect logs and traces
  // See https://docs.datadoghq.com/tracing/connect_logs_and_traces/nodejs/
  logInjection: true
});

// Datadog logger (winston)
// See https://www.datadoghq.com/blog/node-logging-best-practices/
// See https://docs.datadoghq.com/logs/log_collection/nodejs/
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, json } = format;
const logger = createLogger({
  // level: 'info',
  // exitOnError: false,
  // format: format.json(),
  // defaultMeta: { component: 'hello-world' },
  format: combine(
    timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }),
    json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
    // new transports.Http(httpTransportOptions),
  ],
  // Automatically log uncaught exceptions
  exceptionHandlers: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log'})
  ]
});

// Express
const express = require('express')
const app = express()
const port = 3000

// [DEPRECATED] Datadog Express integration (connect-datadog middleware)
// See https://github.com/DataDog/node-connect-datadog/issues/22
// var dd_options = {
//   'response_code':true,
//   'tags': ['app:my_app']
// }
// var connect_datadog = require('connect-datadog')(dd_options);
// app.use(connect_datadog);

// HTTP routes
app.get('/', (req, res) => {
  res.send("Hello World!\n")
})
app.get('/500', (req, res) => {
  // Calling a non-existing function
  exception("Oops!\n")
})

// Launch Express serer
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  logger.log('info', `Example app listening at http://localhost:${port}`);
  logger.info('Hello log with metas', {customAttribue: 'some value' });
})
