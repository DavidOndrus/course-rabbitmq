// For more information about this file see https://dove.feathersjs.com/guides/cli/application.html
import { feathers } from '@feathersjs/feathers'
import express, {
  rest,
  json,
  urlencoded,
  cors,
  serveStatic,
  notFound,
  errorHandler
} from '@feathersjs/express'
import configuration from '@feathersjs/configuration'
import { configurationValidator } from './configuration.js'
import { logger } from './logger.js'
import { logError } from './hooks/log-error.js'
import { mongodb } from './mongodb.js'
import { services } from './services/index.js'
import amqplib from 'amqplib'
import nodemailer from 'nodemailer';

const app = express(feathers())

// Load app configuration
app.configure(configuration(configurationValidator))
app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))
// Host the public folder
app.use('/', serveStatic(app.get('public')))

// Configure services and real-time functionality
app.configure(rest())

app.configure(mongodb)

app.configure(services)

// Configure a middleware for 404s and the error handler
app.use(notFound())
app.use(errorHandler({ logger }))

// Register hooks that run on all service methods
app.hooks({
  around: {
    all: [logError]
  },
  before: {},
  after: {},
  error: {}
})
// Register application setup and teardown hooks here
app.hooks({
  setup: [],
  teardown: []
})

const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
const amqpListenerChannel = await amqpConnection.createChannel();
await amqpListenerChannel.assertQueue('feathers-notifications');
await amqpListenerChannel.bindQueue('feathers-notifications', 'amq.topic', 'order.#');
await amqpListenerChannel.consume('feathers-notifications', async message => {
  const transporter = nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
  });

  const info = await transporter.sendMail({
    from: 'Marketplace <marketplace@email.com>',
    to: 'David <david@email.com>',
    subject: 'Your order was processed',
    text: 'Order will be shipped in 1 day',
    html: '<b>Order will be shipped in 1 day</b>',
  });

  console.log('Message sent:', info.messageId);

  await amqpListenerChannel.ack(message);
});

export { app }
