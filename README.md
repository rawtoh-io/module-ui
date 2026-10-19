# @rawtoh/module-ui

Shared admin shell and UI primitives for Rawtoh module web apps. Ships TSX
source only (React 19, Tailwind 4, shadcn on `radix-ui`), like `@rawtoh/module-sdk`.

## Install

```sh
bun add @rawtoh/module-ui
```

Peer dependencies: `react`, `react-dom`, `@tanstack/react-router`, `radix-ui`,
`lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.

Tailwind only generates classes it can see, so point it at the package source in
your `styles.css` (path relative to that file):

```css
@source "../node_modules/@rawtoh/module-ui/src";
```

The shell uses the shadcn `--sidebar-*` tokens; keep them in your theme.

## ModuleShell

```tsx
import { ModuleShell } from "@rawtoh/module-ui"

<ModuleShell
  user={user}
  orgs={user.organizations}
  orgSlug={orgSlug}
  nav={[{ label: "Accounts", icon: TvIcon, to: `/o/${orgSlug}`, active: true }]}
  onSelectOrg={(org) => navigate({ to: "/o/$orgSlug", params: { orgSlug: org.slug } })}
  onLogout={logout}
  resource="Twitch accounts"
>
  <Outlet />
</ModuleShell>
```

Owner-only: other roles see `AccessDenied` instead of the shell. Pass
`headerEnd` for right-aligned header content such as a connection warning.

## Release

```sh
npm version minor && git push --follow-tags && npm publish
```
