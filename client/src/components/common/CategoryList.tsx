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
    const colorSchemes = [
      {
        bg: 'bg-blue-600',
        text: 'text-white',
        hover: 'hover:bg-blue-700'
      },
      {
        bg: 'bg-emerald-600',
        text: 'text-white',
        hover: 'hover:bg-emerald-700'
      },
      {
        bg: 'bg-purple-600',
        text: 'text-white',
        hover: 'hover:bg-purple-700'
      },
      {
        bg: 'bg-amber-600',
        text: 'text-white',
        hover: 'hover:bg-amber-700'
      },
      {
        bg: 'bg-rose-600',
        text: 'text-white',
        hover: 'hover:bg-rose-700'
      },
      {
        bg: 'bg-cyan-600',
        text: 'text-white',
        hover: 'hover:bg-cyan-700'
      },
      {
        bg: 'bg-indigo-600',
        text: 'text-white',
        hover: 'hover:bg-indigo-700'
      },
      {
        bg: 'bg-teal-600',
        text: 'text-white',
        hover: 'hover:bg-teal-700'
      }
    ];
    
    const hash = name.split('').reduce((acc, char, i) => {
      return char.charCodeAt(0) + ((acc << 5) - acc) + i;
    }, 0);
    
    const scheme = colorSchemes[Math.abs(hash) % colorSchemes.length];
    return `${scheme.bg} ${scheme.text} ${scheme.hover}`;
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
            className={`px-3 py-1.5 rounded-full text-sm font-medium 
              transition-colors duration-200 
              ${getCategoryColor(category)}`}
          >
            {category}
          </button>
        ))}
        
        {hasMoreCategories && !isExpanded && (
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm 
              font-medium bg-gray-600 text-white hover:bg-gray-700 
              transition-colors duration-200"
          >
            <span>{moreCount} more</span>
            <ChevronDown size={16} />
          </button>
        )}
        
        {isExpanded && hasMoreCategories && (
          <button
            onClick={handleCollapseClick}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm 
              font-medium bg-gray-600 text-white hover:bg-gray-700 
              transition-colors duration-200"
          >
            <span>Show less</span>
            <ChevronUp size={16} />
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
              className={`px-3 py-1.5 rounded-full text-sm font-medium 
                ${getCategoryColor(category)}`}
            >
              {category}
            </button>
          ))}
          <button
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-sm 
              font-medium bg-gray-600 text-white"
          >
            <span>99 more</span>
            <ChevronDown size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;