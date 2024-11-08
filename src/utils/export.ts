import { jsPDF } from 'jspdf';
import Papa from 'papaparse';
import { GeneratedAd } from '@/stores/historyStore';

export const exportToPDF = (ads: GeneratedAd[]) => {
  const doc = new jsPDF();
  let yPos = 20;
  const margin = 20;
  const pageHeight = doc.internal.pageSize.height;

  ads.forEach((ad, index) => {
    // Add page break if needed
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    // Add title
    doc.setFontSize(16);
    doc.text(`Ad #${index + 1}`, margin, yPos);
    yPos += 10;

    // Add content
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date(ad.timestamp).toLocaleString()}`, margin, yPos);
    yPos += 10;

    doc.text('Original Input:', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`Title: ${ad.originalInput.title}`, margin + 5, yPos);
    yPos += 7;
    
    // Handle long descriptions with word wrap
    const descLines = doc.splitTextToSize(
      `Description: ${ad.originalInput.description}`,
      doc.internal.pageSize.width - 2 * margin
    );
    doc.text(descLines, margin + 5, yPos);
    yPos += 7 * descLines.length;

    doc.text(`Keywords: ${ad.originalInput.keywords.join(', ')}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Tone: ${ad.originalInput.tone}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Target Audience: ${ad.originalInput.targetAudience}`, margin + 5, yPos);
    yPos += 10;

    // Generated content
    doc.setFontSize(12);
    doc.text('Generated Content:', margin, yPos);
    yPos += 7;
    doc.setFontSize(10);
    doc.text(`Title: ${ad.generatedContent.title}`, margin + 5, yPos);
    yPos += 7;

    const genDescLines = doc.splitTextToSize(
      `Description: ${ad.generatedContent.description}`,
      doc.internal.pageSize.width - 2 * margin
    );
    doc.text(genDescLines, margin + 5, yPos);
    yPos += 7 * genDescLines.length;

    if (ad.generatedContent.variations.length > 0) {
      doc.text('Variations:', margin + 5, yPos);
      yPos += 7;
      ad.generatedContent.variations.forEach((variation, i) => {
        const varLines = doc.splitTextToSize(
          `${i + 1}. ${variation}`,
          doc.internal.pageSize.width - 2 * (margin + 5)
        );
        doc.text(varLines, margin + 10, yPos);
        yPos += 7 * varLines.length;
      });
    }

    yPos += 15; // Space between ads
  });

  doc.save('ad-history.pdf');
};

export const exportToCSV = (ads: GeneratedAd[]) => {
  const data = ads.map(ad => ({
    'Generated Date': new Date(ad.timestamp).toLocaleString(),
    'Original Title': ad.originalInput.title,
    'Original Description': ad.originalInput.description,
    'Keywords': ad.originalInput.keywords.join(', '),
    'Tone': ad.originalInput.tone,
    'Target Audience': ad.originalInput.targetAudience,
    'Generated Title': ad.generatedContent.title,
    'Generated Description': ad.generatedContent.description,
    'Variations': ad.generatedContent.variations.join(' | '),
  }));

  const csv = Papa.unparse(data);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'ad-history.csv');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToText = (ads: GeneratedAd[]) => {
  let content = 'AD COPY GENERATION HISTORY\n';
  content += '=======================\n\n';

  ads.forEach((ad, index) => {
    content += `Ad #${index + 1}\n`;
    content += `Generated: ${new Date(ad.timestamp).toLocaleString()}\n`;
    content += '-----------------------\n\n';

    // Original Input
    content += 'ORIGINAL INPUT:\n';
    content += `Title: ${ad.originalInput.title}\n`;
    content += `Description: ${ad.originalInput.description}\n`;
    content += `Keywords: ${ad.originalInput.keywords.join(', ')}\n`;
    content += `Tone: ${ad.originalInput.tone}\n`;
    content += `Target Audience: ${ad.originalInput.targetAudience}\n\n`;

    // Generated Content
    content += 'GENERATED CONTENT:\n';
    content += `Title: ${ad.generatedContent.title}\n`;
    content += `Description: ${ad.generatedContent.description}\n`;

    if (ad.generatedContent.variations.length > 0) {
      content += '\nVariations:\n';
      ad.generatedContent.variations.forEach((variation, i) => {
        content += `${i + 1}. ${variation}\n`;
      });
    }

    content += '\n======================\n\n';
  });

  // Create and download the file
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', 'ad-history.txt');
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 