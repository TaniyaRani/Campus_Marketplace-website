import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Laptop, 
  Home, 
  Compass, 
  Bike, 
  PenTool, 
  Shirt, 
  Dumbbell,
  Package
} from 'lucide-react';

const iconMap = {
  BookOpen,
  Laptop,
  Home,
  Compass,
  Bike,
  PenTool,
  Shirt,
  Dumbbell
};

const CategoryCard = ({ category }) => {
  const navigate = useNavigate();
  const IconComponent = iconMap[category.icon] || Package;

  return (
    <div
      onClick={() => navigate(`/products?category=${category.id}`)}
      className="group cursor-pointer p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400/80 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-200 transform hover:-translate-y-1 flex flex-col items-center text-center relative overflow-hidden"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 transition-transform duration-200 group-hover:scale-110 ${category.color || 'bg-indigo-50 text-indigo-600'}`}>
        <IconComponent className="w-7 h-7" />
      </div>
      <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
        {category.name}
      </h3>
      <span className="text-[11px] font-medium text-slate-400 mt-0.5">
        {category.count} listings
      </span>
    </div>
  );
};

export default CategoryCard;
