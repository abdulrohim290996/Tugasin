-- Tabel tasks untuk aplikasi Tugasin
create table if not exists public.tasks (
  id          text primary key default gen_random_uuid()::text,
  nama_tugas  text not null,
  mata_kuliah text not null,
  deskripsi   text,
  deadline    date not null,
  status      text not null default 'Belum Dikerjakan' check (status in ('Belum Dikerjakan', 'Selesai')),
  created_at  timestamptz default now()
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Policy: semua user bisa baca, tambah, ubah, hapus (public app)
create policy "Public access" on public.tasks
  for all using (true) with check (true);
