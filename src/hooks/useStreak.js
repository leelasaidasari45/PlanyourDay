// useStreak.js — Calculates consecutive days with at least 1 completed task
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function calcStreak() {
      setLoading(true);
      // Fetch all distinct dates that have at least one completed task for this user
      const { data, error } = await supabase
        .from('tasks')
        .select('date')
        .eq('completed', true);

      if (error || !data) { setLoading(false); return; }

      // Get unique dates sorted descending
      const uniqueDates = [...new Set(data.map(r => r.date))].sort((a, b) => b.localeCompare(a));

      if (uniqueDates.length === 0) { setStreak(0); setLoading(false); return; }

      let count = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      for (let i = 0; i < uniqueDates.length; i++) {
        const d = new Date(uniqueDates[i] + 'T00:00:00');
        const expected = new Date(today);
        expected.setDate(today.getDate() - i);

        if (d.toDateString() === expected.toDateString()) {
          count++;
        } else {
          break;
        }
      }

      setStreak(count);
      setLoading(false);
    }
    calcStreak();
  }, []);

  return { streak, loading };
}
