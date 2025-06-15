import React from 'react';
import { Download, Share2, Award, Calendar, CheckCircle } from 'lucide-react';
import { Certificate } from '../../types';

interface CertificateGeneratorProps {
  certificate: Certificate;
  onDownload: () => void;
  onShare: () => void;
}

const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({ 
  certificate, 
  onDownload, 
  onShare 
}) => {
  const generateCertificatePDF = async () => {
    try {
      // Dynamic import to avoid bundle size issues
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;

      const certificateElement = document.getElementById('certificate-preview');
      if (!certificateElement) return;

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`certificate-${certificate.courseName.replace(/\s+/g, '-').toLowerCase()}.pdf`);
      
      onDownload();
    } catch (error) {
      console.error('Error generating certificate PDF:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Certificate</h2>
        <p className="text-gray-600">Congratulations on completing the course!</p>
      </div>

      {/* Certificate Preview */}
      <div 
        id="certificate-preview"
        className="bg-white border-8 border-yellow-400 rounded-lg p-12 mb-6 shadow-lg"
        style={{ aspectRatio: '4/3' }}
      >
        <div className="text-center h-full flex flex-col justify-between">
          {/* Header */}
          <div>
            <div className="mb-6">
              <Award className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Certificate of Completion</h1>
              <div className="w-32 h-1 bg-yellow-400 mx-auto"></div>
            </div>

            {/* Content */}
            <div className="mb-8">
              <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
              <h2 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-gray-300 pb-2 inline-block">
                [Student Name]
              </h2>
              <p className="text-lg text-gray-600 mb-2">has successfully completed the course</p>
              <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                {certificate.courseName}
              </h3>
              <p className="text-lg text-gray-600">
                instructed by <span className="font-semibold">{certificate.instructorName}</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end">
            <div className="text-left">
              <div className="border-t-2 border-gray-300 pt-2 w-48">
                <p className="text-sm text-gray-600">Instructor Signature</p>
                <p className="font-semibold text-gray-800">{certificate.instructorName}</p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              </div>
              <p className="text-sm text-gray-600">Verification Code</p>
              <p className="font-mono text-sm font-semibold text-gray-800">
                {certificate.verificationCode}
              </p>
            </div>
            
            <div className="text-right">
              <div className="border-t-2 border-gray-300 pt-2 w-48">
                <p className="text-sm text-gray-600">Date of Completion</p>
                <p className="font-semibold text-gray-800">
                  {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Details */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificate Details</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Issued:</span>
            <span className="font-medium">
              {new Date(certificate.issuedAt).toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Grade:</span>
            <span className="font-medium">{certificate.grade || 'Pass'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Verification:</span>
            <span className="font-mono text-sm">{certificate.verificationCode}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">Course ID:</span>
            <span className="font-mono text-sm">{certificate.courseId}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={generateCertificatePDF}
          className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download className="h-5 w-5" />
          <span>Download PDF</span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium"
        >
          <Share2 className="h-5 w-5" />
          <span>Share Certificate</span>
        </button>
      </div>

      {/* Verification Notice */}
      <div className="mt-6 text-center text-sm text-gray-600">
        <p>
          This certificate can be verified at{' '}
          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
            learnhub.com/verify/{certificate.verificationCode}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CertificateGenerator;