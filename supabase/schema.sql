-- Run this in Supabase → SQL Editor
create table if not exists public.booking_requests (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  phone text not null check (char_length(phone) between 10 and 15),
  interest text,
  slot text,
  preferred_date date,
  message text check (char_length(message) <= 500),
  status text not null default 'new'
);

alter table public.booking_requests enable row level security;

-- Website visitors (anon key) may only INSERT. They cannot read anyone's data.
create policy "anyone can submit a booking"
  on public.booking_requests for insert
  to anon
  with check (status = 'new');

-- View requests in the Supabase dashboard (Table Editor) as the project owner.
