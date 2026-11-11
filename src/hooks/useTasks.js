import { useCallback, useEffect, useReducer, useRef, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { taskReducer } from '../reducers/taskReducer';
import { INITIAL_TASKS } from '../lib/initialData';

export const useTasks = () => {
  const [tasks, dispatch] = useReducer(taskReducer, []);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const nameInputRef = useRef(null);

  // Load tasks from Supabase, fallback to initial data
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          dispatch({ type: 'SET_TASKS', payload: data });
        } else {
          // Seed initial data
          const { data: seeded } = await supabase.from('tasks').insert(INITIAL_TASKS).select();
          dispatch({ type: 'SET_TASKS', payload: seeded || INITIAL_TASKS });
        }
      } catch {
        dispatch({ type: 'SET_TASKS', payload: INITIAL_TASKS });
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // useEffect: monitor search keyword
  useEffect(() => {
    console.log('[Tugasin] Keyword pencarian berubah:', search);
  }, [search]);

  // useMemo: hitung ringkasan
  const summary = useMemo(() => ({
    total: tasks.length,
    belum: tasks.filter((t) => t.status === 'Belum Dikerjakan').length,
    selesai: tasks.filter((t) => t.status === 'Selesai').length,
  }), [tasks]);

  // useMemo: filter tasks
  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    const kw = search.toLowerCase();
    return tasks.filter(
      (t) =>
        t.nama_tugas.toLowerCase().includes(kw) ||
        t.mata_kuliah.toLowerCase().includes(kw)
    );
  }, [tasks, search]);

  // useCallback: tambah tugas
  const addTask = useCallback(async (taskData) => {
    const newTask = { ...taskData, status: 'Belum Dikerjakan' };
    try {
      const { data, error } = await supabase.from('tasks').insert([newTask]).select().single();
      if (error) throw error;
      dispatch({ type: 'ADD_TASK', payload: data });
    } catch {
      const localTask = { ...newTask, id: Date.now().toString() };
      dispatch({ type: 'ADD_TASK', payload: localTask });
    }
    setTimeout(() => nameInputRef.current?.focus(), 100);
  }, []);

  // useCallback: hapus tugas
  const deleteTask = useCallback(async (id) => {
    dispatch({ type: 'DELETE_TASK', payload: id });
    try {
      await supabase.from('tasks').delete().eq('id', id);
    } catch {}
  }, []);

  // useCallback: toggle status
  const toggleStatus = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const newStatus = task.status === 'Selesai' ? 'Belum Dikerjakan' : 'Selesai';
    dispatch({ type: 'TOGGLE_STATUS', payload: id });
    try {
      await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
    } catch {}
  }, [tasks]);

  // useCallback: reset semua tugas
  const resetTasks = useCallback(async () => {
    try {
      await supabase.from('tasks').delete().neq('id', '');
      const { data } = await supabase.from('tasks').insert(INITIAL_TASKS).select();
      dispatch({ type: 'SET_TASKS', payload: data || INITIAL_TASKS });
    } catch {
      dispatch({ type: 'RESET_TASKS' });
    }
  }, []);

  return {
    tasks,
    filteredTasks,
    search,
    setSearch,
    summary,
    loading,
    addTask,
    deleteTask,
    toggleStatus,
    resetTasks,
    nameInputRef,
  };
};
