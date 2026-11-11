# 📚 Tugasin — Aplikasi Manajemen Tugas Mahasiswa

Aplikasi mobile & web untuk membantu mahasiswa mencatat, mengelola, mencari, dan memantau tugas perkuliahan berdasarkan mata kuliah dan status pengerjaannya. Dibangun dengan **React Native + Expo** dan terintegrasi dengan **Supabase** sebagai backend.

---

## ✨ Fitur Utama

| Fitur | Keterangan |
|-------|-----------|
| 📋 Daftar Tugas | Menampilkan semua tugas dengan info lengkap menggunakan FlatList |
| ➕ Tambah Tugas | Form modal untuk menambahkan tugas baru, langsung tersync ke Supabase |
| ✅ Ubah Status | Toggle status antara *Belum Dikerjakan* dan *Selesai* |
| 🗑️ Hapus Tugas | Hapus tugas dengan konfirmasi, data terhapus dari database |
| 🔍 Pencarian | Cari tugas berdasarkan nama tugas atau mata kuliah secara real-time |
| 📊 Ringkasan | Kartu ringkasan total tugas, belum dikerjakan, dan selesai |
| 🔄 Reset | Kembalikan semua tugas ke data awal |
| 🌐 Multi Platform | Berjalan di Android, iOS, dan Web |

---

## 🗂️ Struktur Proyek

```
Tugasin/
├── App.js                        # Entry point, wrap SafeAreaProvider
├── index.js                      # Expo entry
├── app.json                      # Konfigurasi Expo
├── .env                          # Supabase URL & anon key (tidak di-commit)
├── supabase_migration.sql        # SQL untuk setup tabel di Supabase
│
├── src/
│   ├── components/
│   │   ├── HomeScreen.js         # Layar utama (komponen induk)
│   │   ├── TaskCard.js           # Kartu tugas (komponen anak, menerima props)
│   │   ├── TaskSummary.js        # Ringkasan statistik tugas
│   │   └── AddTaskModal.js       # Modal/form tambah tugas
│   │
│   ├── hooks/
│   │   └── useTasks.js           # Custom hook: semua state & logic tugas
│   │
│   ├── reducers/
│   │   └── taskReducer.js        # Reducer: ADD_TASK, DELETE_TASK, TOGGLE_STATUS, RESET_TASKS
│   │
│   └── lib/
│       ├── supabase.js           # Inisialisasi Supabase client
│       └── initialData.js        # 5 data tugas awal (seed data)
│
└── __tests__/
    └── taskReducer.test.js       # Unit test untuk semua actions reducer
```

---

## 🔄 Alur Aplikasi

```
App.js
  └── HomeScreen.js (komponen induk)
        ├── useTasks() ──────────────────────────────────────────────┐
        │     ├── useReducer(taskReducer)  → state: tasks            │
        │     ├── useState(search)         → keyword pencarian       │
        │     ├── useRef(nameInputRef)     → fokus input nama tugas  │
        │     ├── useEffect               → load data dari Supabase  │
        │     ├── useEffect               → console.log keyword      │
        │     ├── useMemo(summary)         → hitung total/belum/selesai
        │     ├── useMemo(filteredTasks)   → filter berdasarkan search
        │     ├── useCallback(addTask)     → tambah + sync Supabase  │
        │     ├── useCallback(deleteTask)  → hapus + sync Supabase   │
        │     ├── useCallback(toggleStatus)→ ubah status + sync      │
        │     └── useCallback(resetTasks) → reset ke data awal       │
        │                                                             │
        ├── TaskSummary ← props: summary                             │
        ├── TaskCard    ← props: task, onToggle, onDelete            │
        └── AddTaskModal← props: visible, onClose, onAdd, nameInputRef
```

### Alur Tambah Tugas
```
User klik FAB (+)
  → AddTaskModal terbuka
  → User isi form (nama, matkul, deskripsi, deadline)
  → Klik "Tambahkan Tugas"
  → validate() → jika valid:
      → addTask() dipanggil
      → dispatch ADD_TASK → state tasks terupdate
      → supabase.insert() → data tersimpan ke database
      → Modal tertutup, fokus kembali ke input nama tugas (useRef)
```

### Alur Ubah Status
```
User klik icon ✓ di TaskCard
  → toggleStatus(id) dipanggil
  → dispatch TOGGLE_STATUS → status berubah di state lokal (optimistic update)
  → supabase.update() → perubahan tersync ke database
```

### Alur Hapus Tugas
```
User klik icon 🗑️ di TaskCard
  → konfirmasi muncul (Alert / window.confirm di web)
  → deleteTask(id) dipanggil
  → dispatch DELETE_TASK → tugas hilang dari state
  → supabase.delete() → data terhapus dari database
```

