import React from "react";

type Section = 'news' | 'pdfs' | 'excel';

interface AdminSidebarProps {
  currentSection: Section;
  onSectionChange: (section: Section) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentSection, onSectionChange }) => {
  const sections = [
    { id: 'news', label: 'Noticias' },
    { id: 'pdfs', label: 'PDFs' },
    { id: 'excel', label: 'Excels' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg fixed h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-700">Panel de Admin</h2>
      </div>
      <nav className="p-4 space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => onSectionChange(section.id as Section)}
            className={`w-full text-left p-3 rounded-lg transition-all ${
              currentSection === section.id 
              ? 'bg-blue-100 text-blue-600 font-semibold' 
              : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            {section.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;