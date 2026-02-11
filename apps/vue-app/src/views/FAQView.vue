<template>
  <div class="min-h-screen bg-cream-50 py-12 px-4">
    <div class="container mx-auto max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-block p-4 bg-purple-100 rounded-full mb-4">
          <HelpCircleIcon class="w-16 h-16 text-purple-600" />
        </div>
        <h1 class="text-5xl font-bold mb-4 text-indigo-950 font-display tracking-tight leading-tight">
          Frequently Asked Questions
        </h1>
        <p class="text-xl text-gray-600">Find answers to common questions about FileDuck</p>
      </div>

      <!-- Quick Links -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-200">
        <h2 class="text-xl font-bold text-purple-600 mb-4">Quick Topics</h2>
        <div class="grid md:grid-cols-2 gap-3">
          <a href="#general" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>General Questions</span>
          </a>
          <a href="#uploading" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Uploading & Sharing</span>
          </a>
          <a href="#downloading" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Downloading Files</span>
          </a>
          <a href="#security" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Security & Privacy</span>
          </a>
          <a href="#limits" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Limits & Storage</span>
          </a>
          <a href="#troubleshooting" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Troubleshooting</span>
          </a>
        </div>
      </div>

      <!-- About FAQ -->
      <section class="bg-purple-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-300 scroll-mt-20">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-bold text-purple-600 mb-6">
              Get Your Questions Answered
            </h2>
            <p class="text-gray-700 text-lg mb-4">
              We've compiled the most frequently asked questions about FileDuck to help you get the most out of our platform.
              From basic usage to advanced security features, find clear answers to common concerns.
            </p>
            <p class="text-gray-700 mb-4">
              Can't find what you're looking for? Check our comprehensive documentation or reach out to our support team
              at support@fileduck.com for personalized assistance.
            </p>
            <div class="flex flex-wrap gap-3 mt-6">
              <span class="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">Quick Answers</span>
              <span class="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">Easy to Find</span>
              <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">Always Updated</span>
              <span class="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">Helpful</span>
            </div>
          </div>
          <div class="flex justify-center">
            <img src="/faq.svg" alt="FAQ - Frequently Asked Questions" class="rounded-2xl shadow-2xl max-w-full h-auto border-4 border-white" />
          </div>
        </div>
      </section>

      <!-- General Questions -->
      <section id="general" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-purple-600 mb-6 flex items-center">
          <InfoIcon class="w-8 h-8 mr-3" />
          General Questions
        </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-purple-400 pl-6 py-3 bg-purple-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-purple-600 mr-2">Q:</span> What is FileDuck?
            </h3>
            <p class="text-gray-700 ml-6">
              FileDuck is a secure, fast, and private file-sharing platform that allows you to upload files up to 500GB
              and share them with anyone using a simple code. No account required!
            </p>
          </div>

          <div class="border-l-4 border-purple-400 pl-6 py-3 bg-purple-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-purple-600 mr-2">Q:</span> Do I need to create an account?
            </h3>
            <p class="text-gray-700 ml-6">
              No! FileDuck works without registration. Just visit the site, upload your file, and share the code.
              It's that simple.
            </p>
          </div>

          <div class="border-l-4 border-purple-400 pl-6 py-3 bg-purple-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-purple-600 mr-2">Q:</span> Is FileDuck free to use?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes! FileDuck is completely free to use. You can upload and share files without any cost.
            </p>
          </div>

          <div class="border-l-4 border-purple-400 pl-6 py-3 bg-purple-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-purple-600 mr-2">Q:</span> What browsers are supported?
            </h3>
            <p class="text-gray-700 ml-6">
              FileDuck works on all modern browsers including Chrome, Firefox, Safari, and Edge.
              Mobile browsers are also fully supported.
            </p>
          </div>
        </div>
      </section>

      <!-- Uploading & Sharing -->
      <section id="uploading" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-green-600 mb-6 flex items-center">
          <UploadIcon class="w-8 h-8 mr-3" />
          Uploading & Sharing
        </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-green-400 pl-6 py-3 bg-green-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-green-600 mr-2">Q:</span> What's the maximum file size I can upload?
            </h3>
            <p class="text-gray-700 ml-6">
              You can upload files up to 500GB! However, malware scanning is only available for files under 100MB.
            </p>
          </div>

          <div class="border-l-4 border-green-400 pl-6 py-3 bg-green-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-green-600 mr-2">Q:</span> What file types can I upload?
            </h3>
            <p class="text-gray-700 ml-6">
              All file types are supported! Upload documents, images, videos, archives, executables, or any other file format.
            </p>
          </div>

          <div class="border-l-4 border-green-400 pl-6 py-3 bg-green-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-green-600 mr-2">Q:</span> How do I share my uploaded file?
            </h3>
            <p class="text-gray-700 ml-6">
              After uploading, you'll receive a 6-character share code and a 4-digit verification code.
              Share these with your recipient, or use the provided download link or QR code.
            </p>
          </div>

          <div class="border-l-4 border-green-400 pl-6 py-3 bg-green-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-green-600 mr-2">Q:</span> Can I pause and resume large uploads?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes! For large files, FileDuck supports pause and resume functionality.
              If your upload is interrupted, you can continue from where you left off.
            </p>
          </div>

          <div class="border-l-4 border-green-400 pl-6 py-3 bg-green-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-green-600 mr-2">Q:</span> Can I upload multiple files at once?
            </h3>
            <p class="text-gray-700 ml-6">
              Currently, FileDuck supports uploading one file at a time. For multiple files,
              consider creating a ZIP archive or uploading them separately.
            </p>
          </div>
        </div>
      </section>

      <!-- Downloading Files -->
      <section id="downloading" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-blue-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-blue-600 mb-6 flex items-center">
          <DownloadIcon class="w-8 h-8 mr-3" />
          Downloading Files
        </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-blue-400 pl-6 py-3 bg-blue-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-blue-600 mr-2">Q:</span> How do I download a file?
            </h3>
            <p class="text-gray-700 ml-6">
              Navigate to the Download page, enter the 6-character share code and the 4-digit verification code,
              then click the download button.
            </p>
          </div>

          <div class="border-l-4 border-blue-400 pl-6 py-3 bg-blue-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-blue-600 mr-2">Q:</span> Can I resume interrupted downloads?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes! FileDuck supports resume capability for interrupted downloads.
              Simply return to the download page and start the download again.
            </p>
          </div>

          <div class="border-l-4 border-blue-400 pl-6 py-3 bg-blue-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-blue-600 mr-2">Q:</span> Where is the downloaded file saved?
            </h3>
            <p class="text-gray-700 ml-6">
              Downloads are automatically saved to your browser's default download folder.
              On mobile devices, you may be prompted to choose a save location.
            </p>
          </div>

          <div class="border-l-4 border-blue-400 pl-6 py-3 bg-blue-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-blue-600 mr-2">Q:</span> Can I download the same file multiple times?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes, you can download a file multiple times until it reaches the download limit (default: 10 downloads)
              or expires after 24 hours.
            </p>
          </div>
        </div>
      </section>

      <!-- Security & Privacy -->
      <section id="security" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-red-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-red-600 mb-6 flex items-center">
          <ShieldCheckIcon class="w-8 h-8 mr-3" />
          Security & Privacy
        </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-red-400 pl-6 py-3 bg-red-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-red-600 mr-2">Q:</span> Is my data secure?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes! All file transfers use end-to-end encryption. Files are encrypted during transit and at rest.
              Additionally, files under 100MB are scanned for malware using VirusTotal.
            </p>
          </div>

          <div class="border-l-4 border-red-400 pl-6 py-3 bg-red-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-red-600 mr-2">Q:</span> What is malware scanning?
            </h3>
            <p class="text-gray-700 ml-6">
              Files under 100MB are automatically scanned using VirusTotal's AI-powered detection,
              which checks against 70+ antivirus engines to ensure your file is safe.
            </p>
          </div>

          <div class="border-l-4 border-red-400 pl-6 py-3 bg-red-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-red-600 mr-2">Q:</span> Can others access my files without the codes?
            </h3>
            <p class="text-gray-700 ml-6">
              No. Files require both the share code and verification code to access.
              Without these codes, your files remain completely secure.
            </p>
          </div>

          <div class="border-l-4 border-red-400 pl-6 py-3 bg-red-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-red-600 mr-2">Q:</span> What are SHA-256 checksums?
            </h3>
            <p class="text-gray-700 ml-6">
              Every file includes a SHA-256 checksum, a unique identifier that verifies file integrity.
              Recipients can use this to confirm the file hasn't been tampered with during transfer.
            </p>
          </div>

          <div class="border-l-4 border-red-400 pl-6 py-3 bg-red-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-red-600 mr-2">Q:</span> Does FileDuck keep my activity history?
            </h3>
            <p class="text-gray-700 ml-6">
              Activity data is stored locally in your browser, not on our servers.
              It persists after cache clearing but isn't synced across devices, ensuring your privacy.
            </p>
          </div>

          <div class="border-l-4 border-red-400 pl-6 py-3 bg-red-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-red-600 mr-2">Q:</span> Can I delete my uploaded files?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes! Visit the <router-link to="/history" class="text-red-600 underline">My Activity</router-link>
              page and click the delete button next to any upload to remove it immediately.
            </p>
          </div>
        </div>
      </section>

      <!-- Limits & Storage -->
      <section id="limits" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-orange-600 mb-6 flex items-center">
          <ClockIcon class="w-8 h-8 mr-3" />
          Limits & Storage
        </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-orange-400 pl-6 py-3 bg-orange-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-orange-600 mr-2">Q:</span> How long are files stored?
            </h3>
            <p class="text-gray-700 ml-6">
              Files are stored for your selected time period (1 hour to 7 days) or until they reach your chosen download limit, whichever comes first.
              Default settings are 24 hours and one-time download. After expiration, files are automatically deleted from our servers.
            </p>
          </div>

          <div class="border-l-4 border-orange-400 pl-6 py-3 bg-orange-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-orange-600 mr-2">Q:</span> Can I extend the expiration time?
            </h3>
            <p class="text-gray-700 ml-6">
              Currently, all files expire after 24 hours. This ensures optimal security and storage management.
              If you need longer storage, re-upload the file.
            </p>
          </div>

          <div class="border-l-4 border-orange-400 pl-6 py-3 bg-orange-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-orange-600 mr-2">Q:</span> Can I upload files larger than 500GB?
            </h3>
            <p class="text-gray-700 ml-6">
              Currently, the maximum file size is 500GB per file. For larger files, consider splitting them or using compression.
            </p>
          </div>

          <div class="border-l-4 border-orange-400 pl-6 py-3 bg-orange-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-orange-600 mr-2">Q:</span> Is there a limit to how many files I can upload?
            </h3>
            <p class="text-gray-700 ml-6">
              No! You can upload as many files as you want. Each file gets its own unique share code.
            </p>
          </div>

          <div class="border-l-4 border-orange-400 pl-6 py-3 bg-orange-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-orange-600 mr-2">Q:</span> What happens when my file expires?
            </h3>
            <p class="text-gray-700 ml-6">
              When a file expires (after your selected time or download limit is reached), it's permanently deleted from our servers
              and can no longer be downloaded. The share code becomes invalid.
            </p>
          </div>
        </div>
      </section>

      <!-- Troubleshooting -->
      <section id="troubleshooting" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <AlertCircleIcon class="w-8 h-8 mr-3" />
          Troubleshooting
        </h2>
        <div class="space-y-6">
          <div class="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-gray-600 mr-2">Q:</span> My upload is stuck or very slow. What should I do?
            </h3>
            <p class="text-gray-700 ml-6">
              Try pausing and resuming the upload. Check your internet connection.
              If the problem persists, refresh the page and try uploading again.
              For very large files, consider using a wired connection instead of Wi-Fi.
            </p>
          </div>

          <div class="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-gray-600 mr-2">Q:</span> The share code isn't working. What's wrong?
            </h3>
            <p class="text-gray-700 ml-6">
              Verify that you're entering the correct 6-character share code and 4-digit verification code.
              Check if the file has expired (24 hours) or reached its download limit.
              Codes are case-sensitive.
            </p>
          </div>

          <div class="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-gray-600 mr-2">Q:</span> I lost my activity history. Can I recover it?
            </h3>
            <p class="text-gray-700 ml-6">
              Activity history is stored locally in your browser. If you cleared all browser data or uninstalled your browser,
              the history cannot be recovered. However, your uploaded files remain accessible if you saved the share codes.
            </p>
          </div>

          <div class="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-gray-600 mr-2">Q:</span> The malware scan failed. What should I do?
            </h3>
            <p class="text-gray-700 ml-6">
              If your file is over 100MB, malware scanning is skipped automatically.
              For smaller files, if scanning fails, you can choose to skip the scan and proceed with the upload.
              Make sure your file is from a trusted source.
            </p>
          </div>

          <div class="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-gray-600 mr-2">Q:</span> Can I use FileDuck on mobile devices?
            </h3>
            <p class="text-gray-700 ml-6">
              Yes! FileDuck is fully optimized for mobile devices.
              You can upload and download files from your phone or tablet just like on desktop.
            </p>
          </div>

          <div class="border-l-4 border-gray-400 pl-6 py-3 bg-gray-50 rounded-r-lg">
            <h3 class="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <span class="text-gray-600 mr-2">Q:</span> I'm having other issues. Where can I get help?
            </h3>
            <p class="text-gray-700 ml-6">
              Visit our <router-link to="/docs" class="text-gray-600 underline">Documentation</router-link> page for detailed guides,
              or check our <router-link to="/terms" class="text-gray-600 underline">Terms of Service</router-link> and
              <router-link to="/privacy" class="text-gray-600 underline">Privacy Policy</router-link> for more information.
            </p>
          </div>
        </div>
      </section>

      <!-- Still Have Questions -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Still Have Questions?</h2>
        <p class="text-xl mb-6">Explore our comprehensive documentation for more details</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/docs"
            class="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            <BookOpenIcon class="w-5 h-5" />
            <span>View Documentation</span>
          </router-link>
          <router-link
            to="/"
            class="inline-flex items-center justify-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-full font-bold hover:bg-purple-700 transition-colors border-2 border-white"
          >
            <HomeIcon class="w-5 h-5" />
            <span>Back to Home</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  HelpCircleIcon,
  ChevronRightIcon,
  InfoIcon,
  UploadIcon,
  DownloadIcon,
  ShieldCheckIcon,
  ClockIcon,
  AlertCircleIcon,
  BookOpenIcon,
  HomeIcon
} from 'lucide-vue-next';
</script>

<style scoped>
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}
</style>
