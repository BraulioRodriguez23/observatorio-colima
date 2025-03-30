import React, { ChangeEvent, useState } from "react";

interface NewsFormProps {
  initialData?: { 
    title: string; 
    content: string; 
    imageUrl?: string 
  };
  onSubmit: (data: { 
    title: string; 
    content: string; 
    image?: File;
    imageUrl?: string 
  }) => void;
  onCancel: () => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    content: initialData?.content || '',
    image: undefined as File | undefined,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imageUrl || null
  );
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));

      // Show preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    const { title, content, image } = formData;
    
    try {
      setIsUploading(true);
      onSubmit({ 
        title, 
        content, 
        image,
        imageUrl: initialData?.imageUrl // Pass existing URL if editing
      });
      
      // Reset form
      setFormData({ title: '', content: '', image: undefined });
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white">
        {initialData ? 'Editar Noticia' : 'Nueva Noticia'}
      </h2>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />

        <textarea
          placeholder="Contenido"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="w-full p-2 border rounded h-32 focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="flex-1 p-2 border rounded bg-white"
            disabled={isUploading}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-12 h-12 rounded object-cover"
            />
          )}
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            disabled={isUploading}
            className="px-4 py-2 text-gray-300 hover:bg-gray-700 rounded disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {initialData ? 'Actualizando...' : 'Publicando...'}
              </span>
            ) : (
              initialData ? 'Actualizar' : 'Publicar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;