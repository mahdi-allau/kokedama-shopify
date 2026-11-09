-- ---------------------------------------------------------------------------
-- Pannello di Simona: tabella dei prodotti e deposito delle foto.
--
-- Si incolla una volta sola nell'editor SQL di Supabase
-- (progetto > SQL Editor > New query > Run).
--
-- I nomi hanno tutti il prefisso "kokedama_" apposta: cosi questo schema puo
-- convivere nello stesso progetto Supabase del sito SARAH senza pestare i
-- piedi alle sue tabelle. Se un domani il kokedama avra un progetto suo, si
-- incolla identico e funziona lo stesso.
--
-- Regola di fondo: il catalogo lo legge CHIUNQUE (e un sito pubblico), lo
-- scrive solo chi ha fatto l'accesso. Simona entra con mail e password, e
-- l'unico account che creiamo.
-- ---------------------------------------------------------------------------

create extension if not exists pgcrypto;

-- ------------------------------------------------------------- I PRODOTTI

create table if not exists public.kokedama_prodotti (
  id            uuid primary key default gen_random_uuid(),

  -- L'indirizzo della pagina: /products/<handle>. Unico, e non si cambia piu
  -- una volta pubblicato, altrimenti i link che Simona ha gia mandato in giro
  -- smettono di funzionare.
  handle        text unique not null,

  titolo        text not null,

  -- "Kokedama" per le piante vive, "Composizione secca" per gli stabilizzati.
  -- Da questo dipende tutto il resto: taglie, scheda di cura, consegna.
  tipo          text not null default 'Kokedama',
  collezione    text not null default 'laboratorio-ferrara',

  occhiello     text,                        -- "Pezzo unico" / "Non chiede acqua"
  descrizione   text,                        -- HTML, gli stessi <p> di adesso
  tag           text,

  -- Le taglie stanno insieme in un unico campo invece che in una tabella a
  -- parte: sono tre righe fisse per prodotto, e il pannello le salva in blocco.
  -- Forma: [{"nome":"Piccolo","prezzo":25,"misura":"8-10 cm"}, ...]
  taglie        jsonb not null default '[]'::jsonb,

  -- Nome del file nel deposito "kokedama-foto", non un indirizzo completo:
  -- se cambia il dominio del progetto, le foto non si rompono.
  foto          text,

  -- Spento = resta nel pannello ma sparisce dal sito. E cosi che si tolgono
  -- i tre prodotti senza foto senza perderne il testo.
  online        boolean not null default false,
  ordine        integer not null default 0,

  creato_il     timestamptz not null default now(),
  aggiornato_il timestamptz not null default now()
);

create index if not exists kokedama_prodotti_ordine_idx
  on public.kokedama_prodotti (collezione, ordine);

-- La data di modifica si aggiorna da sola: scriverla a mano si dimentica.
create or replace function public.kokedama_tocca_aggiornato()
returns trigger
language plpgsql
as $$
begin
  new.aggiornato_il = now();
  return new;
end;
$$;

drop trigger if exists kokedama_prodotti_aggiornato on public.kokedama_prodotti;
create trigger kokedama_prodotti_aggiornato
  before update on public.kokedama_prodotti
  for each row execute function public.kokedama_tocca_aggiornato();

-- ------------------------------------------------------- CHI PUO FARE COSA

alter table public.kokedama_prodotti enable row level security;

-- Lettura aperta, ma solo dei prodotti accesi: quelli spenti non devono
-- uscire nemmeno guardando le chiamate di rete.
drop policy if exists "catalogo leggibile da tutti" on public.kokedama_prodotti;
create policy "catalogo leggibile da tutti"
  on public.kokedama_prodotti for select
  to anon
  using (online = true);

-- Chi ha fatto l'accesso vede tutto, anche gli spenti, e puo scrivere.
drop policy if exists "catalogo gestibile da chi e autenticato" on public.kokedama_prodotti;
create policy "catalogo gestibile da chi e autenticato"
  on public.kokedama_prodotti for all
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------- LE FOTO

-- Deposito pubblico: le foto dei prodotti si vedono sul sito, non c'e niente
-- da nascondere. Pubblico vuol dire leggibile, non scrivibile.
insert into storage.buckets (id, name, public)
values ('kokedama-foto', 'kokedama-foto', true)
on conflict (id) do nothing;

drop policy if exists "foto visibili a tutti" on storage.objects;
create policy "foto visibili a tutti"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'kokedama-foto');

drop policy if exists "foto caricabili da chi e autenticato" on storage.objects;
create policy "foto caricabili da chi e autenticato"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'kokedama-foto');

drop policy if exists "foto sostituibili da chi e autenticato" on storage.objects;
create policy "foto sostituibili da chi e autenticato"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'kokedama-foto');

drop policy if exists "foto cancellabili da chi e autenticato" on storage.objects;
create policy "foto cancellabili da chi e autenticato"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'kokedama-foto');

-- ---------------------------------------------------------------------------
-- Dopo aver lanciato questo file restano due cose, dal pannello di Supabase:
--
--   1. Authentication > Users > Add user: la mail di Simona e una password.
--      E l'unico account. Niente registrazione aperta: in
--      Authentication > Sign In / Providers va spento "Allow new users to sign up",
--      altrimenti chiunque trovi /admin puo crearsi un utente.
--
--   2. Project Settings > API: servono "Project URL" e la chiave "anon public".
--      Quella chiave sta scritta in chiaro dentro ogni sito fatto con Supabase,
--      e non e un segreto: da sola non apre niente, perche a decidere chi puo
--      scrivere sono le regole qui sopra. La chiave "service_role" invece non
--      va data a nessuno e non deve finire nel sito.
-- ---------------------------------------------------------------------------
