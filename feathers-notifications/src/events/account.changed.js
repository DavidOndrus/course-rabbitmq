import nodemailer from 'nodemailer';

export default async function onOrderCreated(app, amqpListenerChannel, body, message) {
  await nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
  }).sendMail({
    from: 'Marketplace <marketplace@email.com>',
    to: `${body.owner} <${body.owner.toLowerCase()}@email.com>`,
    subject: 'Loyalty account balance',
    text: `Current balance: ${body.points}`,
    html: `<b>Current balance: ${body.points}</b>`,
  });

  app.logger.debug(`Email sent to ${body.owner}`);

  await amqpListenerChannel.ack(message);
}
