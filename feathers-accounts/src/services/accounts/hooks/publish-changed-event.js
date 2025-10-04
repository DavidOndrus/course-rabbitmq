export const publishChangedEvent = async context => {
  for (const account of context.result) {
    const accountStringified = JSON.stringify(account);
    context.app.logger.info('Publishing event account.changed');
    context.app.logger.debug(`Publishing event account.changed with content: ${accountStringified}`);

    context.app.amqpPublisherChannel.publish('amq.topic', 'account.changed', Buffer.from(accountStringified));
  }
}
