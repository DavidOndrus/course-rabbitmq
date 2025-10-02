import amqplib from 'amqplib'

export const amqp = async app => {
  const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
  const amqpListenerChannel = await amqpConnection.createChannel();
  await amqpListenerChannel.assertQueue('feathers-notifications');
  await amqpListenerChannel.bindQueue('feathers-notifications', 'amq.topic', 'order.#');
  await amqpListenerChannel.consume('feathers-notifications', async message => {
    const {routingKey} = message.fields;
    const messageBody = JSON.parse(message.content.toString());

    const {default: processor} = await import(`./events/${routingKey}.js`);
    await processor(app, amqpListenerChannel, messageBody, message);
  });
}
