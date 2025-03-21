import { Request, Response } from 'express';
import { News, User } from '../models';
import ExcelService from '../services/excel.service';
import PdfService from '../services/pdf.service';

export default class ExportController {
  static async exportData(req: Request, res: Response) {
    try {
      const user = await User.findByPk(req.user.id);
      const news = await News.findAll();

      const fileName = `reporte-${Date.now()}`;
      
      switch (req.params.type) {
        case 'excel':
          const workbook = await ExcelService.generateNewsReport(news);
          res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileName}.xlsx`
          );
          await workbook.xlsx.write(res);
          break;

        case 'pdf':
          const pdfDoc = PdfService.generateNewsReport(news);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader(
            'Content-Disposition',
            `attachment; filename=${fileName}.pdf`
          );
          pdfDoc.pipe(res);
          pdfDoc.end();
          break;

        default:
          res.status(400).json({ error: 'Tipo de exportación no válido' });
      }

      // Registrar en DB
      await Export.create({
        userId: user.id,
        type: req.params.type.toUpperCase(),
        fileName: `${fileName}.${req.params.type}`
      });

    } catch (error) {
      res.status(500).json({ error: 'Error en la exportación' });
    }
  }
}