import React from "react";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  metadata?: { author: string; date: string };
}

interface Props {
  news: NewsItem[];
  onEdit: (item: NewsItem) => void;
  onDelete: (id: string) => void;
}

const NewsList: React.FC<Props> = ({ news, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {news.map((item) => (
      <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover rounded mb-3" />}
        <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
        <p className="text-gray-800 line-clamp-3 mb-4">{item.content}</p>
        <div className="flex justify-between items-center">
          <button onClick={() => onEdit(item)} className="text-blue-500 hover:text-blue-700">Editar</button>
          <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700">Eliminar</button>
        </div>
      </div>
    ))}
  </div>
);

export default NewsList;
