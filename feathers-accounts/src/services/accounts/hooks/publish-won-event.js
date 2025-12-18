export const publishWonEvent = async context => {
  const accounts = Array.isArray(context.result) ? context.result : [context.result];

  for (const account of accounts) {
    if (account?.points === 33) {
      const accountStringified = JSON.stringify(account);
      context.app.logger.info('Publishing event account.won');
      context.app.logger.debug(`Publishing event account.won with content: ${accountStringified}`);

      context.app.amqpPublisherChannel.publish('amq.topic', 'account.won', Buffer.from(accountStringified));
    }
  }
}

