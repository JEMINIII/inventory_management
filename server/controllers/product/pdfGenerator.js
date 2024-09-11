import PDFKit from 'pdfkit';
import fs from 'fs';

export const generateInvoice = (data) => {
  const doc = new PDFKit();
  doc.pipe(fs.createWriteStream('invoice.pdf'));

  // Add content to PDF
  doc.text(`Product: ${data.product_name}`);
  doc.text(`Quantity: ${data.quantity}`);
  doc.text(`Total Amount: ${data.totalAmount}`);

  doc.end();
};
