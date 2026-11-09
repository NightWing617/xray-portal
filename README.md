# OrthoAnalyst

A clinician-facing **synthetic research demo** adapted from the source in [provenance](docs/SOURCE_PROVENANCE.md). It is not a diagnostic service. No trained orthopaedic model or clinical protocol is supplied.

```sh
npm ci
npm run dev
# open http://localhost:4174
npm test
npm run build
```

Select **Enter synthetic demo** to open a pseudonymous study, edit context, record manual clinical concern, review multiple views, add local demo images by file picker or drag/drop, generate a deterministic structured handover draft, run a simulated job, correct a draft and request independent review. The handover summarises entered data only and sends nothing; the mock output is tied to the study version and contains no fracture probability or treatment recommendation. Synthetic edits stay in this browser. Do not upload patient data into this demo. The [burns transfer audit](docs/BURNS_TRANSFER.md) records the adapted patterns.

For a deliberately configured local private backend, copy `research-config.example.json` to ignored `research-config.json` and set the Supabase URL and publishable key. Research mode signs in with Auth, reads only RLS-authorised studies and private image blobs, and can create quarantined synthetic studies; analysis remains unavailable. It does not fall back to synthetic analysis. See the database repo's [local integration runbook](docs/LOCAL_INTEGRATION.md).

The database repository owns the canonical [study contract](contracts/study.schema.json), migration and experiment scaffold. This repo holds a reproducible snapshot and SHA-256; it does not deploy competing migrations. The [research roadmap](docs/research/ROADMAP.md) and [evidence register](docs/research/EVIDENCE_REGISTER.md) constrain claims and future work.

The synthetic public site is published at [NightWing617.github.io/xray-portal](https://nightwing617.github.io/xray-portal/). GitHub Pages does not host the private research backend or an inference worker.
