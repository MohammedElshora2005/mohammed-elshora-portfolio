// Mohammed_Portfolio\frontend\src\components\ViewsCounter.jsx

import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';

const ViewsCounter = () => {
  const [views, setViews] = useState(0);

  useEffect(() => {
    let count = localStorage.getItem('siteViews');
    if (count) {
      count = parseInt(count);
      setViews(count);
    } else {
      setViews(1);
      localStorage.setItem('siteViews', '1');
    }

    const hasVisited = sessionStorage.getItem('hasVisited');
    if (!hasVisited) {
      const newCount = (parseInt(localStorage.getItem('siteViews')) || 0) + 1;
      localStorage.setItem('siteViews', newCount.toString());
      setViews(newCount);
      sessionStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <div className="views-counter">
      <FaEye /> {views.toLocaleString()} views
    </div>
  );
};

export default ViewsCounter;