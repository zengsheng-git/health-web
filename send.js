import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url'; // Importing the Node.js built-in url module

// Get the directory path of the current file
const __filename = fileURLToPath(import.meta.url); // Get the absolute path of the current file
const __dirname = path.dirname(__filename); // Get the directory name

// Creating a reusable mail transport
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: '1218128305@qq.com',
    pass: 'opsokizeoixxjiie'
  }
});

// Function to send email with attachment
async function sendEmailWithAttachment() {
  try {
    const info = await transporter.sendMail({
      from: '1218128305@qq.com',
      to: 'zengsheng0870@dingtalk.com',
      subject: 'QQ mailbox code sending test (with attachment)',
      text: 'This is a test email with an attachment',
      html: '<h1>HTML email with attachment</h1><p>Please check the attachment</p>',
      attachments: [
        {
          filename: 'Test Document.md', // Attachment file name
          path: path.join(__dirname, 'project.md') // Path to the attachment file
        }
        // You can add more attachments here if needed
      ]
    });
    console.log('Mail sent successfully, ID:', info.messageId);
  } catch (error) {
    console.error('Sending failed：', error);
  }
}

sendEmailWithAttachment();