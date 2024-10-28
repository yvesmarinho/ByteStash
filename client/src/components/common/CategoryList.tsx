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
        bg: 'bg-blue-500/30',
        text: 'text-blue-100',
        hover: 'hover:bg-blue-500/40'
      },
      {
        bg: 'bg-emerald-500/30',
        text: 'text-emerald-100',
        hover: 'hover:bg-emerald-500/40'
      },
      {
        bg: 'bg-purple-500/30',
        text: 'text-purple-100',
        hover: 'hover:bg-purple-500/40'
      },
      {
        bg: 'bg-amber-500/30',
        text: 'text-amber-100',
        hover: 'hover:bg-amber-500/40'
      },
      {
        bg: 'bg-rose-500/30',
        text: 'text-rose-100',
        hover: 'hover:bg-rose-500/40'
      },
      {
        bg: 'bg-cyan-500/30',
        text: 'text-cyan-100',
        hover: 'hover:bg-cyan-500/40'
      },
      {
        bg: 'bg-indigo-500/30',
        text: 'text-indigo-100',
        hover: 'hover:bg-indigo-500/40'
      },
      {
        bg: 'bg-teal-500/30',
        text: 'text-teal-100',
        hover: 'hover:bg-teal-500/40'
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

  if (categories.length === 0) {
    return (
      <div className={`relative ${className}`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400">
            No categories
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={containerRef} className="flex flex-wrap items-center gap-1.5">
        {visibleCategories.map((category) => (
          <button
            key={category}
            onClick={(e) => handleCategoryClick(e, category)}
            className={`px-2 py-0.5 rounded-full text-xs font-medium 
              transition-colors duration-200 
              ${getCategoryColor(category)}`}
          >
            {category}
          </button>
        ))}
        
        {hasMoreCategories && !isExpanded && (
          <button
            onClick={handleExpandClick}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs 
              font-medium bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 
              transition-colors duration-200"
          >
            <span>{moreCount} more</span>
            <ChevronDown size={12} />
          </button>
        )}
        
        {isExpanded && hasMoreCategories && (
          <button
            onClick={handleCollapseClick}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs 
              font-medium bg-gray-500/20 text-gray-300 hover:bg-gray-500/30 
              transition-colors duration-200"
          >
            <span>Show less</span>
            <ChevronUp size={12} />
          </button>
        )}
      </div>

      {!showAll && (
        <div 
          ref={measureRef} 
          className="absolute flex flex-wrap items-center gap-1.5" 
          aria-hidden="true"
          style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              className={`px-2 py-0.5 rounded-full text-xs font-medium 
                ${getCategoryColor(category)}`}
            >
              {category}
            </button>
          ))}
          <button
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs 
              font-medium bg-gray-500/20 text-gray-300"
          >
            <span>99 more</span>
            <ChevronDown size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;