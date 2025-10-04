import amqplib from 'amqplib';

export const amqp = async app => {
  let amqpConnection;

  try {
    amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
    app.logger.info('Connected to AMQP');

    amqpConnection.on('close', async () => {
      app.logger.warn('AMQP connection closed');
      reconnect(app);
    });

    app.amqpPublisherChannel = await amqpConnection.createChannel();
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
