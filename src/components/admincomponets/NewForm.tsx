import React, { ChangeEvent } from "react";

interface NewsFormProps {
  initialData?: { title: string; content: string; image: string };
  onSubmit: (data: { title: string; content: string; image: string }) => void;
  onCancel: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState(initialData || { 
    title: '', 
    content: '', 
    image: '' 
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, image: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? 'Editar Noticia' : 'Nueva Noticia'}
      </h2>
      
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        
        <textarea
          placeholder="Contenido"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500 text-gray-800"
        />
        
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1 p-2 border rounded text-gray-800"
          />
          {formData.image && (
            <img 
              src={formData.image} 
              alt="Preview" 
              className="w-12 h-12 rounded object-cover text-gray-800"
            />
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-800 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSubmit(formData)}
            className="px-4 py-2 bg-blue-500 text-gray-800 rounded hover:bg-blue-600"
          >
            {initialData ? 'Actualizar' : 'Publicar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;