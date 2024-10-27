import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface CategoryListProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
  className?: string;
  showAll?: boolean;
}

const CategoryList = ({
  categories,
  onCategoryClick,
  className = '',
  showAll = false
}: CategoryListProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (showAll) return;
    
    const calculateVisibleCount = () => {
      const container = containerRef.current;
      const measure = measureRef.current;
      if (!container || !measure || categories.length === 0) return;

      measure.style.visibility = 'hidden';
      measure.style.display = 'flex';
      
      const containerWidth = container.offsetWidth;
      const items = Array.from(measure.children) as HTMLElement[];
      let currentWidth = 0;
      let count = 0;
      
      const moreButtonWidth = items[items.length - 1].offsetWidth + 8;
      
      for (let i = 0; i < items.length - 1; i++) {
        const itemWidth = items[i].offsetWidth + 8;
        if (currentWidth + itemWidth + moreButtonWidth > containerWidth) break;
        currentWidth += itemWidth;
        count++;
      }
      
      measure.style.display = 'none';
      
      if (count > 0 && count !== visibleCount) {
        setVisibleCount(count);
      }
    };

    calculateVisibleCount();
    
    window.addEventListener('resize', calculateVisibleCount);
    return () => window.removeEventListener('resize', calculateVisibleCount);
  }, [categories, visibleCount, showAll]);

  const handleCategoryClick = (e: React.MouseEvent, category: string) => {
    e.stopPropagation();
    onCategoryClick(category);
  };

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
  };

  const handleCollapseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const getCategoryColor = (name: string) => {
    const colors = [
      'bg-blue-500/20 text-blue-200 hover:bg-blue-500/30',
      'bg-green-500/20 text-green-200 hover:bg-green-500/30',
      'bg-purple-500/20 text-purple-200 hover:bg-purple-500/30',
      'bg-orange-500/20 text-orange-200 hover:bg-orange-500/30',
      'bg-pink-500/20 text-pink-200 hover:bg-pink-500/30',
    ];
    
    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  };

  const visibleCategories = showAll || isExpanded 
    ? categories 
    : categories.slice(0, visibleCount);
    
  const hasMoreCategories = !showAll && categories.length > visibleCount;
  const moreCount = categories.length - visibleCount;

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="flex flex-wrap items-center gap-2">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={(e) => handleCategoryClick(e, category)}
            className={`px-2 py-1 rounded-md text-xs font-medium 
              transition-colors duration-200 
              ${getCategoryColor(category)}`}
          >
            {category}
          </button>
        ))}
        
        {hasMoreCategories && !isExpanded && (
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs 
              font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 
              transition-colors duration-200"
          >
            <span>{moreCount} more</span>
            <ChevronDown size={14} />
          </button>
        )}
        
        {isExpanded && hasMoreCategories && (
          <button
            onClick={handleCollapseClick}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs 
              font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 
              transition-colors duration-200"
          >
            <span>Show less</span>
            <ChevronUp size={14} />
          </button>
        )}
      </div>

      {!showAll && (
        <div 
          ref={measureRef} 
          className="absolute flex flex-wrap items-center gap-2" 
          aria-hidden="true"
          style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-2 py-1 rounded-md text-xs font-medium 
                ${getCategoryColor(category)}`}
            >
              {category}
            </button>
          ))}
          <button
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs 
              font-medium bg-gray-700 text-gray-300"
          >
            <span>99 more</span>
            <ChevronDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;