// Mohammed_Portfolio\frontend\src\components\ViewsCounter.jsx

import React, { useState, useEffect } from 'react';
import { FaEye } from 'react-icons/fa';
import { supabase } from '../supabase';

const ViewsCounter = () => {
  const [views, setViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateViews = async () => {
      try {
        // ✅ جيب العدد الحالي من Supabase
        const { data, error } = await supabase
          .from('site_views')
          .select('count')
          .limit(1);
        
        if (error) throw error;
        
        let currentCount = 0;
        if (data && data.length > 0) {
          currentCount = data[0].count || 0;
        }
        
        // ✅ زود العدد بـ 1
        const newCount = currentCount + 1;
        
        // ✅ احفظ العدد الجديد في Supabase
        const { error: updateError } = await supabase
          .from('site_views')
          .upsert({
            id: 1,
            count: newCount,
            updated_at: new Date()
          });
        
        if (updateError) throw updateError;
        
        setViews(newCount);
        
      } catch (error) {
        console.error('❌ Error updating views:', error);
        
        // ✅ Fallback: localStorage لو حصل مشكلة
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
      } finally {
        setLoading(false);
      }
    };
    
    updateViews();
  }, []);

  if (loading) {
    return (
      <div className="views-counter">
        <FaEye /> ...
      </div>
    );
  }

  return (
    <div className="views-counter">
      <FaEye /> {views.toLocaleString()} views
    </div>
  );
};

export default ViewsCounter;
