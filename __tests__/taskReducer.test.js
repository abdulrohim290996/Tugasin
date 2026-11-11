const { taskReducer } = require('../src/reducers/taskReducer');

const mockTask = (overrides = {}) => ({
  id: '1',
  nama_tugas: 'Laporan Praktikum',
  mata_kuliah: 'Jaringan Komputer',
  deskripsi: 'Buat laporan hasil praktikum.',
  deadline: '2025-07-20',
  status: 'Belum Dikerjakan',
  ...overrides,
});

describe('taskReducer', () => {
  // ─── ADD_TASK ───────────────────────────────────────────────
  describe('ADD_TASK', () => {
    it('menambahkan tugas baru ke awal array', () => {
      const existing = mockTask({ id: '1' });
      const newTask = mockTask({ id: '2', nama_tugas: 'Tugas Baru' });
      const state = taskReducer([existing], { type: 'ADD_TASK', payload: newTask });
      expect(state).toHaveLength(2);
      expect(state[0]).toEqual(newTask);
    });

    it('menambahkan tugas ke state kosong', () => {
      const newTask = mockTask();
      const state = taskReducer([], { type: 'ADD_TASK', payload: newTask });
      expect(state).toHaveLength(1);
      expect(state[0]).toEqual(newTask);
    });

    it('tidak mengubah tugas yang sudah ada', () => {
      const existing = mockTask({ id: '1' });
      const newTask = mockTask({ id: '2' });
      const state = taskReducer([existing], { type: 'ADD_TASK', payload: newTask });
      expect(state[1]).toEqual(existing);
    });
  });

  // ─── DELETE_TASK ─────────────────────────────────────────────
  describe('DELETE_TASK', () => {
    it('menghapus tugas berdasarkan id', () => {
      const tasks = [mockTask({ id: '1' }), mockTask({ id: '2' })];
      const state = taskReducer(tasks, { type: 'DELETE_TASK', payload: '1' });
      expect(state).toHaveLength(1);
      expect(state[0].id).toBe('2');
    });

    it('tidak mengubah state jika id tidak ditemukan', () => {
      const tasks = [mockTask({ id: '1' })];
      const state = taskReducer(tasks, { type: 'DELETE_TASK', payload: '999' });
      expect(state).toHaveLength(1);
    });

    it('menghasilkan array kosong jika hanya ada satu tugas', () => {
      const tasks = [mockTask({ id: '1' })];
      const state = taskReducer(tasks, { type: 'DELETE_TASK', payload: '1' });
      expect(state).toHaveLength(0);
    });
  });

  // ─── TOGGLE_STATUS ───────────────────────────────────────────
  describe('TOGGLE_STATUS', () => {
    it('mengubah status dari Belum Dikerjakan menjadi Selesai', () => {
      const tasks = [mockTask({ id: '1', status: 'Belum Dikerjakan' })];
      const state = taskReducer(tasks, { type: 'TOGGLE_STATUS', payload: '1' });
      expect(state[0].status).toBe('Selesai');
    });

    it('mengubah status dari Selesai menjadi Belum Dikerjakan', () => {
      const tasks = [mockTask({ id: '1', status: 'Selesai' })];
      const state = taskReducer(tasks, { type: 'TOGGLE_STATUS', payload: '1' });
      expect(state[0].status).toBe('Belum Dikerjakan');
    });

    it('hanya mengubah tugas yang sesuai id, tidak mengubah tugas lain', () => {
      const tasks = [
        mockTask({ id: '1', status: 'Belum Dikerjakan' }),
        mockTask({ id: '2', status: 'Belum Dikerjakan' }),
      ];
      const state = taskReducer(tasks, { type: 'TOGGLE_STATUS', payload: '1' });
      expect(state[0].status).toBe('Selesai');
      expect(state[1].status).toBe('Belum Dikerjakan');
    });

    it('tidak mengubah properti lain selain status', () => {
      const task = mockTask({ id: '1' });
      const state = taskReducer([task], { type: 'TOGGLE_STATUS', payload: '1' });
      expect(state[0].nama_tugas).toBe(task.nama_tugas);
      expect(state[0].mata_kuliah).toBe(task.mata_kuliah);
      expect(state[0].deadline).toBe(task.deadline);
    });
  });

  // ─── RESET_TASKS ─────────────────────────────────────────────
  describe('RESET_TASKS', () => {
    it('mengembalikan ke data awal (INITIAL_TASKS)', () => {
      const { INITIAL_TASKS } = require('../src/lib/initialData');
      const tasks = [mockTask({ id: 'custom' })];
      const state = taskReducer(tasks, { type: 'RESET_TASKS' });
      expect(state).toEqual(INITIAL_TASKS);
    });

    it('INITIAL_TASKS memiliki minimal 5 tugas', () => {
      const { INITIAL_TASKS } = require('../src/lib/initialData');
      const state = taskReducer([], { type: 'RESET_TASKS' });
      expect(state.length).toBeGreaterThanOrEqual(5);
    });
  });

  // ─── SET_TASKS ───────────────────────────────────────────────
  describe('SET_TASKS', () => {
    it('mengganti seluruh state dengan payload baru', () => {
      const newTasks = [mockTask({ id: '10' }), mockTask({ id: '11' })];
      const state = taskReducer([mockTask()], { type: 'SET_TASKS', payload: newTasks });
      expect(state).toEqual(newTasks);
    });
  });

  // ─── DEFAULT ─────────────────────────────────────────────────
  describe('default', () => {
    it('mengembalikan state yang sama untuk action tidak dikenal', () => {
      const tasks = [mockTask()];
      const state = taskReducer(tasks, { type: 'UNKNOWN_ACTION' });
      expect(state).toEqual(tasks);
    });
  });

  // ─── STRUKTUR DATA ───────────────────────────────────────────
  describe('struktur data tugas', () => {
    it('setiap tugas memiliki field yang diwajibkan', () => {
      const { INITIAL_TASKS } = require('../src/lib/initialData');
      INITIAL_TASKS.forEach((task) => {
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('nama_tugas');
        expect(task).toHaveProperty('mata_kuliah');
        expect(task).toHaveProperty('deskripsi');
        expect(task).toHaveProperty('deadline');
        expect(task).toHaveProperty('status');
      });
    });

    it('status hanya boleh Belum Dikerjakan atau Selesai', () => {
      const { INITIAL_TASKS } = require('../src/lib/initialData');
      INITIAL_TASKS.forEach((task) => {
        expect(['Belum Dikerjakan', 'Selesai']).toContain(task.status);
      });
    });
  });
});
