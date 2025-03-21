import { useState } from "react";

const ExcelSection = () => {
  const [excels, setExcels] = useState<File[]>([]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newExcels = Array.from(files).filter(file => 
      file.type.includes('excel') || file.type.includes('spreadsheet')
    );
    
    setExcels([...excels, ...newExcels]);
  };

  return (
    <div>
      <div className="mb-4">
        <input 
          type="file" 
          accept=".xls,.xlsx" 
          multiple
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
        <p className="text-sm text-gray-500 mt-1">Formatos permitidos: .xls, .xlsx</p>
      </div>

      <div className="space-y-2">
        {excels.map((excel, index) => (
          <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <span className="text-gray-700">{excel.name}</span>
            <button 
              onClick={() => setExcels(excels.filter((_, i) => i !== index))}
              className="text-red-500"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExcelSection;