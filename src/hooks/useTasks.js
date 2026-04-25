// useTasks.js — CRUD operations for tasks table
// RLS automatically scopes all queries to the logged-in user
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

export function useTasks(date) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch tasks for the given date
  const fetchTasks = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('date', date)
      .order('created_at', { ascending: true });

    if (error) setError(error.message);
    else setTasks(data || []);
    setLoading(false);
  }, [date]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  // Add a new task — optimistic update so UI reflects the change instantly
  const addTask = async ({ title, subject, notes }) => {
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Build a temporary task object and add it to state right away
    const tempId = `temp-${Date.now()}`;
    const optimisticTask = {
      id: tempId,
      user_id: user.id,
      date,
      title: title.trim(),
      subject: subject.trim(),
      notes: notes?.trim() || null,
      completed: false,
      created_at: new Date().toISOString(),
    };
    setTasks(prev => [...prev, optimisticTask]);

    // 2. Persist to Supabase and replace the temp entry with the real one
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        date,
        title: title.trim(),
        subject: subject.trim(),
        notes: notes?.trim() || null,
        completed: false,
      })
      .select()
      .single();

    if (error) {
      // Roll back the optimistic entry on failure
      setTasks(prev => prev.filter(t => t.id !== tempId));
      throw error;
    }
    // Swap temp entry with the confirmed record from Supabase
    setTasks(prev => prev.map(t => t.id === tempId ? data : t));
  };


  // Toggle completion (simple toggle or clear proof)
  const toggleTask = async (id, completed) => {
    const updates = { completed: !completed };
    if (completed) updates.proof_urls = null; // Clear all proofs if unmarking as complete

    const { error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id);
    if (error) throw error;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  // Complete with multiple proof uploads
  const completeWithProof = async (id, files) => {
    const { data: { user } } = await supabase.auth.getUser();
    const uploadedUrls = [];

    // 1. Loop through all selected files
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${id}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `proofs/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('proofs')
        .upload(filePath, file);

      if (uploadError) continue; // Skip if one fails, or handle error

      // Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('proofs')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicUrl);
    }

    if (uploadedUrls.length === 0) return;

    // 2. Update Task with the array of URLs
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        completed: true,
        proof_urls: uploadedUrls // Store as array
      })
      .eq('id', id);

    if (updateError) throw updateError;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true, proof_urls: uploadedUrls } : t));
  };



  // Update a task
  const updateTask = async (id, updates) => {
    const { error } = await supabase
      .from('tasks')
      .update({ ...updates })
      .eq('id', id);
    if (error) throw error;
    await fetchTasks();
  };

  // Delete a task
  const deleteTask = async (id) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    if (error) throw error;
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const totalCount = tasks.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return { tasks, loading, error, addTask, toggleTask, completeWithProof, updateTask, deleteTask, completedCount, totalCount, percentage, refetch: fetchTasks };
}
