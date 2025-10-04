import amqplib from 'amqplib';
import onOrderCreated from './events/order.created.js';

export const amqp = async app => {
  const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
  app.logger.info('Connected to AMQP');

  const amqpListenerChannel = await amqpConnection.createChannel();
  await amqpListenerChannel.assertExchange('deadletter', 'topic');
  await amqpListenerChannel.assertQueue('deadletters');
  await amqpListenerChannel.bindQueue('deadletters', 'deadletter', '#');

  await amqpListenerChannel.assertQueue('feathers-accounts', {
    deadLetterExchange: 'deadletter',
  });
  await amqpListenerChannel.bindQueue('feathers-accounts', 'amq.topic', 'order.#');

  await amqpListenerChannel.consume('feathers-accounts', async message => {
    const {routingKey} = message.fields;
    app.logger.info(`Received AMQP message with routing key ${routingKey}`);

    const messageContent = message.content.toString();
    app.logger.debug(`Received AMQP message with body: ${JSON.stringify(messageContent)}`);
    const messageBody = JSON.parse(messageContent);

    try {
      switch (routingKey) {
        case 'order.created': {
          await onOrderCreated(app, amqpListenerChannel, messageBody, message);
          break;
        }
        default: {
          amqpListenerChannel.ack(message);
          break;
        }
      }
    } catch (error) {
      app.logger.error(`Deadlettering AMQP message with routing key ${routingKey}`);
      amqpListenerChannel.nack(message, false, false);
    }
  });

  app.amqpPublisherChannel = await amqpConnection.createChannel();
}
