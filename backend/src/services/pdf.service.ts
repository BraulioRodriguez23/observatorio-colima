import PDFDocument from 'pdfkit';
import { News } from '../models/news.model';

export default class PdfService {
  static generateNewsReport(news: News[]) {
    const doc = new PDFDocument({ margin: 50 });
    
    // Encabezado
    doc.fontSize(18)
       .text('Observatorio Turístico de Colima\n', { align: 'center' })
       .fontSize(12)
       .text(`Reporte generado: ${new Date().toLocaleDateString('es-MX')}\n\n`);

    // Tabla
    let y = 150;
    news.forEach((article, index) => {
      doc.font('Helvetica-Bold')
         .text(`${index + 1}. ${article.title}`, 50, y)
         .font('Helvetica')
         .text(`Autor: ${article.author?.email || 'Anónimo'}`, 50, y + 20)
         .text(`Fecha: ${article.createdAt.toLocaleDateString('es-MX')}`, 50, y + 35)
         .text(article.content.substring(0, 200) + '...', 50, y + 50);
      
      y += 100;
      if (y > 700) {
        doc.addPage();
        y = 50;
      }
    });

    return doc;
  }
}