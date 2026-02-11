import axios from 'axios';

/**
 * Verify Cloudflare Turnstile token
 * @param token - The Turnstile token from the client
 * @returns true if valid, false otherwise
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('⚠️ TURNSTILE_SECRET_KEY not configured');
    return true; // Allow in development if not configured
  }

  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: secretKey,
        response: token,
      }
    );

    if (response.data.success) {
      console.log('✓ Turnstile verified successfully');
      return true;
    } else {
      console.warn('❌ Turnstile verification failed:', response.data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('❌ Turnstile verification error:', error);
    return false;
  }
}

/**
 * Verify Google reCAPTCHA token (legacy support)
 * @param token - The reCAPTCHA token from the client
 * @returns true if valid, false otherwise
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  
  if (!secretKey) {
    console.warn('⚠️ RECAPTCHA_SECRET_KEY not configured');
    return true; // Allow in development if not configured
  }

  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: secretKey,
          response: token,
        },
      }
    );

    if (response.data.success) {
      console.log('✓ reCAPTCHA verified successfully');
      return true;
    } else {
      console.warn('❌ reCAPTCHA verification failed:', response.data['error-codes']);
      return false;
    }
  } catch (error) {
    console.error('❌ reCAPTCHA verification error:', error);
    return false;
  }
}

/**
 * Verify captcha token - automatically detects Turnstile or reCAPTCHA
 * @param token - The captcha token from the client
 * @returns true if valid, false otherwise
 */
export async function verifyCaptcha(token: string): Promise<boolean> {
  // Prefer Turnstile if configured, fallback to reCAPTCHA
  if (process.env.TURNSTILE_SECRET_KEY) {
    return verifyTurnstile(token);
  } else if (process.env.RECAPTCHA_SECRET_KEY) {
    return verifyRecaptcha(token);
  }
  
  console.warn('⚠️ No captcha service configured');
  return true; // Allow in development
}

export default verifyCaptcha;
