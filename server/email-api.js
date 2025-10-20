const express = require('express')
const multer = require('multer')
const nodemailer = require('nodemailer')
const cors = require('cors')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware configuration
app.use(cors())
app.use(express.json())

// File upload configuration
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
    fileSize: 10 * 1024 * 1024 // 10MB
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
      cb(new Error('Unsupported file types'), false)
    }
  }
})

// Creating a Mail Transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      // user: '1218128305@qq.com',
      // pass: 'opsokizeoixxjiie'

      user: '821552297@qq.com',
      pass: 'iqcnyathlecnbeif'
    }
  })
}

// Email sending endpoint
app.post('/api/send-email', upload.single('attachment'), async (req, res) => {
  try {
    const { name, subject, message } = req.body
    
    if (!name || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please fill in all required fields' 
      })
    }

    const transporter = createTransporter()
  
    const mailOptions = {
      // from: '1218128305@qq.com',
      // to: 'zengsheng0870@dingtalk.com',

      from: '821552297@qq.com',
      to: 'x0165392@gmail.com',
      subject: `${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Theme:</strong> ${subject}</p>
            <p><strong>Message content:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `
    }

    // Add attachments (if any)
    if (req.file) {
      mailOptions.attachments = [{
        filename: req.file.originalname,
        path: req.file.path
      }]
    }

    // Send the email
    await transporter.sendMail(mailOptions)

    // Clean uploaded files
    if (req.file) {
      fs.unlinkSync(req.file.path)
    }

    res.json({ 
      success: true, 
      message: 'Email sent successfully' 
    })

  } catch (error) {
    console.error('Email sending error:', error)
    
    // Clean uploaded files in case of error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path)
    }
    
    let errorMessage = 'Email sending failed, please try again later'
    
    // Custom error messages based on error type
    if (error.message.includes('Invalid login')) {
      errorMessage = 'SMTP authentication failed, please check your email and password configuration'
    } else if (error.message.includes('Connection timeout')) {
      errorMessage = 'Connection to SMTP server timed out, please check network connection'
    } else if (error.message.includes('SMTP configuration')) {
      errorMessage = 'SMTP server configuration error'
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString() 
  })
})

// Global error handler
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        success: false, 
        message: 'File size exceeds limit'
      })
    }
  }
  
  res.status(500).json({ 
    success: false, 
    message: error.message || 'Server internal error'
  })
})

app.listen(PORT, () => {
  console.log(`Mail server running on port ${PORT}`)
})

module.exports = app