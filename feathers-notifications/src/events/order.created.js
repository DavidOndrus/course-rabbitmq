import nodemailer from 'nodemailer';

export default async function onOrderCreated(app, amqpListenerChannel, body, message) {
  const mail = await nodemailer.createTransport({
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

  console.log('Message sent:', mail.messageId);

  await amqpListenerChannel.ack(message);
}
