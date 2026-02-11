<template>
  <div class="max-w-4xl mx-auto">
    <div class="card">
      <h1 class="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <div class="prose prose-blue max-w-none">
        <p class="text-gray-600 mb-4"><strong>Effective Date:</strong> February 4, 2026</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">1. Acceptance of Terms</h2>
        <p class="mb-4">By using FileDuck, you agree to these Terms of Service. If you do not agree, do not use our service.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">2. Permitted Use</h2>
        <p class="mb-4">FileDuck may be used for:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Sharing legal, non-malicious files</li>
          <li>Personal and business file transfers</li>
          <li>Temporary file storage (up to 7 days)</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">3. Prohibited Content</h2>
        <p class="mb-4">You may NOT upload:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Malware, viruses, or malicious code</li>
          <li>Copyrighted content without permission</li>
          <li>Illegal content (child abuse material, terrorism, etc.)</li>
          <li>Content that violates privacy or intellectual property rights</li>
          <li>Spam or phishing materials</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">4. Service Limitations</h2>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Maximum file size: 500 GB (with multipart chunking)</li>
          <li>Maximum retention: 7 days</li>
          <li>Rate limits apply to prevent abuse</li>
          <li>Files may be scanned and deleted if malicious</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">5. No Warranties</h2>
        <p class="mb-4">FileDuck is provided "AS IS" without warranties of any kind. We do not guarantee:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>100% uptime or availability</li>
          <li>Permanent file storage</li>
          <li>Detection of all malware</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">6. Liability</h2>
        <p class="mb-4">FileDuck is not liable for:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Lost or corrupted files</li>
          <li>Damages from malware that evaded scanning</li>
          <li>Unauthorized access to shared files</li>
          <li>Service downtime or interruptions</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">7. User Responsibilities</h2>
        <p class="mb-4">You are responsible for:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Verifying file checksums after download</li>
          <li>Keeping share codes confidential</li>
          <li>Scanning downloaded files with your own antivirus</li>
          <li>Managing your browser's local storage and cache</li>
          <li>Backing up important files (we are a temporary sharing service)</li>
          <li>Complying with applicable laws</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">8. Local Data Storage</h2>
        <p class="mb-4">FileDuck stores your upload history locally in your browser using:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li><strong>LocalStorage:</strong> For backward compatibility and quick access</li>
          <li><strong>IndexedDB:</strong> For persistent, structured storage that survives cache clearing</li>
        </ul>
        <p class="mb-4">This data never leaves your device. You can clear it anytime from the History page or browser settings.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">9. Advertising</h2>
        <p class="mb-4">FileDuck displays advertisements through Google AdSense to support the free service. By using FileDuck, you consent to viewing ads.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">10. Termination</h2>
        <p class="mb-4">We reserve the right to:</p>
        <ul class="list-disc pl-6 mb-4 space-y-2">
          <li>Remove content that violates these terms</li>
          <li>Ban users who abuse the service</li>
          <li>Suspend or terminate the service at any time</li>
        </ul>

        <h2 class="text-2xl font-bold mt-6 mb-4">11. Changes to Terms</h2>
        <p class="mb-4">We may update these terms at any time. Continued use constitutes acceptance of updated terms.</p>

        <h2 class="text-2xl font-bold mt-6 mb-4">12. Contact</h2>
        <p class="mb-4">For questions about these terms, contact: <a href="mailto:legal@fileduck.app" class="text-blue-600 hover:underline">legal@fileduck.app</a></p>
      </div>
    </div>

    <div class="mt-6 text-center">
      <router-link to="/" class="text-blue-600 hover:underline">← Back to Home</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// Terms of Service page
</script>
