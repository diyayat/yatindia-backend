import axios from 'axios';

// Verify Cloudflare Turnstile token
export const verifyCaptcha = async (token) => {
  if (!token) {
    throw new Error('CAPTCHA token is required');
  }

  const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('CLOUDFLARE_TURNSTILE_SECRET_KEY not set, skipping CAPTCHA verification');
    return true; // In development, allow if secret key is not set
  }

  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: secretKey,
        response: token,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('CAPTCHA verification response:', {
      success: response.data.success,
      errors: response.data['error-codes'],
    });

    if (response.data.success) {
      return true;
    } else {
      const errors = response.data['error-codes'] || [];
      console.error('CAPTCHA verification failed. Error codes:', errors);
      throw new Error(`CAPTCHA verification failed: ${errors.join(', ')}`);
    }
  } catch (error) {
    if (error.response) {
      console.error('CAPTCHA API error:', error.response.data);
    } else {
      console.error('CAPTCHA verification error:', error.message);
    }
    throw new Error('CAPTCHA verification failed. Please try again.');
  }
};

// Middleware to verify CAPTCHA
export const captchaMiddleware = async (req, res, next) => {
  try {
    // For FormData (file uploads), the token might be a string
    // For JSON requests, it's in req.body
    const token = req.body.captchaToken || req.body['cf-turnstile-response'];
    
    console.log('CAPTCHA middleware - received token:', token ? 'Token present' : 'Token missing');
    console.log('Request body keys:', Object.keys(req.body));
    
    if (!token) {
      console.error('CAPTCHA token is missing from request');
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA token is required',
      });
    }

    await verifyCaptcha(token);
    next();
  } catch (error) {
    console.error('CAPTCHA middleware error:', error.message);
    return res.status(400).json({
      success: false,
      message: error.message || 'CAPTCHA verification failed',
    });
  }
};

