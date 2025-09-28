# Video Call Invitation Website

A beautiful, modern website for video call invitations with phone verification via Telegram bot integration.

## Features

- Modern, responsive design with glass-morphism effects
- Multi-step form with phone number and country inputs
- Code verification system
- Telegram bot integration for approval/rejection
- Smooth animations and transitions
- Mobile-optimized interface

## Vercel Deployment Guide

### Step 1: Prepare Your Project

1. Make sure all files are in your project directory
2. Install dependencies: `npm install`
3. Test locally: `npm run dev`

### Step 2: Set Up Telegram Bot

1. Create a new Telegram bot:
   - Message @BotFather on Telegram
   - Use `/newbot` command
   - Follow instructions to create your bot
   - Save the bot token

2. Get your chat ID:
   - Start a conversation with your bot
   - Send any message to your bot
   - Visit: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Look for "chat":{"id": YOUR_CHAT_ID in the response

### Step 3: Deploy to Vercel

#### Option 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy from your project directory:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Found project? **Y**
   - In which directory? **./src** (or just press enter)
   - Want to modify settings? **N**

5. Set environment variables:
   ```bash
   vercel env add TELEGRAM_BOT_TOKEN
   vercel env add TELEGRAM_CHAT_ID
   ```
   Enter your bot token and chat ID when prompted.

6. Redeploy with environment variables:
   ```bash
   vercel --prod
   ```

#### Option 2: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository (push your code to GitHub first)
4. Configure project:
   - Framework Preset: **Vite**
   - Root Directory: **./src**
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. Add Environment Variables in project settings:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_CHAT_ID`: Your Telegram chat ID

6. Deploy

### Step 4: Configure Your Bot

After deployment, you need to set up your Telegram bot to handle the approval/rejection workflow:

1. **Manual Approval**: When a verification code is submitted, you'll receive a message in Telegram. You need to implement a way to respond with approval/rejection.

2. **Automatic Approval**: Modify the `api/verify-code.js` file to implement your verification logic.

### Step 5: Update Background Image

To use your own background image:

1. Replace the Pexels URL in `src/App.tsx` line 58:
   ```typescript
   backgroundImage: 'url("YOUR_IMAGE_URL_HERE")'
   ```

2. Or upload your image to the `public` folder and reference it:
   ```typescript
   backgroundImage: 'url("/your-image.jpg")'
   ```

## Environment Variables

- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token from BotFather
- `TELEGRAM_CHAT_ID`: Your Telegram chat ID where you want to receive messages

## Important Notes

- The current verification system is a demo. You need to implement proper bot response handling.
- Make sure your image URLs are HTTPS for production.
- Test thoroughly before going live.
- Consider implementing rate limiting for production use.

## Support

If you encounter any issues during deployment, check:
1. Environment variables are set correctly
2. Bot token and chat ID are valid
3. Telegram bot is active and can send messages
4. Vercel function logs in the dashboard