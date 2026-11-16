-- Progresso de cada aluno do Intensivo 500.
-- Cada aparelho gera uma chave secreta (uuid). Quem tem a chave lê e grava só aquele progresso.
create table public.progress (
  key uuid primary key,
  name text,
  learned integer not null default 0,
  seen integer not null default 0,
  tobe integer not null default 0,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

comment on table public.progress is 'Progresso do Intensivo 500. Acesso só pelas funções save_progress e load_progress.';

-- RLS ligado e sem políticas: a tabela não fica exposta pela API; só as funções abaixo acessam.
alter table public.progress enable row level security;
revoke all on table public.progress from anon, authenticated;

create or replace function public.save_progress(p_key uuid, p_data jsonb)
returns timestamptz
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_at timestamptz := now();
  v_saved timestamptz;
begin
  if p_key is null or p_data is null or jsonb_typeof(p_data) <> 'object' then
    raise exception 'dados inválidos';
  end if;
  if pg_column_size(p_data) > 2000000 then
    raise exception 'progresso grande demais';
  end if;

  insert into public.progress as p (key, name, learned, seen, tobe, data, updated_at)
  values (
    p_key,
    left(p_data #>> '{profile,name}', 80),
    coalesce((p_data #>> '{meta,learned}')::integer, 0),
    coalesce((p_data #>> '{meta,seen}')::integer, 0),
    coalesce((p_data #>> '{meta,tobe}')::integer, 0),
    p_data,
    v_at
  )
  on conflict (key) do update set
    name = excluded.name,
    learned = excluded.learned,
    seen = excluded.seen,
    tobe = excluded.tobe,
    data = excluded.data,
    updated_at = excluded.updated_at
  -- Não deixa um aparelho com progresso mais antigo apagar um mais novo.
  where coalesce((p.data ->> 'savedAt')::bigint, 0) <= coalesce((excluded.data ->> 'savedAt')::bigint, 0)
  returning p.updated_at into v_saved;

  return v_saved; -- null quando o progresso na nuvem é mais novo
end;
$$;

create or replace function public.load_progress(p_key uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select data from public.progress where key = p_key;
$$;

revoke all on function public.save_progress(uuid, jsonb) from public;
revoke all on function public.load_progress(uuid) from public;
grant execute on function public.save_progress(uuid, jsonb) to anon, authenticated;
grant execute on function public.load_progress(uuid) to anon, authenticated;
