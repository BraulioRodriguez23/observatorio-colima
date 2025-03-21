import ExcelJS from 'exceljs';
import { News } from '../models/news.model';

export default class ExcelService {
  static async generateNewsReport(news: News[]) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte de Noticias');

    // Estilos
    worksheet.properties.defaultRowHeight = 20;
    
    // Columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Título', key: 'title', width: 35 },
      { header: 'Contenido', key: 'content', width: 60 },
      { header: 'Autor', key: 'author', width: 25 },
      { header: 'Fecha', key: 'date', width: 15 }
    ];

    // Datos
    news.forEach(article => {
      worksheet.addRow({
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author?.email || 'Anónimo',
        date: article.createdAt.toLocaleDateString('es-MX')
      });
    });

    return workbook;
  }
}