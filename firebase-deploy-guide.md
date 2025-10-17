<!--
 * @Author: zengsheng 12181283
 * @Date: 2025-10-17 17:43:28
 * @LastEditors: zengsheng 12181283
 * @LastEditTime: 2025-10-17 17:43:34
 * @FilePath: \health-web\firebase-deploy-guide.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# Firebase Functions 部署指南

## 1. 安装 Firebase CLI
```bash
npm install -g firebase-tools
```

## 2. 登录 Firebase
```bash
firebase login
```

## 3. 初始化 Firebase 项目
```bash
firebase init functions
```
选择现有项目或创建新项目。

## 4. 配置邮箱密码
```bash
firebase functions:config:set email.password="your-qq-email-app-password"
```

## 5. 安装依赖
```bash
cd functions
npm install
```

## 6. 本地测试
```bash
firebase emulators:start
```

## 7. 部署到 Firebase
```bash
firebase deploy --only functions
```

## 8. 更新前端代码
部署后，获取实际的函数URL并更新 `src/views/Aboutus.vue` 中的 `functionUrl`：
```javascript
const functionUrl = 'https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/sendContactEmail'
```

## 配置QQ邮箱SMTP
1. 登录QQ邮箱 → 设置 → 账户
2. 开启POP3/SMTP服务
3. 获取授权码（16位字符）
4. 使用授权码作为 `email.password`

## 优势
- **无需服务器维护**：Firebase自动管理服务器
- **自动扩展**：根据流量自动调整资源
- **安全可靠**：Google基础设施保障
- **免费额度**：每月有免费使用额度

部署完成后，邮件发送功能将通过Firebase云函数自动处理。