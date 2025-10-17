const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({origin: true});

// 初始化Firebase Admin
admin.initializeApp();

// 创建邮件传输器（使用QQ邮箱SMTP）
const transporter = nodemailer.createTransporter({
  host: 'smtp.qq.com',
  port: 587,
  secure: false,
  auth: {
    user: '1218128305@qq.com', // 发件人邮箱
    pass: 'opsokizeoixxjiie'
  }
});

// 邮件发送云函数
exports.sendContactEmail = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // 只允许POST请求
    if (req.method !== 'POST') {
      return res.status(405).json({
        success: false,
        message: 'Only POST requests are supported'
      });
    }

    try {
      const { name, subject, message, attachment } = req.body;

      // 验证必填字段
      if (!name || !subject || !message) {
        return res.status(400).json({
          success: false,
          message: 'Please fill in all the required fields'
        });
      }

      // 邮件内容 publichealthy@gmail.com
      const mailOptions = {
        from: '<1218128305@qq.com>',
        to: 'publichealthy@gmail.com',
        subject: `${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
              <p><strong>Name: </strong>${name}</p>
              <p><strong>Subject: </strong>${subject}</p>
              <p><strong>Message content: </strong></p>
              <div style="background: white; padding: 15px; border-radius: 3px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
              ${attachment ? `<p><strong>附件：</strong>The user has uploaded an attachment. Please check the email attachment</p>` : ''}
            </div>
          </div>
        `
      };

      // 处理附件（如果提供了base64编码的附件）
      if (attachment && attachment.filename && attachment.content) {
        mailOptions.attachments = [{
          filename: attachment.filename,
          content: attachment.content,
          encoding: 'base64'
        }];
      }

      // 发送邮件
      await transporter.sendMail(mailOptions);

      return res.json({
        success: true,
        message: '邮件发送成功'
      });

    } catch (error) {
      console.error('邮件发送失败:', error);
      return res.status(500).json({
        success: false,
        message: '邮件发送失败，请稍后重试'
      });
    }
  });
});