const express = require('express')
const multer = require('multer')
const nodemailer = require('nodemailer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// 中间件配置
app.use(cors())
app.use(express.json())

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads'
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB限制
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('不支持的文件类型'), false)
    }
  }
})

// 邮件传输器配置（使用send.js相同的配置）
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: '1218128305@qq.com',
      pass: 'opsokizeoixxjiie'
    }
  })
}

// 发送邮件API端点
app.post('/api/send-email', upload.single('attachment'), async (req, res) => {
  try {
    const { name, subject, message } = req.body
    
    if (!name || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: '请填写所有必填字段' 
      })
    }

    const transporter = createTransporter()
    
    const mailOptions = {
      from: '1218128305@qq.com',
      to: 'zengsheng0870@dingtalk.com',
      subject: `${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>姓名:</strong> ${name}</p>
            <p><strong>主题:</strong> ${subject}</p>
            <p><strong>消息内容:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `
    }

    // 如果有附件，添加到邮件
    if (req.file) {
      mailOptions.attachments = [{
        filename: req.file.originalname,
        path: req.file.path
      }]
    }

    // 发送邮件给管理员（包含附件）
    await transporter.sendMail(mailOptions)

    // 清理上传的文件
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }

    res.json({ 
      success: true, 
      message: '邮件发送成功' 
    })

  } catch (error) {
    console.error('邮件发送错误:', error)
    
    // 清理上传的文件（如果存在）
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    let errorMessage = '邮件发送失败，请稍后重试'
    
    // 提供更具体的错误信息
    if (error.message.includes('Invalid login')) {
      errorMessage = 'SMTP认证失败，请检查邮箱和密码配置'
    } else if (error.message.includes('Connection timeout')) {
      errorMessage = '连接SMTP服务器超时，请检查网络连接'
    } else if (error.message.includes('SMTP configuration')) {
      errorMessage = 'SMTP服务器配置错误'
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  })
})

// 错误处理中间件
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: '文件大小超过限制' 
      })
    }
  }
  
  res.status(500).json({ 
    success: false, 
    message: error.message || '服务器内部错误' 
  })
})

app.listen(PORT, () => {
  console.log(`邮件服务运行在端口 ${PORT}`)
})

module.exports = app