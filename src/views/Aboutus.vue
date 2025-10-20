<template>
  <div class="min-h-screen bg-[lightsteelblue] py-8">
    <div class="max-w-4xl mx-auto px-4 pt-[70px]">
      <!-- Page title -->
      <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          The health and nutrition education platform is committed to providing professional nutrition education resources and healthy living guidance
        </p>
      </div>

      <!-- Contact Form -->
      <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">Contact us</h2>
        
        <form @submit.prevent="sendEmail" class="space-y-6">
          <!-- Name-->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <InputText
              id="name"
              v-model="formData.name"
              placeholder="Please enter your name"
              class="w-full"
              required
            />
          </div>

          <!-- Theme-->
          <div>
            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <InputText
              id="subject"
              v-model="formData.subject"
              placeholder="Please enter the email subject"
              class="w-full"
              required
            />
          </div>

          <!-- Message-->
          <div>
            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <Textarea
              id="message"
              v-model="formData.message"
              placeholder="Please enter your message..."
              rows="5"
              class="w-full"
              required
            />
          </div>

          <!-- Attachment-->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Accessories (optional)</label>
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
              <span v-else class="text-sm text-gray-500">No file selected</span>
            </div>
            <p class="text-xs text-gray-500 mt-1">Supports PDF, Word, and image files, up to 10MB</p>
          </div>

          <!-- Submit Buttons-->
          <div class="flex justify-end gap-4">
            <Button
              type="button"
              label="Reset"
              severity="secondary"
              @click="resetForm"
              class="p-button-outlined"
            />
            <Button
              type="submit"
              label="Send email"
              icon="pi pi-send"
              :loading="isSending"
              :disabled="isSending"
            />
          </div>
        </form>
      </div>

    
    </div>

    <!-- Toast Notification -->
    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
// import {sendEmailWithAttachment} from './send'
const toast = useToast()

// Form data
const formData = ref({
  name: '',
  subject: '',
  message: '',
  attachment: null
})

const fileInput = ref(null)
const isSending = ref(false)

// Handle file uploads
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Check file size
    if (file.size > 10 * 1024 * 1024) {
      toast.add({
        severity: 'error',
        summary: 'File too large',
        detail: 'The file size cannot exceed 10MB',
        life: 3000
      })
      return
    }
    
    // Check file type
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
        summary: 'File type not supported',
        detail: 'Please upload a PDF, Word or image file',
        life: 3000
      })
      return
    }
    
    formData.value.attachment = file
  }
}

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Send email
const sendEmail = async () => {

  // sendEmailWithAttachment();

  if (isSending.value) return
  
  isSending.value = true
  
  try {
    // Constructing a FormData object
    const formDataToSend = new FormData()
    formDataToSend.append('name', formData.value.name)
    formDataToSend.append('email', formData.value.email)
    formDataToSend.append('subject', formData.value.subject)
    formDataToSend.append('message', formData.value.message)
    
    // Append attachment if exists
    if (formData.value.attachment) {
      formDataToSend.append('attachment', formData.value.attachment)
    }
    
    // Send POST request to backend API
    const apiUrl = import.meta.env.VITE_EMAIL_API_URL || 'http://localhost:3001/api/send-email'
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formDataToSend
    })
    
    if (response.ok) {
      toast.add({
        severity: 'success',
        summary: 'Sent successfully',
        detail: 'Your email has been sent successfully. We will reply to you as soon as possible!',
        life: 5000
      })
      resetForm()
    } else {
      throw new Error('Sending failed')
    }
  } catch (error) {
    console.error('Sending failed:', error)
    toast.add({
      severity: 'error',
      summary: 'Sending failed',
      detail: 'Email sending failed, please try again later or contact us directly',
      life: 5000
    })
  } finally {
    isSending.value = false
  }
}

// Reset form
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