import React, { useState } from 'react';
import AdminSidebar from '../components/admincomponets/AdminSidebar';
import AdminLayout from '../components/admincomponets/AdminLayout';
import AdminHeader from '../components/admincomponets/AdminHeader';
import NewsForm from '../components/admincomponets/NewForm';
import DocumentUpload from '../components/admincomponets/DocumentUpload';


type Section = 'news' | 'pdfs' | 'excel';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image: string;
}

interface DocumentItem {
  id: string;
  name: string;
}

const AdminPage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<Section>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [pdfs, setPdfs] = useState<DocumentItem[]>([]);
  const [excels, setExcels] = useState<DocumentItem[]>([]);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);

  // Manejo de Noticias
  const handleNewsSubmit = (data: Omit<NewsItem, 'id'>) => {
    if (editingNews) {
      setNews(news.map(item => 
        item.id === editingNews.id ? { ...data, id: item.id } : item
      ));
    } else {
      setNews([...news, { ...data, id: Date.now().toString() }]);
    }
    setEditingNews(null);
  };

  // Manejo de Documentos
  const handleDocumentUpload = (file: File, type: 'pdfs' | 'excel') => {
    const newDoc = {
      id: Date.now().toString(),
      name: file.name
    };
    
    type === 'pdfs' 
      ? setPdfs(prev => [...prev, newDoc])
      : setExcels(prev => [...prev, newDoc]);
  };

  // Eliminar elementos
  const handleDelete = (id: string) => {
    const deleteMap = {
      news: () => setNews(news.filter(item => item.id !== id)),
      pdfs: () => setPdfs(pdfs.filter(doc => doc.id !== id)),
      excel: () => setExcels(excels.filter(doc => doc.id !== id))
    };
    
    deleteMap[currentSection]();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        currentSection={currentSection} 
        onSectionChange={setCurrentSection} 
      />
      
      <div className="ml-64 flex-1 p-8">
        <AdminHeader />
        
        <AdminLayout>
          <div className="space-y-6">
            {/* Sección de Formularios */}
            {currentSection === 'news' && (
              <NewsForm
                initialData={editingNews || undefined}
                onSubmit={handleNewsSubmit}
                onCancel={() => setEditingNews(null)}
              />
            )}
            
            {currentSection === 'pdfs' && (
              <DocumentUpload
                accept=".pdf"
                onUpload={(file) => handleDocumentUpload(file, 'pdfs')}
                label="Subir nuevo PDF"
              />
            )}
            
            {currentSection === 'excel' && (
              <DocumentUpload
                accept=".xlsx,.xls"
                onUpload={(file) => handleDocumentUpload(file, 'excel')}
                label="Subir nuevo Excel"
              />
            )}
            
            {/* Listado de Elementos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(currentSection === 'news' ? news : 
               currentSection === 'pdfs' ? pdfs : excels).map((item) => (
                <div 
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  {currentSection === 'news' && (
                    <>
                      {(item as NewsItem).image && (
                        <img
                          src={(item as NewsItem).image}
                          alt={(item as NewsItem).title}
                          className="w-full h-48 object-cover rounded mb-3"
                        />
                      )}
                      <h3 className="font-semibold text-lg mb-2">
                        {(item as NewsItem).title}
                      </h3>
                      <p className="text-gray-800 line-clamp-3 mb-4 ">
                        {(item as NewsItem).content}
                      </p>
                    </>
                  )}
                  
                  <div className="flex justify-between items-center text-gray-800">
                    <span className="truncate">
                      {currentSection === 'news' 
                        ? (item as NewsItem).title 
                        : (item as DocumentItem).name}
                    </span>
                    <div className="flex gap-2">
                      {currentSection === 'news' && (
                        <button
                          onClick={() => setEditingNews(item as NewsItem)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Editar
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AdminLayout>
      </div>
    </div>
  );
};

export default AdminPage;