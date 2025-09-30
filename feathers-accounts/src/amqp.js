import amqplib from 'amqplib';

export const amqp = async app => {
  const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
  const amqpListenerChannel = await amqpConnection.createChannel();
  await amqpListenerChannel.assertQueue('feathers-accounts');
  await amqpListenerChannel.bindQueue('feathers-accounts', 'amq.topic', 'order.#');
  await amqpListenerChannel.consume('feathers-accounts', async message => {
    console.log(message.content.toString());

    const order = JSON.parse(message.content.toString());

    try {
      await app.service('accounts').patch(null, {
        $inc: {points: 1},
        $setOnInsert: {owner: order.author},
      }, {
        query: {
          owner: order.author,
        },
        mongodb: {
          upsert: true,
        },
      });
    } catch (error) {
      return amqpListenerChannel.nack(message);
    }

    amqpListenerChannel.ack(message);
  });
}
