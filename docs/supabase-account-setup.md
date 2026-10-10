# Supabase account and game-save setup

This app is a static site, so the browser uses a Supabase **Publishable key**
with row-level security. Never put a Supabase `service_role` or secret key in
the frontend or commit one to the repository.

## Configure a Supabase project

1. Create or choose a Supabase project.
2. In the SQL Editor, run
   [`20261010163000_player_saves.sql`](../supabase/migrations/20261010163000_player_saves.sql).
   It creates one JSONB save per authenticated user and restricts every row to
   that user with row-level security.
3. In Project Settings → API, copy the **Project URL** and **Publishable key**
   (the legacy `anon` key is also accepted).
4. Put those two public values in `js/supabase-config.js`:

   ```js
   window.THAI_GRIND_SUPABASE_CONFIG = Object.freeze({
       url: "https://YOUR_PROJECT_REF.supabase.co",
       publishableKey: "YOUR_SUPABASE_PUBLISHABLE_KEY",
   });
   ```

5. In Authentication → URL Configuration, set the deployed site's URL and add
   the exact account page to the redirect allow list, for example:

   ```text
   https://YOUR_GITHUB_ACCOUNT.github.io/YOUR_REPOSITORY/html/account.html
   http://localhost:8765/html/account.html
   http://127.0.0.1:8765/html/account.html
   ```

6. Enable email/password authentication and configure email confirmation if
   desired. New accounts may need to confirm their address before signing in.

## Current save behavior

- `html/account.html` supports local JSON export/import, account creation,
  sign-in, password reset, manual cloud upload, and restore.
- A backup includes the site's local-storage values but excludes Supabase
  authentication tokens and account-internal keys.
- Cloud upload is intentionally manual for now. It asks before replacing an
  existing cloud save; restoring downloads a local backup before replacing
  local game data. Do not remove an existing Home Screen app until the current
  local save has been exported or uploaded.
- Each cloud row belongs to `auth.users.id`; the browser cannot read or modify
  another player's save because of the table's RLS policies.
