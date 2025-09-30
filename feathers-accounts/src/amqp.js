import amqplib from 'amqplib';
import onOrderCreated from './events/order.created.js';

export const amqp = async app => {
  const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');

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
    const messageBody = JSON.parse(message.content.toString());

    try {
      switch (routingKey) {
        case 'order.created': {
          // Simulate error for deadletter
          throw new Error('Error');
          await onOrderCreated(app, amqpListenerChannel, messageBody, message);
          break;
        }
        default: {
          amqpListenerChannel.ack(message);
          break;
        }
      }
    } catch (error) {
      console.error('Deadlettering message');
      amqpListenerChannel.nack(message, false, false);
    }
  });
}
