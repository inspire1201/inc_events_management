import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';

const Modal = ({ children, onClose }) => {
    return (
        <div style={styles.overlay} onClick={onClose}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: 'rgba(0,0,0,0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        width: '90%',
        height: '90%',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        padding: '10px 15px',
        background: '#f1f1f1',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    closeButton: {
        cursor: 'pointer',
        border: 'none',
        background: 'transparent',
        fontSize: '20px',
    },
};

const PDFDownloadSection = ({
    event,
    apiUrl,
    showViewButton = true,
    showDownloadButton = true,
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadStatus, setDownloadStatus] = useState('');
    const [pdfViewerOpen, setPdfViewerOpen] = useState(false);

    const pdfUrl = event.pdf
        ? event.pdf.startsWith('http')
            ? event.pdf
            : `${apiUrl}${event.pdf}`
        : '';

    const handleDownloadPdf = async () => {
        if (!pdfUrl) return;
        setIsDownloading(true);
        setDownloadStatus('Downloading...');
        try {
            const response = await fetch(pdfUrl);
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = `event-${event.id}-document.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
            setDownloadStatus('Download completed!');
        } catch (err) {
            console.error('Download failed:', err);
            setDownloadStatus('Download failed. Please try again.');
        } finally {
            setIsDownloading(false);
            setTimeout(() => setDownloadStatus(''), 3000);
        }
    };

    const handleViewPdf = () => {
        if (pdfUrl) setPdfViewerOpen(true);
    };

    return (
        <div className="event-pdf-section">
            <h3>Attached PDF</h3>

            {pdfUrl && (showViewButton || showDownloadButton) && (
                <div className="pdf-actions">
                    {showViewButton && (
                        <button onClick={handleViewPdf} className="pdf-button view-pdf">
                            <FileText size={16} />
                            <span>View PDF</span>
                        </button>
                    )}
                    {showDownloadButton && (
                        <button
                            onClick={handleDownloadPdf}
                            className="pdf-button download-pdf"
                            disabled={isDownloading}
                        >
                            <Download size={16} />
                            <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
                        </button>
                    )}
                </div>
            )}

            {downloadStatus && (
                <div
                    className={`download-status ${downloadStatus.includes('failed') ? 'error' : 'success'
                        }`}
                >
                    {downloadStatus}
                </div>
            )}

            {pdfViewerOpen && (
                <Modal onClose={() => setPdfViewerOpen(false)}>
                    <div style={styles.header}>
                        <span>PDF Document</span>
                        <button
                            onClick={() => setPdfViewerOpen(false)}
                            style={styles.closeButton}
                        >
                            &times;
                        </button>
                    </div>
                    <div style={styles.content}>
                        <iframe
                            src={pdfUrl}
                            title="PDF Document"
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        />
                    </div>
                </Modal>
            )}
        </div>
    );
};


export default PDFDownloadSection;
