import React, { useState } from 'react';
import html2pdf from "html2pdf.js";
import downloadImg from '../assets/download.png';
import Swal from 'sweetalert2';

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

const PdfExportButton = ({ targetId, filename = 'event-report.pdf', children, rowsPerPage = 26, headerHtml = '' }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePDF = async () => {
    const element = document.getElementById(targetId);
    if (element) {
      setIsLoading(true);
      element.classList.add('pdf-exporting');
      let style = document.getElementById('pdf-hide-style');
      if (!style) {
        style = document.createElement('style');
        style.id = 'pdf-hide-style';
        style.innerHTML = pdfHideStyle;
        document.head.appendChild(style);
      }

      let rows = Array.from(element.querySelectorAll('tbody tr'));
      if (rows.length === 0) rows = Array.from(element.querySelectorAll('li'));
      if (rows.length === 0) rows = Array.from(element.children);
      const totalPages = Math.ceil(rows.length / rowsPerPage) || 1;
      const originalHTML = element.innerHTML;
      let paginatedHTML = '';

      for (let i = 0; i < totalPages; i++) {
        paginatedHTML += `
          <div class="pdf-header-mpcc">
            <div class="pdf-header-topbar">
              <div class="pdf-header-topbar-left">
                <div class="pdf-header-label pdf-header-blue">ई-मेल: 'कांग्रेस'</div>
                <div class="pdf-header-label">E-mail: orgmpcct1@gmail.com</div>
                <div class="pdf-header-label">www.mpcongress.org</div>
              </div>
              <div><img src="${downloadImg}" alt="Logo" class="pdf-header-logo-main" /></div>
              <div class="pdf-header-topbar-right">
                <div class="pdf-header-label pdf-header-blue">कार्यालय = 0755-2551512</div>
                <div class="pdf-header-label">0755-2555452</div>
                <div class="pdf-header-label">फैक्स = 0755-2577981</div>
              </div>
            </div>
            <div class="pdf-header-row pdf-header-center">
              <div class="pdf-header-title-col">
                <div class="pdf-header-title pdf-hindi-text">मध्यप्रदेश कांग्रेस कमेटी</div>
                <div class="pdf-header-address pdf-hindi-text">इंदिरा भवन, शिवाजी नगर, भोपाल-462 016 (म.प्र.)</div>
              </div>
            </div>
          </div>
          <br/>
          <hr class="pdf-header-divider" />
        `;


        if (i === 0 && headerHtml) {
          paginatedHTML += headerHtml;
        }



        const pageRows = rows.slice(i * rowsPerPage, (i + 1) * rowsPerPage);
        if (element.querySelector('table')) {
          const table = element.querySelector('table').cloneNode(true);
          const tbody = table.querySelector('tbody');
          if (tbody) {
            tbody.innerHTML = '';
            pageRows.forEach(row => tbody.appendChild(row.cloneNode(true)));
          }
          paginatedHTML += table.outerHTML;
        } else if (element.querySelector('ul')) {
          const ul = element.querySelector('ul').cloneNode(false);
          pageRows.forEach(row => ul.appendChild(row.cloneNode(true)));
          paginatedHTML += ul.outerHTML;
        } else {
          pageRows.forEach(row => paginatedHTML += row.outerHTML);
        }

        if (i < totalPages - 1) {
          paginatedHTML += '<div style="page-break-after: always; break-after: page;"></div>';
        }
      }

      const originalContent = element.innerHTML;
      element.innerHTML = paginatedHTML;

      const images = element.querySelectorAll('img');
      await Promise.all(Array.from(images).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.onload = img.onerror = resolve;
        });
      }));

      html2pdf().from(element).set({
        margin: 0.5,
        filename,
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
      }).save().then(() => {
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
    <div className="inline-block relative">
      <button
        className="report-btn bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 transition"
        onClick={handlePDF}
        type="button"
        disabled={isLoading}
      >
        {children || 'Download'}
      </button>

      {isLoading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-[#1a237e] rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default PdfExportButton;
