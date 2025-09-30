export default async function onOrderCreated(app, amqpListenerChannel, body, message) {
  try {
    await app.service('accounts').patch(null, {
      $inc: {points: 1},
      $setOnInsert: {owner: body.author},
    }, {
      query: {
        owner: body.author,
      },
      mongodb: {
        upsert: true,
      },
    });
  } catch (error) {
    return amqpListenerChannel.nack(message);
  }

  amqpListenerChannel.ack(message);
}
