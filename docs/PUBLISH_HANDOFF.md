# Publication handoff

- Local repo: `/Users/kylekhedun/Documents/ChatGPT/xray_analysis/orthopaedic-xray-analyst`
- Source: `f59083d9b6c038fc4a08e1ed2fb2896b588593cd`; current commit: see `git rev-parse HEAD` after local checkpoint.
- Branch: `codex/orthopaedic-conversion`; destination: `https://github.com/NightWing617/xray-portal`.
- Public synthetic site: `https://nightwing617.github.io/xray-portal/` via GitHub Actions Pages build from `main`; HTTP 200 and live handover flow verified.
- Checks: `npm ci`, `npm test`, `npm run build`, contract SHA and rendered demo review. Local Supabase direct API integration and private DICOM browser view passed.
- Static demo: `dist/` uses relative paths under arbitrary repository subpaths. Pages publishes the built synthetic artifact; research configuration and service keys are absent.
- A private Auth/Storage backend, authorised analysis worker and institutional approvals are separate from GitHub source publication.
