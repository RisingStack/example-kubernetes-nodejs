'use strict'

const crypto = require('crypto')
const express = require('express')

const app = express()
const port = process.env.PORT || 3001
const secret = 'abcdefg'

const server = app.listen(port, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }

  console.log(`Server is listening on ${port} port`)
})

app.get('/', (req, res) => {
  res.json({ service: 'gateway' })
})

app.get('/load', (req, res) => {
  const hash = crypto.createHmac('sha256', secret)
   .update('I love cupcakes')
   .digest('hex')

  res.json({ hash })
})

app.get('/secret', (req, res) => {
  res.json({ secret: process.env.MY_SECRET })
})

app.get('/healthz', (req, res) => {
  res.end()
})

process.on('SIGTERM', () => {
  server.close((err) => {
    console.error(err)
    process.exit(1)
  })

  process.exit(0)
})