### Alur Pencarian
```
User ketik keyword di search bar
  → setSearch() → state search berubah
  → useEffect terpicu → console.log keyword (sesuai requirement)
  → useMemo(filteredTasks) recompute → daftar tugas terfilter otomatis
```

---

## 🧩 Penerapan React Hooks

| Hook | Lokasi | Kegunaan |
|------|--------|----------|
| `useReducer` | `useTasks.js` | Mengelola state daftar tugas dengan actions |
| `useState` | `useTasks.js`, `HomeScreen.js`, `AddTaskModal.js` | State search, filter, form input, modal |
| `useEffect` | `useTasks.js` | Load data Supabase + monitor keyword pencarian |
| `useMemo` | `useTasks.js` | Hitung ringkasan & filter tugas (efisien) |
| `useCallback` | `useTasks.js` | Fungsi addTask, deleteTask, toggleStatus, resetTasks |
| `useRef` | `useTasks.js` | Fokus kembali ke input nama setelah tambah tugas |

---

## ⚙️ useReducer — Actions

Semua perubahan data tugas dikelola melalui `taskReducer` di `src/reducers/taskReducer.js`:

| Action | Payload | Efek |
|--------|---------|------|
| `ADD_TASK` | object tugas baru | Menambahkan tugas ke awal array |
| `DELETE_TASK` | `id` tugas | Menghapus tugas berdasarkan id |
| `TOGGLE_STATUS` | `id` tugas | Toggle status Belum Dikerjakan ↔ Selesai |
| `RESET_TASKS` | — | Mengembalikan ke 5 data tugas awal |
| `SET_TASKS` | array tugas | Mengganti seluruh state (dipakai saat load dari Supabase) |

---

## 🗄️ Integrasi Supabase

### Skema Tabel `tasks`

| Kolom | Tipe | Keterangan |
|-------|------|-----------|
| `id` | `text` | Primary key (UUID) |
| `nama_tugas` | `text` | Nama tugas |
| `mata_kuliah` | `text` | Nama mata kuliah |
| `deskripsi` | `text` | Deskripsi tugas (opsional) |
| `deadline` | `date` | Tanggal pengumpulan |
| `status` | `text` | `Belum Dikerjakan` atau `Selesai` |
| `created_at` | `timestamptz` | Waktu dibuat |

- RLS (Row Level Security) diaktifkan dengan policy public access
- Semua operasi CRUD tersync real-time ke Supabase
- Jika koneksi gagal, app tetap berjalan dengan data lokal (fallback)

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js >= 18
- Expo CLI (`npm install -g expo-cli`)
- Akun [Supabase](https://supabase.com)

### 1. Clone & Install

```bash
git clone <url-repo>
cd Tugasin
npm install
```

### 2. Setup Supabase

Buat file `.env` di root project:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Jalankan `supabase_migration.sql` di Supabase SQL Editor untuk membuat tabel.

### 3. Jalankan Aplikasi

```bash
# Mobile (scan QR dengan Expo Go)
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios

# Web
npx expo start --web
```

### 4. Jalankan Unit Test

```bash
npm test
```

---

## 🧪 Unit Test

Test tersedia di `__tests__/taskReducer.test.js` mencakup 16 test case:

- `ADD_TASK` — tambah tugas ke array, state kosong, tidak mengubah data lain
- `DELETE_TASK` — hapus by id, id tidak ditemukan, array jadi kosong
- `TOGGLE_STATUS` — toggle dua arah, hanya ubah tugas yang sesuai, tidak ubah properti lain
- `RESET_TASKS` — kembali ke INITIAL_TASKS, minimal 5 data
- `SET_TASKS` — ganti seluruh state
- `default` — action tidak dikenal mengembalikan state sama
- Struktur data — validasi field wajib dan nilai status

```bash
npm test

# Output:
# Tests: 16 passed, 16 total
```

---

## 📦 Dependencies

| Package | Kegunaan |
|---------|---------|
| `expo` | Framework React Native |
| `react-native-web` | Support platform web |
| `@supabase/supabase-js` | Supabase client |
| `@react-native-async-storage/async-storage` | Penyimpanan sesi Supabase |
| `react-native-safe-area-context` | Safe area untuk notch/status bar |
| `@expo/vector-icons` | Icon (Ionicons) |
| `react-native-url-polyfill` | Polyfill URL untuk Supabase di React Native |

---

## 👨‍💻 Teknologi

- **React Native** 0.88 + **Expo** SDK 58
- **Supabase** (PostgreSQL + REST API)
- **React Hooks**: useState, useEffect, useMemo, useCallback, useRef, useReducer
- **Jest** untuk unit testing
