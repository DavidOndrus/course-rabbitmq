export const publishCreatedEvent = async context => {
  console.log(`Running hook publish-created-event on ${context.path}.${context.method}`)
  console.log(context.result);
  const content = Buffer.from(JSON.stringify(context.result));
  console.log(content);
  context.app.amqpPublisherChannel.publish('amq.topic', 'order.created', content)
}
