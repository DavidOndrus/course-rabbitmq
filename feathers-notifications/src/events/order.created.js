import nodemailer from 'nodemailer';

export default async function onOrderCreated(app, amqpListenerChannel, body, message) {
  await nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
  }).sendMail({
    from: 'Marketplace <marketplace@email.com>',
    to: `${body.author} <${body.author.toLowerCase()}@email.com>`,
    subject: 'Your order was processed',
    text: `Order with ${body.item} will be shipped in 1 day`,
    html: `<b>Order with ${body.item} will be shipped in 1 day</b>`,
  });

  app.logger.debug(`Email sent to ${body.author}`);

  await amqpListenerChannel.ack(message);
}
