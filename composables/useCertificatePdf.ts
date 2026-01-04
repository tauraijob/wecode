import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export interface CertificateData {
    design?: {
        backgroundColor?: string
        textColor?: string
        titleFont?: string
        bodyFont?: string
        logoUrl?: string
        borderColor?: string
    }
    studentName: string
    courseTitle: string
    dateOfCompletion: string
    certificateNumber: string
}

export function useCertificatePdf() {
    const isGenerating = ref(false)

    /**
     * Generate PDF from the certificate preview HTML element
     */
    const generatePdfFromElement = async (
        element: HTMLElement,
        filename: string = 'certificate.pdf'
    ): Promise<Blob> => {
        isGenerating.value = true

        try {
            // Capture the element as a canvas
            const canvas = await html2canvas(element, {
                scale: 2, // Higher quality
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                logging: false
            })

            // Calculate PDF dimensions (A4 landscape for certificate)
            const imgWidth = 297 // A4 landscape width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width

            // Create PDF
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            })

            // Add image to PDF
            const imgData = canvas.toDataURL('image/png')
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)

            // Return as blob
            return pdf.output('blob')
        } finally {
            isGenerating.value = false
        }
    }

    /**
     * Download certificate as PDF
     */
    const downloadCertificate = async (
        element: HTMLElement,
        filename: string = 'certificate.pdf'
    ) => {
        const blob = await generatePdfFromElement(element, filename)

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    /**
     * Generate certificate HTML that matches the CertificatePreview component
     */
    const generateCertificateHtml = (data: CertificateData): string => {
        const design = data.design || {}
        const borderColor = design.borderColor || '#b45309'
        const textColor = design.textColor || '#1e3a5f'
        const titleFont = design.titleFont || 'Georgia, serif'

        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Merriweather:wght@400;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: system-ui, -apple-system, sans-serif;
    }
    
    .certificate {
      width: 1056px;
      height: 748px;
      background: linear-gradient(135deg, #fefce8 0%, #fff7ed 50%, #fef3c7 100%);
      position: relative;
      padding: 40px;
    }
    
    .outer-border {
      position: absolute;
      inset: 16px;
      border: 2px solid ${borderColor};
      border-radius: 8px;
    }
    
    .inner-border {
      position: absolute;
      inset: 24px;
      border: 1px solid ${borderColor};
      border-radius: 8px;
      opacity: 0.5;
    }
    
    .corner {
      position: absolute;
      width: 48px;
      height: 48px;
      fill: ${borderColor};
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
      padding: 40px 60px;
    }
    
    .header {
      text-align: center;
    }
    
    .logo {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-bottom: 16px;
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
    
    .logo-box span {
      color: white;
      font-weight: bold;
      font-size: 20px;
    }
    
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      color: #0c4a6e;
    }
    
    .subtitle {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #b45309;
      margin-top: 8px;
    }
    
    .main {
      text-align: center;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .student-name {
      font-size: 48px;
      font-weight: bold;
      color: ${textColor};
      font-family: ${titleFont};
      margin-bottom: 16px;
    }
    
    .completion-text {
      font-size: 16px;
      color: #4b5563;
      margin-bottom: 12px;
    }
    
    .course-title {
      font-size: 24px;
      font-weight: bold;
      color: #0c4a6e;
      margin-bottom: 12px;
    }
    
    .date-text {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 24px;
    }
    
    .decorative-line {
      width: 128px;
      height: 2px;
      background: linear-gradient(to right, transparent, ${borderColor}, transparent);
    }
    
    .footer {
      width: 100%;
    }
    
    .signatures {
      display: flex;
      justify-content: space-around;
      align-items: flex-end;
      padding: 0 32px;
    }
    
    .signature {
      text-align: center;
    }
    
    .signature-line {
      width: 128px;
      height: 40px;
      border-bottom: 1px solid #9ca3af;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 4px;
    }
    
    .signature-name {
      font-family: 'Brush Script MT', cursive;
      font-size: 20px;
      color: #374151;
      font-style: italic;
    }
    
    .signature-title {
      font-size: 10px;
      color: #6b7280;
    }
    
    .seal {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .seal-circle {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border: 2px solid ${borderColor};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .seal-inner {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      border: 1px solid ${borderColor};
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .seal-star {
      width: 32px;
      height: 32px;
      fill: #b45309;
    }
    
    .cert-number {
      font-size: 9px;
      color: #9ca3af;
      margin-top: 4px;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    
    <!-- Corner Ornaments -->
    <svg class="corner corner-tl" viewBox="0 0 100 100">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    <svg class="corner corner-tr" viewBox="0 0 100 100">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    <svg class="corner corner-bl" viewBox="0 0 100 100">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    <svg class="corner corner-br" viewBox="0 0 100 100">
      <path d="M0 0 L100 0 L100 10 L10 10 L10 100 L0 100 Z"/>
    </svg>
    
    <div class="content">
      <div class="header">
        <div class="logo">
          <div class="logo-box"><span>W</span></div>
          <span class="logo-text">WeCodeZW</span>
        </div>
        <p class="subtitle">This is to certify that</p>
      </div>
      
      <div class="main">
        <h2 class="student-name">${data.studentName}</h2>
        <p class="completion-text">has successfully completed the course</p>
        <h3 class="course-title">${data.courseTitle}</h3>
        <p class="date-text">Completed on ${data.dateOfCompletion}</p>
        <div class="decorative-line"></div>
      </div>
      
      <div class="footer">
        <div class="signatures">
          <div class="signature">
            <div class="signature-line">
              <span class="signature-name">T. Munodawafa</span>
            </div>
            <p class="signature-title">CEO, WeCodeZW</p>
          </div>
          
          <div class="seal">
            <div class="seal-circle">
              <div class="seal-inner">
                <svg class="seal-star" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"/>
                </svg>
              </div>
            </div>
            <p class="cert-number">${data.certificateNumber}</p>
          </div>
          
          <div class="signature">
            <div class="signature-line">
              <span class="signature-name">Instructor</span>
            </div>
            <p class="signature-title">Course Instructor</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`
    }

    return {
        isGenerating,
        generatePdfFromElement,
        downloadCertificate,
        generateCertificateHtml
    }
}
