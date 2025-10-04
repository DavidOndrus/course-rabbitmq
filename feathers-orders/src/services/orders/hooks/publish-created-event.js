export const publishCreatedEvent = async context => {
  const orderStringified = JSON.stringify(context.result);
  context.app.logger.info('Publishing event order.created');
  context.app.logger.debug(`Publishing event order.created with content: ${orderStringified}`);

  context.app.amqpPublisherChannel.publish('amq.topic', 'order.created', Buffer.from(orderStringified))
}
