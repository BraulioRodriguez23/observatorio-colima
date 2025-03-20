import React, { ChangeEvent } from "react";
// seleccionar seccion a donde va el excel
interface DocumentUploadProps {
  accept: string;
  onUpload: (file: File) => void;
  label: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ accept, onUpload, label }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
      e.target.value = ''; // Reset input
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-8">
      <label className="block text-lg font-semibold mb-4">{label}</label>
      <div className="flex items-center gap-4">
        <input
          type="file"
          onChange={handleFileChange}
          accept={accept}
          className="flex-1 p-2 border rounded file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
    </div>
  );
};

export default DocumentUpload;