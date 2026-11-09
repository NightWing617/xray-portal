# Publication handoff

- Local repo: `/Users/kylekhedun/Documents/ChatGPT/xray_analysis/orthopaedic-xray-analyst`
- Source: `f59083d9b6c038fc4a08e1ed2fb2896b588593cd`; current commit: see `git rev-parse HEAD` after local checkpoint.
- Branch: `codex/orthopaedic-conversion`; no remote is configured.
- New analyst GitHub URL: **awaiting user**. Never use the burns source as destination.
- Checks: `npm ci`, `npm test`, `npm run build`, contract SHA and rendered demo review. Local Supabase direct API integration and private DICOM browser view passed.
- Static demo: `dist/` uses relative paths under arbitrary repository subpaths. Inherited auto-deployment workflow was removed; CI only.
- A private Auth/Storage backend, authorised analysis worker and institutional approvals are separate from GitHub source publication.
