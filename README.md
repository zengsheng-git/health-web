## 🛠️ Project Structure

```
health-web/
├── public/            # Static assets
│ ├── img/             # Image assets
│ └── json/            # JSON data files
├── src/
│ ├── assets/          # Stylesheet assets
│ ├── common/          # Common tools and configuration
│ ├── components/      # Common components
│ ├── plugins/         # Vue plugin configuration
│ ├── router/          # Routing configuration
│ └── views/           # Page components
│ ├── admin/           # Administration pages
│ └── auth/            # Authentication related pages
```

## 🚀 Quick Start

### Environment Requirements
- Node.js 16+
- pnpm 7+

### Installation Dependencies
```sh
pnpm install
```

### Development Environment
```sh
pnpm dev
```

### Production Build
```sh
pnpm build
```

### Code Verification
```sh
pnpm lint
```

## 📧 Email Sending Configuration

### Starting the Email Service
The email sending function requires starting the backend service separately:

```sh
# Navigate to the server directory
cd server

# Install Dependencies
npm install

# Start the email service (requires environment variables)
npm start

# Start Development Mode (auto-restart)
npm run dev
```

## 🔧 Environment Configuration

This project uses environment variables for configuration. Create a `.env` file and configure the following variables:

### Front-end environment variables
```env
VITE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_PROJECT_ID=your_firebase_project_id
VITE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_MESSAGING_SENDER_ID=your_firebase_sender_id
VITE_APP_ID=your_firebase_app_id
VITE_MapboxglAccessToken=your_mapbox_access_token
VITE_EMAIL_API_URL=http://localhost:3001/api/send-email
```

### Mail Service Environment Variables (Backend)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=contact@health-education.com
```