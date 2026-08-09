-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE (Extends Supabase Auth)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text unique,
  profile_image text,
  college text,
  course text,
  branch text,
  year integer,
  semester integer,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- SUBJECTS
create table public.subjects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  color text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- TASKS
create table public.tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  priority text check (priority in ('low', 'medium', 'high')),
  status text check (status in ('pending', 'in_progress', 'completed')),
  due_date timestamp with time zone,
  subject_id uuid references public.subjects(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTE FOLDERS
create table public.note_folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- NOTES
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  folder_id uuid references public.note_folders(id) on delete set null,
  title text not null,
  content jsonb, -- Storing rich text as JSON (TipTap/Slate)
  is_favorite boolean default false,
  is_archived boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PDF FOLDERS
create table public.pdf_folders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  subject_id uuid references public.subjects(id) on delete set null
);

-- PDF FILES
create table public.pdf_files (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  folder_id uuid references public.pdf_folders(id) on delete set null,
  subject_id uuid references public.subjects(id) on delete set null,
  file_name text not null,
  file_url text not null,
  file_size integer,
  pages integer,
  reading_progress integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  last_opened_at timestamp with time zone
);

-- ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.tasks enable row level security;
alter table public.note_folders enable row level security;
alter table public.notes enable row level security;
alter table public.pdf_folders enable row level security;
alter table public.pdf_files enable row level security;

-- Create policies for RLS (Users can only see and modify their own data)
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- Apply similar policies to all other tables
create policy "Users can manage own subjects" on public.subjects for all using (auth.uid() = user_id);
create policy "Users can manage own tasks" on public.tasks for all using (auth.uid() = user_id);
create policy "Users can manage own note_folders" on public.note_folders for all using (auth.uid() = user_id);
create policy "Users can manage own notes" on public.notes for all using (auth.uid() = user_id);
create policy "Users can manage own pdf_folders" on public.pdf_folders for all using (auth.uid() = user_id);
create policy "Users can manage own pdf_files" on public.pdf_files for all using (auth.uid() = user_id);

-- Create a trigger to automatically create a profile for new users
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
