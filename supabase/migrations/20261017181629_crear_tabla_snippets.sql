-- Tabla de snippets: cada fila pertenece a un usuario.
-- `user_id` toma `auth.uid()` por defecto: el cliente NO lo envía, lo pone la base de datos.
create table if not exists public.snippets (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
	code text not null,
	explanation text not null,
	language text,
	created_at timestamptz not null default now()
);

-- Índice para listar lo más nuevo primero y para la paginación por cursor.
create index if not exists idx_snippets_user_created
	on public.snippets (user_id, created_at desc);

-- RLS: activada y con una policy por operación. Solo el dueño ve y toca lo suyo.
alter table public.snippets enable row level security;

create policy "snippets_select_propios"
	on public.snippets for select
	using (auth.uid() = user_id);

create policy "snippets_insert_propios"
	on public.snippets for insert
	with check (auth.uid() = user_id);

create policy "snippets_update_propios"
	on public.snippets for update
	using (auth.uid() = user_id)
	with check (auth.uid() = user_id);

create policy "snippets_delete_propios"
	on public.snippets for delete
	using (auth.uid() = user_id);
