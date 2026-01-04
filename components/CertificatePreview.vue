<template>
  <div 
    class="certificate-container"
    :style="{
      background: design.backgroundColor || 'linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%)'
    }"
  >
    <!-- Decorative Border -->
    <div 
      class="border-outer"
      :style="{ borderColor: design.borderColor || '#b45309' }"
    ></div>
    <div 
      class="border-inner"
      :style="{ borderColor: design.borderColor || '#b45309' }"
    ></div>
    
    <!-- Corner Ornaments -->
    <svg class="corner corner-tl" viewBox="0 0 100 100" fill="#d97706">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    <svg class="corner corner-tr" viewBox="0 0 100 100" fill="#d97706">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    <svg class="corner corner-bl" viewBox="0 0 100 100" fill="#d97706">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    <svg class="corner corner-br" viewBox="0 0 100 100" fill="#d97706">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>

    <!-- Content -->
    <div class="content">
      <!-- Header -->
      <div class="header">
        <!-- Logo -->
        <div class="logo-container">
          <template v-if="design.logoUrl && !logoError">
            <img 
              :src="design.logoUrl" 
              alt="Logo" 
              class="logo-img" 
              @error="logoError = true"
              referrerpolicy="no-referrer"
            />
          </template>
          <template v-else>
            <div class="logo-box">
              <span class="logo-letter">W</span>
            </div>
            <span class="logo-text">WeCodeZW</span>
          </template>
        </div>
        
        <!-- Certificate Title -->
        <p class="subtitle">This is to certify that</p>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <!-- Student Name -->
        <h2 
          class="student-name"
          :style="{ 
            color: design.textColor || '#1e3a5f',
            fontFamily: design.titleFont || 'Georgia, serif'
          }"
        >
          {{ studentName || 'Student Name' }}
        </h2>
        
        <!-- Achievement -->
        <p class="achievement-text">has successfully completed the course</p>
        
        <!-- Course Title -->
        <h3 
          class="course-title"
          :style="{ fontFamily: design.bodyFont || 'inherit' }"
        >
          {{ courseTitle || 'Course Title' }}
        </h3>
        
        <!-- Date -->
        <p class="date-text">
          Completed on {{ dateOfCompletion || 'Date of Completion' }}
        </p>
        
        <!-- Decorative Line -->
        <div class="decorative-line"></div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="signatures-row">
          <!-- Signature 1 -->
          <div class="signature-block">
            <div class="signature-line">
              <span class="signature-name">T. Munodawafa</span>
            </div>
            <p class="signature-title">CEO, WeCodeZW</p>
          </div>
          
          <!-- Seal -->
          <div class="seal-container">
            <div class="seal-outer">
              <div class="seal-inner">
                <svg class="seal-star" fill="#b45309" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
                </svg>
              </div>
            </div>
            <p v-if="certificateNumber" class="cert-number">{{ certificateNumber }}</p>
          </div>
          
          <!-- Signature 2 -->
          <div class="signature-block">
            <div class="signature-line">
              <span class="signature-name">Instructor</span>
            </div>
            <p class="signature-title">Course Instructor</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Watermark Pattern -->
    <div class="watermark"></div>
  </div>
</template>

<script setup lang="ts">
interface CertificateDesign {
  backgroundColor?: string
  textColor?: string
  titleFont?: string
  bodyFont?: string
  logoUrl?: string
  borderColor?: string
}

interface Props {
  design?: CertificateDesign
  studentName?: string
  courseTitle?: string
  dateOfCompletion?: string
  certificateNumber?: string
}

withDefaults(defineProps<Props>(), {
  design: () => ({}),
  studentName: '',
  courseTitle: '',
  dateOfCompletion: '',
  certificateNumber: ''
})

const logoError = ref(false)
</script>

<style scoped>
.certificate-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1.414;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.border-outer {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  border: 2px solid;
  border-radius: 8px;
  pointer-events: none;
}

.border-inner {
  position: absolute;
  top: 24px;
  left: 24px;
  right: 24px;
  bottom: 24px;
  border: 1px solid;
  border-radius: 8px;
  opacity: 0.5;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 40px;
  height: 40px;
}

.corner-tl { top: 16px; left: 16px; }
.corner-tr { top: 16px; right: 16px; transform: rotate(90deg); }
.corner-bl { bottom: 16px; left: 16px; transform: rotate(-90deg); }
.corner-br { bottom: 16px; right: 16px; transform: rotate(180deg); }

.content {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 48px 56px;
  box-sizing: border-box;
}

.header {
  text-align: center;
  flex-shrink: 0;
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 16px;
}

.logo-img {
  height: 56px;
  object-fit: contain;
}

.logo-box {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-letter {
  color: white;
  font-weight: bold;
  font-size: 22px;
}

.logo-text {
  font-size: 26px;
  font-weight: bold;
  color: #0c4a6e;
}

.subtitle {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #b45309;
  margin: 0;
}

.main-content {
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
}

.student-name {
  font-size: 42px;
  font-weight: bold;
  margin: 0 0 16px 0;
  font-family: Georgia, serif;
}

.achievement-text {
  font-size: 16px;
  color: #4b5563;
  margin: 0 0 12px 0;
}

.course-title {
  font-size: 24px;
  font-weight: bold;
  color: #075985;
  margin: 0 0 12px 0;
  padding: 0 20px;
}

.date-text {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.decorative-line {
  width: 120px;
  height: 2px;
  background: linear-gradient(to right, transparent, #d97706, transparent);
}

.footer {
  width: 100%;
  flex-shrink: 0;
}

.signatures-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  padding: 0 24px;
}

.signature-block {
  text-align: center;
}

.signature-line {
  width: 120px;
  height: 36px;
  border-bottom: 1px solid #9ca3af;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 4px;
}

.signature-name {
  font-family: 'Brush Script MT', cursive;
  font-size: 18px;
  color: #374151;
  font-style: italic;
}

.signature-title {
  font-size: 11px;
  color: #6b7280;
  margin: 0;
}

.seal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 16px;
}

.seal-outer {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 2px solid #d97706;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
}

.seal-inner {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 1px solid #f59e0b;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seal-star {
  width: 28px;
  height: 28px;
}

.cert-number {
  font-size: 9px;
  color: #9ca3af;
  margin: 4px 0 0 0;
}

.watermark {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(0,0,0,0.5) 35px, rgba(0,0,0,0.5) 70px);
}
</style>
