-- Simplifica el snippet: sin título, favoritos ni edición
drop trigger if exists trg_snippets_updated_at on public.snippets;
drop function if exists public.snippets_set_updated_at();
drop index if exists idx_snippets_title_trgm;
drop index if exists idx_snippets_user_favorite;

alter table public.snippets
	drop column if exists title,
	drop column if exists is_favorite,
	drop column if exists updated_at;

-- Enlace público por token
alter table public.snippets
	add column if not exists share_token uuid unique;

-- Lectura pública de un solo snippet por token (no abre el resto de la tabla)
create or replace function public.obtener_snippet_publico(p_token uuid)
returns table (
	id uuid,
	code text,
	explanation text,
	language text,
	created_at timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
	select s.id, s.code, s.explanation, s.language, s.created_at
	from public.snippets s
	where s.share_token = p_token
	limit 1;
$$;

revoke all on function public.obtener_snippet_publico(uuid) from public;
grant execute on function public.obtener_snippet_publico(uuid) to anon, authenticated;
