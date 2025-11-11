# Email Troubleshooting Guide

## Why emails work on localhost but not on server?

This is almost always due to **missing environment variables** on your production server.

## Quick Diagnostic

Visit this endpoint on your production server to check email configuration:
```
https://your-backend-url.com/api/email/check
```

This will show you:
- ✅ If `ZEPTOMAIL_API_KEY` is set
- ✅ If `ZEPTOMAIL_FROM_EMAIL` is set
- ✅ If `ZEPTOMAIL_TO_EMAIL` is set
- ✅ Current SMTP configuration

## Common Issues & Solutions

### 1. ❌ Missing ZEPTOMAIL_API_KEY

**Symptom:** Emails silently fail, no error in logs (old behavior) or clear error message (new behavior)

**Solution:**
1. Go to your hosting platform (Railway, Render, Vercel, etc.)
2. Navigate to Environment Variables
3. Add: `ZEPTOMAIL_API_KEY` = `your_zeptomail_api_key`
4. Restart your server

**How to get ZeptoMail API Key:**
1. Sign up at [ZeptoMail](https://www.zeptomail.com/)
2. Go to Settings → API Keys
3. Create a new API key
4. Copy and paste it as `ZEPTOMAIL_API_KEY`

---

### 2. ⚠️ Missing ZEPTOMAIL_FROM_EMAIL

**Symptom:** Emails might be sent but could be rejected or marked as spam

**Solution:**
1. In ZeptoMail dashboard, verify your domain
2. Set `ZEPTOMAIL_FROM_EMAIL` = `your_verified_email@yourdomain.com`
   OR
3. Set `ZEPTOMAIL_BOUNCE_ADDRESS` = `your_bounce_address@yourdomain.com`

**Note:** If not set, it defaults to `no-reply@yatindia.com` which might not work if the domain isn't verified.

---

### 3. 🔍 Check Server Logs

After deploying, check your server logs for:
- `✅ ZeptoMail transporter configured successfully` - Good!
- `❌ ZeptoMail API key (ZEPTOMAIL_API_KEY) not configured` - Missing API key
- `❌ Error sending email: ...` - Other issues (see error details)

---

### 4. 🌐 Network/Firewall Issues

Some hosting platforms block SMTP ports. If you see connection errors:

**Try port 465 (SSL):**
```env
ZEPTOMAIL_SMTP_PORT=465
```

**Or port 587 (TLS):**
```env
ZEPTOMAIL_SMTP_PORT=587
```

---

### 5. 🔐 Environment Variables Not Loading

**Railway/Render/Vercel:**
- Make sure variables are set in the dashboard
- Restart the service after adding variables
- Check for typos in variable names

**VPS/PM2:**
- Check your `.env` file exists
- Verify `dotenv` is loading it: `console.log(process.env.ZEPTOMAIL_API_KEY)`
- Restart PM2: `pm2 restart yatindia-backend`

---

## Step-by-Step Fix

1. **Check current config:**
   ```
   GET https://your-backend-url.com/api/email/check
   ```

2. **If ZEPTOMAIL_API_KEY is missing:**
   - Get API key from ZeptoMail dashboard
   - Add to your hosting platform's environment variables
   - Restart server

3. **Verify in logs:**
   - Look for: `✅ ZeptoMail transporter configured successfully`
   - Should show: `From Email: ...` and `SMTP Port: ...`

4. **Test email:**
   - Submit a test form
   - Check logs for: `✅ Contact email sent successfully to: ...`
   - Check your inbox

---

## Environment Variables Checklist

Make sure ALL of these are set on your production server:

```env
# REQUIRED
ZEPTOMAIL_API_KEY=your_api_key_here

# RECOMMENDED
ZEPTOMAIL_FROM_EMAIL=your_verified_email@yourdomain.com
ZEPTOMAIL_BOUNCE_ADDRESS=your_bounce_address@yourdomain.com

# OPTIONAL (has defaults)
ZEPTOMAIL_TO_EMAIL=diya.p.shiju@gmail.com
ZEPTOMAIL_SMTP_PORT=587
```

---

## Still Not Working?

1. **Check server logs** - Look for error messages
2. **Test the diagnostic endpoint** - `/api/email/check`
3. **Verify ZeptoMail account** - Make sure it's active and has credits
4. **Check spam folder** - Emails might be going there
5. **Test with a simple email** - Use ZeptoMail's test feature in their dashboard

---

## Debug Mode

To see more detailed logs, the code now logs:
- Full error objects
- Error codes
- SMTP command failures
- ZeptoMail API responses

Check your server logs for these details when emails fail.

