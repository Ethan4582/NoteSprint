# AGENT.md

## Critical Rules
- Never rollback any commit
- Never run `pnpm build` unless required to complete the current task
- Never use `any` in TypeScript — production-grade types only
- Never hardcode SQL — always use ORM
- Never commit: `plan/`, 
- Never run `git commit` on behalf of the user — output the message only

## After Every Task
Always end with:
1. One-line summary of what was done
2. One commit message, single line, no bullets:
```
fix: handle existing document_id column gracefully
```

## Stack Defaults
> Only apply if `plan/plan.md` does not specify otherwise.

| Concern | Default |
|---|---|
| Frontend / Fullstack | Next.js + TypeScript |
| Other targets (extensions, scripts) | Best fit for the target |
| Separate backend | Only if fullstack is too complex |
| Package manager |  pnpm |
| ORM |  Drizzle |
| Backend | Hono |
| UI components | shadcn/ui (use as many as possible, write full components) |
| Go stack | Only if explicitly in plan.md |

## Source of Truth Files

**`plan/plan.md`** — read before starting any task. This is the first instruction. Defaults above are only used when it is silent on something.

**`memory.context.md`** — project memory for agents and humans. Update after: major feature, architecture change, tech stack decision, anything important to remember. Keep it concise — one-liners, no prose dumps.



## Code Standards
- Server-side first — data fetching, heavy logic, and DB access stay on the server
- No client-side DB calls, no connection pooling on the client
- Add DB indexes where relevant; write efficient queries — no over-fetching
- Frontend must feel fast: prefer server components, minimise client bundles, avoid unnecessary re-renders, lazy load where it makes sense
- Follow proper folder and component structure
- shadcn/ui first for all UI — write complete components
- Write code as if performance is a requirement, not an afterthought
- Enforce anti-slop standards: reject low-evidence TS/JS patterns (chained type assertions, runtime typeof, known-value widening, unsafe dictionary types) per `install-anti-slop` skill