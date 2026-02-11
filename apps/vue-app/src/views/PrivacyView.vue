<template>
  <div class="max-w-4xl mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div class="prose prose-blue max-w-none">
        <p class="text-gray-600 mb-4"><strong>Effective Date:</strong> February 4, 2026</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">1. Information We Collect</h2>
        <p class="mb-4">FileDuck collects minimal information necessary to provide our file sharing service:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>File metadata (filename, size, type)</li>
          <li>SHA-256 checksums for file integrity</li>
          <li>Temporary share codes (automatically deleted after expiration)</li>
          <li>IP addresses for rate limiting and abuse prevention</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">2. How We Use Your Information</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Malware scanning to protect users</li>
          <li>Rate limiting to prevent abuse</li>
          <li>Analytics to improve service quality</li>
          <li>CAPTCHA verification when necessary</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">3. Third-Party Services</h2>
        <p class="mb-4">We use the following third-party services:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Google AdSense:</strong> For advertising. See <a href="https://policies.google.com/privacy" class="text-blue-600 hover:underline" target="_blank" rel="noopener">Google's Privacy Policy</a></li>
          <li><strong>Google reCAPTCHA:</strong> For bot protection</li>
          <li><strong>VirusTotal:</strong> For malware scanning</li>
          <li><strong>Cloudflare:</strong> For CDN and DDoS protection</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">4. Local Storage and Cookies</h2>
        <p class="mb-4">We use browser storage technologies:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>LocalStorage & IndexedDB:</strong> To store your upload history locally on your device (no server storage, completely private)</li>
          <li><strong>Service Workers:</strong> To enable offline access and faster loading</li>
          <li><strong>Cookies:</strong> For session management and Google AdSense advertising</li>
          <li><strong>Cache Storage:</strong> To store static assets for offline functionality</li>
        </ul>
        <p class="mb-4">All local data stays on your device and is never transmitted to our servers. You can clear it anytime through your browser settings or our app's history page.</p>
        <p class="mb-4">Google AdSense: See <a href="https://policies.google.com/technologies/cookies" class="text-blue-600 hover:underline" target="_blank" rel="noopener">Google's Cookie Policy</a>.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">5. Data Retention</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Files: Deleted after expiration (1 hour to 7 days)</li>
          <li>Metadata: Deleted immediately after file deletion</li>
          <li>Share codes: One-time use or expires with file</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">6. Security</h2>
        <p class="mb-4">We implement industry-standard security measures:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>HTTPS encryption for all connections</li>
          <li>Multi-engine malware scanning</li>
          <li>Optional client-side encryption</li>
          <li>Secure, signed CDN URLs</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">7. Your Rights</h2>
        <p class="mb-4">You have the right to:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Request deletion of your files at any time</li>
          <li>Clear your local upload history from our History page</li>
          <li>Disable persistent storage through browser settings</li>
          <li>Opt-out of personalized advertising</li>
          <li>Request information about data we've collected</li>
          <li>Use the service without creating an account (no personal data collection)</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">8. Children's Privacy</h2>
        <p class="mb-4">FileDuck is not intended for users under 13 years of age. We do not knowingly collect personal information from children.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">9. Changes to This Policy</h2>
        <p class="mb-4">We may update this policy periodically. The effective date will be updated accordingly.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">10. Contact Us</h2>
        <p class="mb-4">For privacy-related questions, contact us at: <a href="mailto:privacy@fileduck.app" class="text-blue-600 hover:underline">privacy@fileduck.app</a></p>
      </div>
    </div>

    <div class="mt-6 text-center">
      <router-link to="/" class="text-blue-600 hover:underline">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Privacy Policy page
</script>
