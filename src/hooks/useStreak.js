// useStreak.js — Calculates consecutive days with at least 1 completed task
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  const calcStreak = async () => {
    // Fetch all distinct dates that have at least one completed task for this user
    const { data, error } = await supabase
      .from('tasks')
      .select('date')
      .eq('completed', true);

    if (error || !data) { setLoading(false); return; }

    // Get unique dates sorted descending
    const uniqueDates = [...new Set(data.map(r => r.date))].sort((a, b) => b.localeCompare(a));

    if (uniqueDates.length === 0) {
      setStreak(0);
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // If the most recent completion is NOT today AND NOT yesterday, streak is broken
    if (uniqueDates[0] !== today && uniqueDates[0] !== yesterday) {
      setStreak(0);
      setLoading(false);
      return;
    }

    let count = 0;
    let currentCheckDate = new Date(uniqueDates[0]);

    for (let i = 0; i < uniqueDates.length; i++) {
      const dateStr = uniqueDates[i];
      const expectedDate = new Date(uniqueDates[0]);
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (dateStr === expectedDateStr) {
        count++;
      } else {
        break;
      }
    }

    setStreak(count);
    setLoading(false);
  };

  useEffect(() => {
    calcStreak();

    // ── Real-time listener for task changes ───────────────────────────────
    // This ensures the streak updates instantly when a task is toggled
    const channel = supabase
      .channel('streak-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
        calcStreak();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);


  return { streak, loading };
}
