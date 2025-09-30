import amqplib from 'amqplib'
import nodemailer from 'nodemailer';

export const amqp = async app => {
  const amqpConnection = await amqplib.connect('amqp://rabbitmq:rabbitmq@rabbitmq');
  const amqpListenerChannel = await amqpConnection.createChannel();
  await amqpListenerChannel.assertQueue('feathers-notifications');
  await amqpListenerChannel.bindQueue('feathers-notifications', 'amq.topic', 'order.#');
  await amqpListenerChannel.consume('feathers-notifications', async message => {
    const transporter = nodemailer.createTransport({
      host: 'mailhog',
      port: 1025,
      secure: false,
    });

    const info = await transporter.sendMail({
      from: 'Marketplace <marketplace@email.com>',
      to: 'David <david@email.com>',
      subject: 'Your order was processed',
      text: 'Order will be shipped in 1 day',
      html: '<b>Order will be shipped in 1 day</b>',
    });

    console.log('Message sent:', info.messageId);

    await amqpListenerChannel.ack(message);
  });
}
