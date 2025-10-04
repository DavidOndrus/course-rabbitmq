export const publishChangedEvent = async context => {
  console.log(`Running hook publish-changed-event on ${context.path}.${context.method}`)
  console.log(context.result);

  for (const account of context.result) {
    const content = Buffer.from(JSON.stringify(account));
    console.log(content);
    context.app.amqpPublisherChannel.publish('amq.topic', 'account.changed', content);
  }
}
