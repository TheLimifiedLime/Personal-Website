const fastify = require('fastify')({ logger: false})
const path = require('path')
const fs = require('fs')
const port = 3000;

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'public'),
  prefix: '/', // optional: default '/'
})

fastify.setNotFoundHandler(function (req, reply) {
  const stream = fs.createReadStream(`./public/404.html`)
  reply.type(`text/html`).send(stream)
})

fastify.get('/', (req, reply) => {
  const stream = fs.createReadStream(`./public/index.html`)
  reply.type(`text/html`).send(stream)
})

fastify.listen(port, '0.0.0.0', (err) => {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  fastify.log.info(`Server Started`)
})