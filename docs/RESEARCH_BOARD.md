# Research board snapshot from database repo — 9 November 2026

| Proposal | Evidence gap | Smallest experiment | Owner | Dependency | Decision date |
|---|---|---|---|---|---|
| Multi-view adult wrist pilot | Local label quality and reference feasibility | Independent annotation pilot with disagreement audit | To assign | Clinical sponsor, approved studies | To set |
| Referral completeness | Actual missingness and benefit unknown | Synthetic usability sessions and workflow audit | To assign | Frontline clinicians | To set |

## Risks and claims ledger

| Claim or risk | State | Evidence / next gate |
|---|---|---|
| South African workflow relevance | Design proposal | Site workflow and data inventory needed |
| Fracture model performance | Unresolved | No trained radiograph artifact or local cohort |
| De-identification | Unresolved for real data | DICOM PS3.15 review, pixel inspection, institutional SOP |
| Patient/case access | Verified on local Supabase | Direct Auth, RLS and private Storage checks passed after a database reset; hosted deployment remains untested |
| Runtime and annotation cost | Illustrative only | Measure actual study volume, reviewer time, GPU and storage |

Illustrative planning: 3,000×3,000×16-bit raw pixels ≈18 MB per image; 10,000 two-view studies ≈360 GB before compression/backups. Five hundred studies × six minutes × two reviewers ≈100 reviewer-hours before adjudication. These are arithmetic assumptions, not measured project costs. Pitch: a clinician-reviewed registry and narrow assessment feasibility study; ask for a named clinical sponsor, annotation design and data inventory before any performance claim.
