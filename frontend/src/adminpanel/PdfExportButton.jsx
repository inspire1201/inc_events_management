import React, { useState } from 'react';
import html2pdf from "html2pdf.js";
import downloadImg from '../assets/download.png';
import Swal from 'sweetalert2';
import './PdfExportButton.css'; // Loader CSS (create if not exists)

const pdfHideStyle = `
  @media print {
    .pdf-hide, .report-btn, .event-report-table th.pdf-action-col, .event-report-table td.pdf-action-col, .dropdwon { display: none !important; }
  }
  .pdf-exporting .pdf-hide, .pdf-exporting .report-btn, .pdf-exporting .event-report-table th.pdf-action-col, .pdf-exporting .event-report-table td.pdf-action-col, .pdf-exporting .dropdwon { display: none !important; }
  .pdf-header-mpcc { margin-bottom: 4px; }
  .pdf-header-topbar { display: flex; justify-content: space-between; align-items: flex-start; width: 100%; }
  .pdf-header-topbar-left, .pdf-header-topbar-right { min-width: 100px; font-size: 14px; font-family: Arial, sans-serif; }
  .pdf-header-label { line-height: 1.1; font-size: 12px; font-family: Arial, sans-serif; }
  .pdf-header-blue { color: #1a237e; font-weight: bold; }
  .pdf-header-center { align-items: center; margin-top: 0; justify-content: center; flex-direction: column; }
  .pdf-header-title-col { flex-direction: column; text-align: center; }
  .pdf-header-title { font-size: 16px !important; font-weight: bold; color: #1a237e; margin-bottom: 1px; letter-spacing: 0.5px; }
  .pdf-header-address { font-size: 14px !important; color: #1a237e; }
  .pdf-header-logo-main { max-width: 48px !important; }
  .pdf-header-divider { border: none; border-top: 1.2px solid #1a237e; margin: 2px 0 4px 0; }
  .pdf-hindi-text { font-size: 14px !important; font-family: 'Noto Sans', 'Mangal', Arial, sans-serif !important; }
`;

const PdfExportButton = ({ targetId, filename = 'event-report.pdf', children, rowsPerPage = 20 }) => {
  const [isLoading, setIsLoading] = useState(false);
  const handlePDF = async () => {
    const element = document.getElementById(targetId);
    if (element) {
      setIsLoading(true);
      // Add class to hide elements for PDF
      element.classList.add('pdf-exporting');
      // Add style to head if not present
      let style = document.getElementById('pdf-hide-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'pdf-hide-style';
        style.innerHTML = pdfHideStyle;
        document.head.appendChild(style);
      }
      // --- Repeat header for each page ---
      // Find table rows or list items to split
      let rows = Array.from(element.querySelectorAll('tbody tr'));
      if (rows.length === 0) rows = Array.from(element.querySelectorAll('li'));
      if (rows.length === 0) rows = Array.from(element.children); // fallback: split by children
      const totalPages = Math.ceil(rows.length / rowsPerPage) || 1;
      // Save original HTML
      const originalHTML = element.innerHTML;
      // Prepare paginated content
      let paginatedHTML = '';
      for (let i = 0; i < totalPages; i++) {
       
        paginatedHTML += `
          <div class="pdf-header-mpcc">
            <div class="pdf-header-topbar" style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
              <div class="pdf-header-topbar-left" style="text-align:left;">
                <div class="pdf-header-label pdf-header-blue">ई-मेल: 'कांग्रेस'</div>
                <div class="pdf-header-label">E-mail: orgmpcct1@gmail.com</div>
                <div class="pdf-header-label">www.mpcongress.org</div>
              </div>
              <div>  <img src="${downloadImg}" alt="Logo" class="pdf-header-logo-main" style="display:block; margin:0 auto; max-width:48px;" /></div>
              <div class="pdf-header-topbar-right" style="text-align:right;">
                <div class="pdf-header-label pdf-header-blue">कार्यालय = 0755-2551512</div>
                <div class="pdf-header-label">0755-2555452</div>
                <div class="pdf-header-label">फैक्स = 0755-2577981</div>
              </div>
            </div>
            <div class="pdf-header-row pdf-header-center" style="justify-content:center; align-items:center; flex-direction:column; margin-top: 2px;">
            
              <div class="pdf-header-title-col" style="display:flex; flex-direction:column; align-items:center; margin-top:6px;">
                <div class="pdf-header-title pdf-hindi-text">मध्यप्रदेश कांग्रेस कमेटी</div>
                <div class="pdf-header-address pdf-hindi-text">इंदिरा भवन, शिवाजी नगर, भोपाल-462 016 (म.प्र.)</div>
              </div>
            </div>
          </div>
          <br/>
          <hr class="pdf-header-divider" />
        `;
        // Page content
        if (rows.length > 0) {
          // Table or list
          const pageRows = rows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
          if (element.querySelector('table')) {
            // Table: clone table structure, replace tbody with pageRows
            const table = element.querySelector('table').cloneNode(true);
            const tbody = table.querySelector('tbody');
            if (tbody) {
              tbody.innerHTML = '';
              pageRows.forEach(row => tbody.appendChild(row.cloneNode(true)));
            }
            paginatedHTML += table.outerHTML;
          } else if (element.querySelector('ul')) {
            // List: clone ul structure, replace children with pageRows
            const ul = element.querySelector('ul').cloneNode(false);
            pageRows.forEach(row => ul.appendChild(row.cloneNode(true)));
            paginatedHTML += ul.outerHTML;
          } else {
            // Generic: just append the nodes
            pageRows.forEach(row => paginatedHTML += row.outerHTML);
          }
        } else {
          // No rows: just use original content
          paginatedHTML += originalHTML;
        }
        // Page break except last page
        if (i < totalPages - 1) paginatedHTML += '<div style="page-break-after:always"></div>';
      }
      // Replace element content with paginated content
      const originalContent = element.innerHTML;
      element.innerHTML = paginatedHTML;
      // Wait for all images to load
      const images = element.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = img.onerror = resolve;
        });
      }));
      // Generate PDF
      html2pdf().from(element).set({
        margin: 0.5,
        filename,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).save().then(() => {
        // Restore original content
        element.innerHTML = originalContent;
        element.classList.remove('pdf-exporting');
        setIsLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Report Generated!',
          text: 'PDF report has been downloaded.',
          timer: 2000,
          showConfirmButton: false
        });
      }).catch(() => {
        setIsLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to generate PDF.'
        });
      });
    }
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <button className="report-btn" onClick={handlePDF} type="button" disabled={isLoading}>
        {children || 'Report'}
      </button>
      {isLoading && (
        <div className="pdf-loader-overlay">
          <div className="pdf-loader-spinner"></div>
        </div>
      )}
    </div>
  );
};

export default PdfExportButton; 