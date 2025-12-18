import nodemailer from 'nodemailer';

function generateDiscountCode() {
  // Generate a random 8-character alphanumeric discount code
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';

  let code = '';
  for (let i = 0; i < 4; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  code += '-';
  
  for (let i = 0; i < 4; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
}

export default async function accountWon(app, amqpListenerChannel, body, message) {
  const discountCode = generateDiscountCode();
  
  await nodemailer.createTransport({
    host: 'mailhog',
    port: 1025,
    secure: false,
  }).sendMail({
    from: 'Marketplace <marketplace@email.com>',
    to: `${body.owner} <${body.owner.toLowerCase()}@email.com>`,
    subject: 'Congratulations! You\'ve Won!',
    text: `Congratulations ${body.owner}! You've reached ${body.points} points! As a reward, here's your exclusive discount code: ${discountCode}. Use it at checkout for a special discount!`,
    html: `
      <h2>Congratulations ${body.owner}!</h2>
      <p>You've reached <strong>${body.points} points</strong>! 🎉</p>
      <p>As a reward for your loyalty, here's your exclusive discount code:</p>
      <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
        ${discountCode}
      </div>
      <p>Use it at checkout for a special discount!</p>
      <p>Thank you for being a valued customer!</p>
    `,
  });

  app.logger.debug(`Congratulations email sent to ${body.owner} with discount code: ${discountCode}`);

  await amqpListenerChannel.ack(message);
}

