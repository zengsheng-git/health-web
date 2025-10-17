import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url'; // 引入 Node.js 内置的 url 模块

// 手动计算当前文件的目录路径（替代 __dirname）
const __filename = fileURLToPath(import.meta.url); // 获取当前文件的绝对路径
const __dirname = path.dirname(__filename); // 获取当前文件所在目录的绝对路径

// 配置 SMTP transporter（不变）
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: '1218128305@qq.com',
    pass: 'opsokizeoixxjiie'
  }
});

// 发送带附件的邮件
async function sendEmailWithAttachment() {
  try {
    const info = await transporter.sendMail({
      from: '1218128305@qq.com',
      to: 'zengsheng0870@dingtalk.com',
      subject: 'QQ邮箱代码发送测试（带附件）',
      text: '这是带附件的测试邮件',
      html: '<h1>带附件的HTML邮件</h1><p>请查收附件</p>',
      attachments: [
        {
          filename: '测试文档.md', // 收件人看到的文件名
          path: path.join(__dirname, 'project.md') // 使用计算出的 __dirname 拼接路径
        }
        // 可添加更多附件
      ]
    });
    console.log('邮件发送成功，ID：', info.messageId);
  } catch (error) {
    console.error('发送失败：', error);
  }
}

sendEmailWithAttachment();