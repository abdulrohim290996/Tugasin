import { INITIAL_TASKS } from '../lib/initialData';

export const taskReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TASKS':
      return action.payload;
    case 'ADD_TASK':
      return [action.payload, ...state];
    case 'DELETE_TASK':
      return state.filter((t) => t.id !== action.payload);
    case 'TOGGLE_STATUS':
      return state.map((t) =>
        t.id === action.payload
          ? { ...t, status: t.status === 'Selesai' ? 'Belum Dikerjakan' : 'Selesai' }
          : t
      );
    case 'RESET_TASKS':
      return INITIAL_TASKS;
    default:
      return state;
  }
};
