import amqplib from 'amqplib'

export const amqp = async app => {
  let amqpConnection;

  try {
    amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
    app.logger.info('Connected to AMQP');

    amqpConnection.on('close', async () => {
      app.logger.warn('AMQP connection closed');
      reconnect(app);
    });

    const amqpListenerChannel = await amqpConnection.createChannel();
    await amqpListenerChannel.assertQueue('feathers-notifications');
    await amqpListenerChannel.bindQueue('feathers-notifications', 'amq.topic', 'order.#');
    await amqpListenerChannel.bindQueue('feathers-notifications', 'amq.topic', 'account.changed');
    await amqpListenerChannel.consume('feathers-notifications', async message => {
      const {routingKey} = message.fields;
      app.logger.info(`Received AMQP message with routing key ${routingKey}`);

      const messageContent = message.content.toString();
      app.logger.debug(`Received AMQP message with body: ${JSON.stringify(messageContent)}`);
      const messageBody = JSON.parse(messageContent);

      const {default: processor} = await import(`./events/${routingKey}.js`);
      await processor(app, amqpListenerChannel, messageBody, message);
    });
  } catch (error) {
    app.logger.error('Failed to connect to AMQP');
    reconnect(app);
  }
}

function reconnect(app) {
  app.logger.debug('Reconnecting to AMQP...');
  setTimeout(async () => {
    await amqp(app);
  }, 3000);
}
