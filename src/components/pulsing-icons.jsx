import '@/styles/animations.css';
import React, { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';

export default function PulsingIcons({ icons, className, ...props }) {
  const [columnData, setColumnData] = useState([]);

  // Adjust the number of columns and rows based on the window width and height
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const newColumns = Math.max(2, Math.floor(width / 400)); // Adjust divisor for desired column width

      const height = window.innerHeight;
      const newRows = Math.max(2, Math.floor(height / 200)); // Adjust divisor for desired row innerHeight

      const iconsKeys = Object.keys(icons);

      const newColumnData = Array.from({ length: newColumns }, () => {
        return Array.from({ length: newRows }, () => {
          const randomIndex = Math.floor(Math.random() * iconsKeys.length);
          const randomElement = iconsKeys[randomIndex];
          return randomElement;
        });
      });

      setColumnData(newColumnData);
    };

    handleResize(); // Set initial columns
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [icons]);

  return (
    <div className={cn('flex h-full w-full justify-around', className)} >
      {/* Container for the columns */}
      {columnData.map((column, colIndex) => (
        <div key={colIndex} className="flex flex-col items-center justify-start overflow-hidden" >
          {/* Container for the rows */}
          {column.map((iconKey, rowIndex) => (
            <div
              key={rowIndex}
              className="relative flex flex-1 items-center justify-center h-full w-24 pulse"
            >
              {/* Icon */}
              {icons[iconKey] && React.createElement(icons[iconKey])}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
