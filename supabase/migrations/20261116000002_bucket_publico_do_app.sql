-- Bucket público com os arquivos estáticos do app (CSS e JS), em pastas versionadas (v1, v2…).
-- O envio é feito com uma política temporária, criada antes e removida logo depois de cada versão.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('app', 'app', true, 2097152, array['text/css', 'application/javascript', 'text/javascript', 'image/svg+xml', 'application/manifest+json', 'application/json'])
on conflict (id) do update set public = true, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;
