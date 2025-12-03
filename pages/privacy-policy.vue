<template>
  <section class="mx-auto max-w-4xl px-3 sm:px-4 py-12 sm:py-16">
    <div class="mb-8">
      <h1 class="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-navy-200 to-navy-400 bg-clip-text text-transparent">
        Privacy Policy
      </h1>
      <p class="mt-2 text-navy-300">Last updated: {{ new Date().toLocaleDateString() }}</p>
    </div>

    <div class="prose prose-invert max-w-none space-y-6 text-navy-200">
      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">1. Introduction</h2>
        <p>
          Welcome to WeCodeZW ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">2. Information We Collect</h2>
        <h3 class="text-xl font-semibold text-white mb-2">2.1 Personal Information</h3>
        <p>We may collect the following personal information:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Name and contact information (email address, phone number)</li>
          <li>Account credentials (username, password)</li>
          <li>Payment information (processed through secure third-party payment processors)</li>
          <li>Profile information and preferences</li>
          <li>Course enrollment and progress data</li>
        </ul>

        <h3 class="text-xl font-semibold text-white mb-2 mt-4">2.2 Automatically Collected Information</h3>
        <p>We automatically collect certain information when you visit our website:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>IP address and device information</li>
          <li>Browser type and version</li>
          <li>Pages visited and time spent on pages</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">3. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To process your course enrollments and payments</li>
          <li>To communicate with you about your account and courses</li>
          <li>To send you important updates and notifications</li>
          <li>To improve our website and services</li>
          <li>To analyze usage patterns and trends</li>
          <li>To comply with legal obligations</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">4. Information Sharing and Disclosure</h2>
        <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li><strong>Service Providers:</strong> We may share information with third-party service providers who assist us in operating our website and conducting our business</li>
          <li><strong>Payment Processors:</strong> Payment information is processed through secure third-party payment processors</li>
          <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale, your information may be transferred</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">6. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our website.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul class="list-disc pl-6 space-y-2">
          <li>Access and receive a copy of your personal information</li>
          <li>Rectify inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Object to processing of your personal information</li>
          <li>Request restriction of processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">8. Data Retention</h2>
        <p>
          We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">9. Children's Privacy</h2>
        <p>
          Our services are not intended for individuals under the age of 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">10. Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>
      </div>

      <div>
        <h2 class="text-2xl font-semibold text-white mb-3">11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us:
        </p>
        <ul class="list-none pl-0 space-y-2">
          <li><strong>Email:</strong> privacy@wecode.co.zw</li>
          <li><strong>WhatsApp:</strong> +263 778 456 168</li>
          <li><strong>Address:</strong> WeCodeZW, Zimbabwe</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useHead({
  title: 'Privacy Policy - WeCodeZW',
  meta: [
    { name: 'description', content: 'Privacy Policy for WeCodeZW - Learn how we collect, use, and protect your personal information.' }
  ]
})
</script>



