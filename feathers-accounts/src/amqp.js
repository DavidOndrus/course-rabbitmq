import amqplib from 'amqplib';
import onOrderCreated from './events/order.created.js';

export const amqp = async app => {
  const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
  const amqpListenerChannel = await amqpConnection.createChannel();
  await amqpListenerChannel.assertQueue('feathers-accounts');
  await amqpListenerChannel.bindQueue('feathers-accounts', 'amq.topic', 'order.#');
  await amqpListenerChannel.consume('feathers-accounts', async message => {
    const {routingKey} = message.fields;
    const messageBody = JSON.parse(message.content.toString());

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
  });
}
