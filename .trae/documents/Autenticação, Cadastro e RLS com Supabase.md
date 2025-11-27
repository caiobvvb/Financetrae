## Objetivos
- Implementar cadastro e login por email/senha.
- Isolar dados por usuário com RLS: cada usuário só lê/escreve seus próprios registros.
- Criar tabelas alinhadas às páginas (janela por janela): `transactions`, `accounts`, `categories`, `budgets`, `cards` e `profiles`.

## Fluxo de Autenticação
- Cadastro: página `SignUp` com `supabase.auth.signUp({ email, password, data })`.
- Login: já implementado em `SignIn`; manter mensagens de erro e estado de carregamento.
- Sessão: `AuthProvider` escuta `onAuthStateChange` e expõe `user`, `loading`, `signIn`, `signOut`, `signUp`.
- Logout: botão no `Header` chamando `useAuth().signOut()`.
- Verificação de email (opcional): manter confirmação de email do Supabase; acesso às tabelas via RLS somente com `auth.uid()`.

## Banco de Dados (primeira etapa)
- Criar `profiles` para metadados do usuário.
- Criar `transactions` (usada em Transações e Calendário).
- Habilitar RLS e políticas por usuário.

### SQL – profiles
```sql
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "select own" on public.profiles
  for select using (auth.uid() = id);
create policy "update own" on public.profiles
  for update using (auth.uid() = id);
```

### SQL – transactions
```sql
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(14,2) not null,
  date date not null,
  category text not null,
  type text not null check (type in ('income','expense')),
  status text not null check (status in ('paid','pending')),
  created_at timestamp with time zone default now()
);

create index if not exists idx_transactions_user_date on public.transactions(user_id, date);
create index if not exists idx_transactions_type_status on public.transactions(type, status);

alter table public.transactions enable row level security;

create policy "select own" on public.transactions
  for select using (auth.uid() = user_id);
create policy "insert own" on public.transactions
  for insert with check (auth.uid() = user_id);
create policy "update own" on public.transactions
  for update using (auth.uid() = user_id);
create policy "delete own" on public.transactions
  for delete using (auth.uid() = user_id);
```

## Banco de Dados (etapas seguintes – janela por janela)
- Accounts (`accounts`): `id`, `user_id`, `name`, `balance`, `type` ('wallet','bank','investment') + RLS por `user_id`.
- Categories (`categories`): `id`, `user_id`, `name`, `color` + RLS por `user_id`.
- Budgets (`budgets`): `id`, `user_id`, `category_id`, `limit`, `period` + RLS por `user_id`.
- Cards (`cards`): `id`, `user_id`, `name`, `limit`, `current_invoice`, `due_date` + RLS por `user_id`.
- Mesma estratégia: índices úteis e políticas (`select/insert/update/delete own`).

## UI e Integração
- Criar `pages/SignUp.tsx` com formulário de cadastro; chamar `auth.signUp` e redirecionar para `SignIn`.
- Expandir `AuthProvider` com `signUp(email, password, data?)`.
- Adicionar rota pública `/signup` em `App.tsx`.
- No `Header`, adicionar botão "Sair" usando `signOut`.
- Serviços: manter `services/*` com wrappers (`transactions`, `accounts`, etc.) que já respeitam RLS via `auth.uid()`.

## Verificação
- Health-check: manter `#/health` para leitura e inserção de exemplo (pós-login).
- Transações: após criar `transactions`, validar listagem em `#/transactions` com dados do usuário logado.
- Garantir que outro usuário não veja seus dados (testar com contas distintas).

## Próximos Passos (após aprovação)
1. Executar os scripts SQL acima no Supabase (Editor SQL).
2. Implementar `SignUp` e expor `signUp` no `AuthProvider`.
3. Adicionar rota `/signup` e botão de logout no `Header`.
4. Opcional: criar seed inicial por usuário (categorias padrão) via função RPC ou inserção após o primeiro login.

Confirma seguir com essa implementação? Após confirmar, executo os scripts no seu projeto e adiciono as páginas/rotas necessárias.