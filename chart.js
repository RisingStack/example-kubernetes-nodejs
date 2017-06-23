'use strict'

const anchor = require('@risingstack/anchor')

anchor.snapshot({
  overwrite: true,
  outputPath: './output',
  name: 'gateway',
  description: 'Backup of gateway service',
  version: '1.0.0',
  namespace: 'default',
  resources: [
    'deployment/gateway',
    'secret/my',
    'service/gateway'
  ]
})
  .then(() => console.log('Snapshot finished'))
  .catch((err) => console.error('Snapshot error', err))
