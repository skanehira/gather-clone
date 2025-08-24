-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create realms table
create table public.realms (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    owner_id uuid references auth.users(id) on delete cascade not null,
    map_data jsonb not null,
    share_id text unique not null default gen_random_uuid()::text,
    only_owner boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table (extends auth.users)
create table public.profiles (
    id uuid references auth.users(id) on delete cascade primary key,
    skin text default '009' not null,
    visited_realms jsonb default '[]'::jsonb not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table public.realms enable row level security;
alter table public.profiles enable row level security;

-- Create policies for realms table
create policy "Users can view realms they own" on public.realms
    for select using (auth.uid() = owner_id);

create policy "Users can view public realms" on public.realms
    for select using (only_owner = false);

create policy "Users can insert their own realms" on public.realms
    for insert with check (auth.uid() = owner_id);

create policy "Users can update their own realms" on public.realms
    for update using (auth.uid() = owner_id);

create policy "Users can delete their own realms" on public.realms
    for delete using (auth.uid() = owner_id);

-- Create policies for profiles table
create policy "Users can view their own profile" on public.profiles
    for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
    for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
    for insert with check (auth.uid() = id);

-- Create function to handle updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_realms_updated_at
    before update on public.realms
    for each row execute function public.handle_updated_at();

create trigger handle_profiles_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

-- Create function to handle user profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, skin, visited_realms)
    values (new.id, '009', '[]'::jsonb);
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile when user signs up
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();