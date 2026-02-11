<template>
  <div class="min-h-screen bg-cream-50 py-12 px-4">
    <div class="container mx-auto max-w-5xl">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 text-indigo-950 font-display tracking-tight leading-tight">
          FileDuck Documentation
        </h1>
        <p class="text-xl text-gray-600">Everything you need to know about secure file sharing</p>
      </div>

      <!-- Table of Contents -->
      <div class="bg-white rounded-2xl shadow-xl p-6 mb-8 border-2 border-purple-200">
        <h2 class="text-2xl font-bold text-purple-600 mb-4 flex items-center">
          <BookOpenIcon class="w-6 h-6 mr-2" />
          Quick Navigation
        </h2>
        <div class="grid md:grid-cols-2 gap-3">
          <a href="#getting-started" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Getting Started</span>
          </a>
          <a href="#uploading" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Uploading Files</span>
          </a>
          <a href="#downloading" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Downloading Files</span>
          </a>
          <a href="#security" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Security Features</span>
          </a>
          <a href="#activity" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Activity Tracking</span>
          </a>
          <a href="#limits" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Limits & Expiration</span>
          </a>
          <a href="#mobile" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>Mobile Usage</span>
          </a>
          <a href="#faq" class="flex items-center space-x-2 text-purple-600 hover:text-purple-800 hover:bg-purple-50 p-3 rounded-lg transition-colors">
            <ChevronRightIcon class="w-4 h-4" />
            <span>FAQ</span>
          </a>
        </div>
      </div>

      <!-- About FileDuck -->
      <section class="bg-purple-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-300 scroll-mt-20">
        <div class="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-bold text-purple-600 mb-6">
              About FileDuck
            </h2>
            <p class="text-gray-700 text-lg mb-4">
              FileDuck is a modern, secure file-sharing platform designed to make file transfers simple, safe, and fast.
              Whether you're sharing documents with colleagues or sending large files to friends, FileDuck has you covered.
            </p>
            <p class="text-gray-700 mb-4">
              With advanced features like AI-powered malware scanning, end-to-end encryption, and support for files up to 500GB,
              FileDuck provides enterprise-grade security without the complexity.
            </p>
            <div class="flex flex-wrap gap-3 mt-6">
              <span class="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">Secure</span>
              <span class="bg-pink-100 text-pink-700 px-4 py-2 rounded-full text-sm font-semibold">Fast</span>
              <span class="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">Private</span>
              <span class="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">No Signup</span>
            </div>
          </div>
          <div class="flex justify-center">
            <img src="/about.png" alt="About FileDuck" class="rounded-2xl shadow-2xl max-w-full h-auto border-4 border-white" />
          </div>
        </div>
      </section>

      <!-- Getting Started -->
      <section id="getting-started" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-purple-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-purple-600 mb-6 flex items-center">
          <RocketIcon class="w-8 h-8 mr-3" />
          Getting Started
        </h2>
        <div class="prose max-w-none">
          <p class="text-gray-700 text-lg mb-4">
            FileDuck is a secure file-sharing platform that allows you to upload and share files with anyone, anywhere.
            No account required - just upload, share, and download!
          </p>
          <div class="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
            <p class="text-blue-800 font-semibold flex items-center">
              <SparklesIcon class="w-4 h-4 mr-2" />
              Key Features:
            </p>
            <ul class="mt-2 space-y-1 text-blue-700">
              <li>• Upload files up to 500GB with multipart chunking</li>
              <li>• AI-powered malware scanning (up to 100MB)</li>
              <li>• End-to-end encryption</li>
              <li>• No registration required</li>
              <li>• Pause & resume for large uploads/downloads</li>
              <li>• Download tracking & history</li>
              <li>• Mobile-optimized downloads</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Uploading Files -->
      <section id="uploading" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-green-600 mb-6 flex items-center">
          <UploadIcon class="w-8 h-8 mr-3" />
          Uploading Files
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 1: Select Your File</h3>
            <p class="text-gray-700 mb-3">Choose a file using one of these methods:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Click</strong> the upload box to browse your files</li>
              <li><strong>Drag and drop</strong> a file directly into the upload area</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 2: Malware Scanning</h3>
            <p class="text-gray-700 mb-3">
              Files under 100MB are automatically scanned for malware using AI-powered detection.
              You can choose to skip scanning for larger files to speed up the upload process.
            </p>
            <div class="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p class="text-yellow-800 flex items-center">
                <AlertTriangleIcon class="w-4 h-4 mr-2 flex-shrink-0" />
                <span><strong>Note:</strong> Files over 100MB will skip malware scanning due to size limitations.
                Please ensure files from trusted sources before uploading.</span>
              </p>
            </div>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 3: Upload Starts</h3>
            <p class="text-gray-700 mb-3">
              Once scanning is complete (or skipped), your file upload begins automatically. You'll see:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Upload progress percentage</li>
              <li>Upload speed (MB/s)</li>
              <li>Estimated time remaining</li>
              <li>Pause/Resume buttons (for large files)</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 4: Get Your Share Code</h3>
            <p class="text-gray-700 mb-3">
              After successful upload, you'll receive:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li><strong>Share Code:</strong> A unique 6-character code (e.g., ABC123)</li>
              <li><strong>Verification Code:</strong> A 4-digit PIN for added security</li>
              <li><strong>Download Link:</strong> Direct URL to share</li>
              <li><strong>QR Code:</strong> Scannable code for easy mobile sharing</li>
            </ul>
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
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 1: Enter Share Code</h3>
            <p class="text-gray-700 mb-3">
              Navigate to the <router-link to="/download" class="text-blue-600 underline">Download page</router-link> and enter the 6-character share code you received.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 2: Verify Access</h3>
            <p class="text-gray-700 mb-3">
              If the file is protected with a verification code, enter the 4-digit PIN provided by the sender.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3">Step 3: Download</h3>
            <p class="text-gray-700 mb-3">
              Click the download button to start downloading. Features include:
            </p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Resume capability for interrupted downloads</li>
              <li>Mobile-optimized download flow</li>
              <li>Automatic download tracking in your activity history</li>
            </ul>
          </div>

          <div class="bg-green-50 border-l-4 border-green-500 p-4">
            <p class="text-green-800 flex items-center">
              <LightbulbIcon class="w-4 h-4 mr-2 flex-shrink-0" />
              <span><strong>Tip:</strong> Downloads are automatically saved to your browser's download folder.
              On mobile, you'll be prompted to choose a save location.</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Security Features -->
      <section id="security" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-red-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-red-600 mb-6 flex items-center">
          <ShieldCheckIcon class="w-8 h-8 mr-3" />
          Security Features
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <LockIcon class="w-5 h-5 mr-2 text-gray-800" />
              End-to-End Encryption
            </h3>
            <p class="text-gray-700">
              All file transfers are encrypted using industry-standard encryption protocols.
              Your data is secure during transit and at rest.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <ShieldIcon class="w-5 h-5 mr-2 text-gray-800" />
              AI-Powered Malware Scanning
            </h3>
            <p class="text-gray-700">
              Files under 100MB are scanned using VirusTotal's comprehensive malware detection,
              which checks against 70+ antivirus engines.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <KeyIcon class="w-5 h-5 mr-2 text-gray-800" />
              Verification Codes
            </h3>
            <p class="text-gray-700">
              Every upload generates a unique 4-digit verification code that adds an extra layer of security.
              Only users with both the share code and verification code can access the file.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <ClockIcon class="w-5 h-5 mr-2 text-gray-800" />
              Automatic Expiration
            </h3>
            <p class="text-gray-700">
              Files automatically expire after your selected time (1 hour to 7 days, default: 24 hours) or after reaching your chosen download limit (default: one-time download),
              ensuring your data doesn't remain accessible indefinitely.
            </p>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <SearchIcon class="w-5 h-5 mr-2 text-gray-800" />
              SHA-256 Checksums
            </h3>
            <p class="text-gray-700">
              Every file includes a SHA-256 checksum to verify file integrity.
              Recipients can verify that the file hasn't been tampered with during transfer.
            </p>
          </div>
        </div>
      </section>

      <!-- Activity Tracking -->
      <section id="activity" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-teal-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-teal-600 mb-6 flex items-center">
          <ActivityIcon class="w-8 h-8 mr-3" />
          Activity Tracking
        </h2>
        <div class="space-y-6">
          <p class="text-gray-700 text-lg">
            FileDuck keeps track of your upload and download activity locally in your browser.
            Visit the <router-link to="/history" class="text-teal-600 underline">My Activity</router-link> page to view your history.
          </p>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <UploadIcon class="w-5 h-5 mr-2 text-gray-800" />
              Upload History
            </h3>
            <p class="text-gray-700 mb-3">Track all your uploaded files with:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>File name, size, and upload date</li>
              <li>Real-time countdown to expiration</li>
              <li>Uses remaining counter</li>
              <li>Share codes and verification codes</li>
              <li>Quick actions: Copy code, Delete file</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <DownloadIcon class="w-5 h-5 mr-2 text-gray-800" />
              Download History
            </h3>
            <p class="text-gray-700 mb-3">Keep a record of all files you've downloaded:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>File name and size</li>
              <li>Download timestamp</li>
              <li>Share code for reference</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <TagIcon class="w-5 h-5 mr-2 text-gray-800" />
              Status Badges
            </h3>
            <p class="text-gray-700 mb-3">Files in your history show status indicators:</p>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li class="flex items-center gap-2">
                <img src="/perimeter-limit-svgrepo-com.svg" alt="Limit Reached" class="w-4 h-4 inline-block" />
                <span class="inline-block bg-orange-500 text-white px-2 py-1 rounded text-xs font-bold">LIMIT REACHED</span> - Download limit exceeded
              </li>
              <li class="flex items-center gap-2">
                <img src="/expired-svgrepo-com.svg" alt="Expired" class="w-4 h-4 inline-block" />
                <span class="inline-block bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">EXPIRED</span> - File has expired (time limit reached)
              </li>
            </ul>
          </div>

          <div class="bg-purple-50 border-l-4 border-purple-500 p-4">
            <p class="text-purple-800 flex items-center">
              <LockIcon class="w-4 h-4 mr-2 flex-shrink-0" />
              <span><strong>Privacy Note:</strong> All activity data is stored locally in your browser.
              It persists even after clearing cache but is not synced across devices.</span>
            </p>
          </div>
        </div>
      </section>

      <!-- Limits & Expiration -->
      <section id="limits" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-orange-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-orange-600 mb-6 flex items-center">
          <ClockIcon class="w-8 h-8 mr-3" />
          Limits & Expiration
        </h2>
        <div class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-blue-50 p-6 rounded-lg">
              <h3 class="text-lg font-bold text-blue-800 mb-3 flex items-center">
                <BarChartIcon class="w-5 h-5 mr-2" />
                File Size Limits
              </h3>
              <ul class="space-y-2 text-blue-700">
                <li><strong>Maximum:</strong> 500 GB per file</li>
                <li><strong>Scan Limit:</strong> 100 MB (malware scanning)</li>
                <li><strong>Recommended:</strong> Use pause/resume for files over 10 GB</li>
                <li><strong>Chunking:</strong> Automatic multipart upload for reliability</li>
              </ul>
            </div>

            <div class="bg-green-50 p-6 rounded-lg">
              <h3 class="text-lg font-bold text-green-800 mb-3 flex items-center">
                <ClockIcon class="w-5 h-5 mr-2" />
                Time Limits
              </h3>
              <ul class="space-y-2 text-green-700">
                <li><strong>Options:</strong> 1h, 6h, 24h (default), 3 days, or 7 days (max)</li>
                <li><strong>Countdown:</strong> Live timer in activity history</li>
                <li><strong>Warning:</strong> Highlighted when < 1 hour remains</li>
              </ul>
            </div>

            <div class="bg-purple-50 p-6 rounded-lg">
              <h3 class="text-lg font-bold text-purple-800 mb-3 flex items-center">
                <DownloadIcon class="w-5 h-5 mr-2" />
                Download Limits
              </h3>
              <ul class="space-y-2 text-purple-700">
                <li><strong>Options:</strong> 1 (default), 3, 5, 10, or unlimited downloads</li>
                <li><strong>Tracking:</strong> Uses counter in activity</li>
                <li><strong>Expiry:</strong> File deleted when limit reached</li>
              </ul>
            </div>

            <div class="bg-red-50 p-6 rounded-lg">
              <h3 class="text-lg font-bold text-red-800 mb-3 flex items-center">
                <Trash2Icon class="w-5 h-5 mr-2" />
                Auto-Deletion
              </h3>
              <ul class="space-y-2 text-red-700">
                <li><strong>Time:</strong> After 24 hours</li>
                <li><strong>Uses:</strong> After 10 downloads</li>
                <li><strong>Manual:</strong> Delete anytime from activity</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile Usage -->
      <section id="mobile" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-pink-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-pink-600 mb-6 flex items-center">
          <SmartphoneIcon class="w-8 h-8 mr-3" />
          Mobile Usage
        </h2>
        <div class="space-y-6">
          <p class="text-gray-700 text-lg">
            FileDuck is fully optimized for mobile devices. Here's what you need to know:
          </p>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <SmartphoneIcon class="w-5 h-5 mr-2 text-gray-800" />
              Mobile Uploading
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Tap the upload area to select files from your device</li>
              <li>Access photos, videos, and documents directly</li>
              <li>Upload progress displays in real-time</li>
              <li>Works in all mobile browsers (Chrome, Safari, Firefox)</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <DownloadIcon class="w-5 h-5 mr-2 text-gray-800" />
              Mobile Downloading
            </h3>
            <ul class="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Downloads start automatically in your browser</li>
              <li>Files save to your default download location</li>
              <li>On iOS: May prompt to save to Files app</li>
              <li>On Android: Saves to Downloads folder</li>
            </ul>
          </div>

          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <RefreshCwIcon class="w-5 h-5 mr-2 text-gray-800" />
              Pause & Resume
            </h3>
            <p class="text-gray-700">
              Large file transfers support pause and resume functionality.
              If your connection drops, simply resume from where you left off.
            </p>
          </div>

          <div class="bg-blue-50 border-l-4 border-blue-500 p-4">
            <p class="text-blue-800 flex items-center">
              <LightbulbIcon class="w-4 h-4 mr-2 flex-shrink-0" />
              <span><strong>Pro Tip:</strong> For best mobile experience, connect to Wi-Fi when uploading or downloading large files
              to avoid using mobile data.</span>
            </p>
          </div>
        </div>
      </section>

      <!-- FAQ -->
      <section id="faq" class="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-gray-200 scroll-mt-20">
        <h2 class="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <HelpCircleIcon class="w-8 h-8 mr-3" />
          Frequently Asked Questions
        </h2>
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              Do I need to create an account?
            </h3>
            <p class="text-gray-700">No! FileDuck works without registration. Just upload and share instantly.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              How long are files stored?
            </h3>
            <p class="text-gray-700">Files are stored for your selected time period (up to 7 days) or until they reach your chosen download limit, whichever comes first.
            Default settings: 24 hours and one-time download.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              Can I upload files larger than 500GB?
            </h3>
            <p class="text-gray-700">Currently, the maximum file size is 500GB per file. For larger files, consider splitting them or using compression. Our multipart upload technology ensures reliable transfers even for files this large.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              Is my data secure?
            </h3>
            <p class="text-gray-700">Yes! All transfers use end-to-end encryption, and files under 100MB are scanned for malware before storage.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              What happens to my activity history if I clear my browser data?
            </h3>
            <p class="text-gray-700">Activity data is stored using persistent storage APIs, so it survives cache clearing. However, if you completely uninstall your browser or reset all data, the history will be lost.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              Can I extend the expiration time?
            </h3>
            <p class="text-gray-700">Currently, all files expire after 24 hours. This ensures optimal security and storage management.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              What file types are supported?
            </h3>
            <p class="text-gray-700">FileDuck supports all file types! Upload documents, images, videos, archives, or any other file format.</p>
          </div>

          <div>
            <h3 class="text-lg font-bold text-gray-800 mb-2 flex items-center">
              <HelpCircleIcon class="w-5 h-5 mr-2" />
              Can I delete a file before it expires?
            </h3>
            <p class="text-gray-700">Yes! Visit <router-link to="/history" class="text-purple-600 underline">My Activity</router-link> and click the delete button next to any upload.</p>
          </div>
        </div>
      </section>

      <!-- Need Help -->
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-center text-white">
        <h2 class="text-3xl font-bold mb-4">Need More Help?</h2>
        <p class="text-xl mb-6">We're here to assist you with any questions or issues.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/"
            class="inline-flex items-center justify-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            <HomeIcon class="w-5 h-5" />
            <span>Back to Home</span>
          </router-link>
          <a
            href="https://www.producthunt.com/products/fileduck?launch=fileduck"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center justify-center space-x-2 bg-orange-500 text-white px-6 py-3 rounded-full font-bold hover:bg-orange-600 transition-colors"
          >
            <svg class="w-5 h-5" viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20s8.954 20 20 20 20-8.954 20-20S31.046 0 20 0zm0 4c8.837 0 16 7.163 16 16s-7.163 16-16 16S4 28.837 4 20 11.163 4 20 4z"/>
              <path d="M14 26V14h8c3.314 0 6 2.686 6 6 0 3.314-2.686 6-6 6h-8zm4-8v4h4c1.105 0 2-.895 2-2s-.895-2-2-2h-4z"/>
            </svg>
            <span>Visit on Product Hunt</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  BookOpenIcon,
  ChevronRightIcon,
  RocketIcon,
  UploadIcon,
  DownloadIcon,
  ShieldCheckIcon,
  ActivityIcon,
  ClockIcon,
  SmartphoneIcon,
  HelpCircleIcon,
  HomeIcon,
  SparklesIcon,
  AlertTriangleIcon,
  LightbulbIcon,
  LockIcon,
  ShieldIcon,
  KeyIcon,
  SearchIcon,
  TagIcon,
  BarChartIcon,
  Trash2Icon,
  RefreshCwIcon
} from 'lucide-vue-next';
</script>

<style scoped>
/* Smooth scrolling for anchor links */
html {
  scroll-behavior: smooth;
}

/* Prose styling */
.prose {
  color: #374151;
  line-height: 1.75;
}

.prose ul {
  list-style: disc;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
