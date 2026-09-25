create table if not exists public.form_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  form_type text not null default 'general',
  name text,
  contact text,
  question text,
  course text,
  message text,
  submitted_at timestamptz,
  source text not null default 'website',
  raw_data jsonb not null default '{}'::jsonb
);

alter table public.form_submissions enable row level security;

-- The public form may insert rows, but anonymous visitors cannot read, update, or delete them.
drop policy if exists "public can submit forms" on public.form_submissions;
create policy "public can submit forms"
on public.form_submissions
for insert
to anon, authenticated
with check (source = 'website');
