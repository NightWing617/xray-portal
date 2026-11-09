# Implementation status — 9 November 2026

| Area | State | Evidence / limit |
|---|---|---|
| Source preservation | Verified | Recorded source commit, no burns origin, history retained |
| Synthetic clinician workspace | Implemented | Context, manual concern, multiview upload/viewer and drag/drop, entered-data handover draft, input-bound simulated job, cancellation, correction, history and review queue |
| DICOM | Verified bounded fixture | Uncompressed single-frame CR/DX decoder snapshot; diagnostic conformance remains unverified |
| Shared contract | Verified | SHA-256 snapshot test and version 0.1.0 |
| Research Auth, quarantined upload and private reads | Verified locally | Same seeded local Supabase, browser sign-in and private DICOM view; direct API matrix from database repo passed |
| Research submission, inference, referral | Planned | Requires authorised API/worker, access grants, recipient and approved artifact/protocol; no fallback mock |
| Trained model | None | Synthetic simulation only; database repo has feature-vector smoke scaffold |
| Publication | In progress | Destination supplied: `NightWing617/xray-portal`; Pages workflow added for the synthetic build |

Local verification: `npm test` 5/5, `npm run build`, browser saved context/concern/handover/job, quarantined PNG view addition, phone width and unsupported paediatric scope, browser Auth/private DICOM view and logout. See `docs/screenshots/analyst-handover.png` and `docs/screenshots/research-private-dicom.png`.
