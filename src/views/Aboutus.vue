<!--
 * @Author: zengsheng 12181283
 * @Date: 2025-10-17 15:33:48
 * @LastEditors: zengsheng 12181283
 * @LastEditTime: 2025-10-17 16:32:01
 * @FilePath: \health-web\src\views\Aboutus.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">关于我们</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          健康营养教育平台致力于提供专业的营养教育资源和健康生活指导
        </p>
      </div>

      <!-- 联系我们表单 -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">联系我们</h2>
        
        <form @submit.prevent="sendEmail" class="space-y-6">
          <!-- 基本信息 -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">姓名</label>
            <InputText
              id="name"
              v-model="formData.name"
              placeholder="请输入您的姓名"
              class="w-full"
              required
            />
          </div>

          <!-- 主题 -->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">主题</label>
            <InputText
              id="subject"
              v-model="formData.subject"
              placeholder="请输入邮件主题"
              class="w-full"
              required
            />
          </div>

          <!-- 消息内容 -->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">消息内容</label>
            <Textarea
              id="message"
              v-model="formData.message"
              placeholder="请输入您想说的话..."
              rows="5"
              class="w-full"
              required
            />
          </div>

          <!-- 附件上传 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">附件（可选）</label>
            <div class="flex items-center gap-4">
              <input
                type="file"
                ref="fileInput"
                @change="handleFileUpload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                class="hidden"
              />
              <Button
                type="button"
                label="选择文件"
                icon="pi pi-paperclip"
                @click="$refs.fileInput.click()"
                class="p-button-outlined"
              />
              <span v-if="formData.attachment" class="text-sm text-gray-600">
                {{ formData.attachment.name }} ({{ formatFileSize(formData.attachment.size) }})
              </span>
              <span v-else class="text-sm text-gray-500">未选择文件</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">支持 PDF、Word、图片文件，最大 10MB</p>
          </div>

          <!-- 提交按钮 -->
          <div class="flex justify-end gap-4">
            <Button
              type="button"
              label="重置"
              severity="secondary"
              @click="resetForm"
              class="p-button-outlined"
            />
            <Button
              type="submit"
              label="发送邮件"
              icon="pi pi-send"
              :loading="isSending"
              :disabled="isSending"
            />
          </div>
        </form>
      </div>

    
    </div>

    <!-- 成功提示 -->
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
// import {sendEmailWithAttachment} from './send'
const toast = useToast()

// 表单数据
const formData = ref({
  name: '',
  subject: '',
  message: '',
  attachment: null
})

const fileInput = ref(null)
const isSending = ref(false)

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 检查文件大小（10MB限制）
    if (file.size > 10 * 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: '文件过大',
        detail: '文件大小不能超过10MB',
        life: 3000
      })
      return
    }
    
    // 检查文件类型
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      toast.add({
        severity: 'error',
        summary: '文件类型不支持',
        detail: '请上传PDF、Word或图片文件',
        life: 3000
      })
      return
    }
    
    formData.value.attachment = file
  }
}

// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 发送邮件
const sendEmail = async () => {

  // sendEmailWithAttachment();

  if (isSending.value) return
  
  isSending.value = true
  
  try {
    // 创建FormData对象
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('email', formData.value.email)
    formDataToSend.append('subject', formData.value.subject)
    formDataToSend.append('message', formData.value.message)
    
    // 如果有附件，添加到FormData
    if (formData.value.attachment) {
      formDataToSend.append('attachment', formData.value.attachment)
    }
    
    // 发送邮件请求 - 使用环境变量配置的API地址
    const apiUrl = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/send-email'
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formDataToSend
    })
    
    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: '发送成功',
        detail: '邮件已成功发送，我们会尽快回复您！',
        life: 5000
      })
      resetForm()
    } else {
      throw new Error('发送失败')
    }
  } catch (error) {
    console.error('发送邮件失败:', error)
    toast.add({
      severity: 'error',
      summary: '发送失败',
      detail: '邮件发送失败，请稍后重试或直接联系我们',
      life: 5000
    })
  } finally {
    isSending.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    subject: '',
    message: '',
    attachment: null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.min-h-screen {
  min-height: calc(100vh - 60px);
}
</style>