# Codex execution guide: convert two burns prototypes into an orthopaedic X-ray platform

Version 1.0 • 8 November 2026 • Prepared for Kyle Bryce Khedun

**This document is the execution specification. Read it completely, then perform the work.** Read the companion [research roadmap](ROADMAP.md) and [evidence register](EVIDENCE_REGISTER.md) before choosing data/model architecture. If the documents are supplied individually, locate the named companions; proceed on independent implementation work if a companion is unavailable, and record the missing evidence dependency.

## 1. Objective and required outputs

Clone the user's two burns repositories, understand their actual implementation and intended workflows, and comprehensively transform the new local working copies into:

1. **Orthopaedic X-ray Database:** a South African research registry and annotation workspace for storing linked radiographic studies, individual views, clinical context, reviewed findings and appropriate training exports.
2. **Orthopaedic X-ray Analyst:** a similarly designed clinician portal for authenticated study submission, image viewing, structured provisional analysis, uncertainty, local evidence and specialist review.

Produce two independent, runnable repositories with a shared versioned data/API contract. The database repo owns canonical backend schema, migrations, annotation/export tools and model experiment scaffolding. The analyst repo consumes that backend and supplies the bedside workflow. Both must be independently installable; avoid undocumented sibling-folder imports.

The database should accommodate the appendicular skeleton and staged future extensions. **The first proposed AI research target is adult acute wrist fracture detection/localisation from a complete study**, pending clinical confirmation and a usable dataset. This is a default bounded task, not a claim of clinical suitability. Keep paediatric, spine, pelvis, infection, tumour and hardware/follow-up models explicitly separate or unsupported until studied. The UI may store such cases without pretending the model supports them.

Complete local implementation before asking for new GitHub destinations. The user will provide two URLs later. Missing URLs do not block design, coding, local commits, fixtures, tests or documentation.

## 2. Source repositories and protected boundaries

| Source | Clone into new local directory | Future destination |
|---|---|---|
| `https://github.com/NightWing617/Burns-database-prototype.git` | `orthopaedic-xray-database/` | Await user-supplied database URL |
| `https://github.com/NightWing617/burns-analyst-interface.git` | `orthopaedic-xray-analyst/` | Await user-supplied analyst URL |

Never push to, alter or delete either burns origin. Do not create remote repositories or guess account/repository names. Preserve source attribution and applicable notices. The user authorises adaptation of their work; do not invent a third-party license where none exists.

The source `main` heads checked on 8 November 2026 were:

- Database: `dd4e0337d8c3eba5819c59be31d65f8992c70e20`.
- Analyst: `f59083d9b6c038fc4a08e1ed2fb2896b588593cd`.

Inspect the actual heads at execution time and record differences. Preserve any later user changes. Do not blindly reset to these hashes.

### Safe clone procedure

Inspect the workspace and applicable AGENTS.md instructions first. Choose a new parent directory if target directories already contain user work. For fresh targets, use separate commands such as:

```bash
git clone https://github.com/NightWing617/Burns-database-prototype.git orthopaedic-xray-database
git -C orthopaedic-xray-database rev-parse HEAD
git -C orthopaedic-xray-database remote -v
git -C orthopaedic-xray-database remote remove origin
git -C orthopaedic-xray-database switch -c feat/orthopaedic-conversion
```

Repeat for the analyst source and corresponding local directory. Record the source URL/commit before removing its origin remote. This deliberately prevents accidental publication to the burns source. Retain Git history and attribution; do not remove `.git` or rewrite source history. Never run these commands against an existing user checkout without first understanding its state. If cloning/network/authentication is blocked, record the exact blocker and complete accessible research/contracts independently; do not substitute an unverified source archive and claim it was cloned.

Create `docs/SOURCE_PROVENANCE.md`, `docs/IMPLEMENTATION_STATUS.md` and `docs/DECISIONS.md` early. Checkpoint durable progress for long tasks. Use completion states: implemented, verified, blocked, planned. Do not describe a scaffold as a connected live feature.

## 3. Inspect before redesigning

Read all entrypoints, scripts, styles, README, workflows, dependencies, licenses and relevant history. Run the original locally if possible. Verify rather than assume the earlier audit:

- Fake login navigation; fixed results after a timer, including with missing input.
- Random confidence-bar widths and CSS gradient heatmap.
- Inert search/filters and all gallery links targeting one case.
- Unsupported institutional, approval, clinical-performance and security claims.
- Actual persistence, image handling and any newly added integration.

Produce `docs/01_SOURCE_AUDIT.md` with current commit/file/line evidence, actual versus simulated features, useful reusable design components, risks, and a burns→orthopaedics migration map.

The goal is full domain and workflow conversion. Retaining a burns layout while changing headings is insufficient. Preserve the useful professional style and conceptual relationship between registry and analyst. Replace colours/names/icons where appropriate, remove dead controls, rewrite all visible domain content and implement working behaviours. Keep burns references only in provenance/history and deliberately preserved research documents.

## 4. Maintainable implementation architecture

Prefer a simple modular frontend with TypeScript or clear JavaScript, compiled/local CSS, JSON Schema/OpenAPI contracts and explicit service adapters. A lightweight build tool such as Vite is reasonable if needed for image-viewer workers and modules. Do not migrate to a large framework solely for novelty. Explain the chosen stack in an architecture decision.

Pin dependencies, commit lockfiles, and verify current library documentation. Do not load production dependencies or model keys from uncontrolled runtime CDNs. Ensure route, asset and worker paths work beneath an arbitrary GitHub Pages repository subpath. Do not hard-code the eventual repository name.

### Three explicit execution modes

| Mode | Behaviour | Identity/data boundary |
|---|---|---|
| `demo` | Fully navigable synthetic studies, annotation and deterministic simulated analysis; local-only edits | Explicit “Enter synthetic demo” button. No fake email/password represented as security. Reset available. |
| `local-research` | Real local Supabase Auth/Postgres/private Storage and local API/worker where available | Seeded test accounts and institution/case policies; use synthetic fixtures only in this task. |
| `configured-research` | Same interfaces against a deliberately configured approved backend/provider | Disabled until configuration exists; no silent fallback to mock results. |

Define capabilities explicitly. In demo mode, say which edits persist only in that browser; store only synthetic fixtures locally. In authenticated modes, denied backend access must remain denied even if the UI hides a control. Missing Docker/local Supabase can block local integration tests, but not the frontend/contracts/scaffolding. Report such tests as blocked, not passed.

Own backend schema/migrations and training scripts in the database repo. Version canonical contracts there, distribute a reproducible snapshot/package to the analyst and verify checksums/version compatibility in CI. Do not maintain two incompatible schema definitions or deploy competing migrations from both repositories. Provide one local integration runbook for both apps.

## 5. Database application: required working screens

Implement at least:

1. **Registry dashboard:** independently counted patients, episodes, studies and images; counts derived from synthetic records rather than invented clinical impact numbers.
2. **Study gallery:** combined filters for anatomy, laterality, age group, mechanism, finding, study phase, view availability, capture domain, annotation/review state and training eligibility. Search, sorting, pagination and empty/error states must work.
3. **Unique study detail:** view thumbnails, configurable side-by-side display, clinical context, linked pre/post studies, findings, masks/boxes, reports and review history. Stable IDs/routes survive refresh and link sharing within the access policy.
4. **Ingestion:** multiple images per study, file validation, ordering, view/laterality confirmation, duplicate warning and de-identification status. Group studies deliberately; never mix patients automatically because filenames look similar.
5. **Annotation workspace:** per-image bounding boxes and structured findings; link observations across views at study level. Support edit/undo/delete and geometry validation. Masks/measurement features may be staged, but must be clearly distinguished from implemented boxes.
6. **Independent review/adjudication:** author, reviewer, disagreement and final decision; model-blinded reference review where feasible. Do not let a user approve their own independent second review.
7. **Dataset version/export:** select only eligible, reviewed data; immutable manifest/split assignments, lineage and rights; no identifying fields or raw signed URLs in public output. Restrict actual exports to authorised roles.
8. **Governance/status:** permitted uses, exclusion/withdrawal flags and audit view; no claim that a UI checkbox alone establishes legal permission.

### Canonical hierarchy and fields

Use `patient → injury episode → encounter → imaging study → series → instance/frame`, with a separate injury/lesion entity that may be visible on several views. Link follow-up and pre/post-reduction studies to the episode; they must not become separate independent training patients.

| Entity | Required contract content |
|---|---|
| Patient/episode | Pseudonymous identifiers, age at acquisition, relevant clinical context and institutional ownership; linkage identifiers kept separately |
| Study | Acquisition time/relative timing, body region, laterality with source/certainty, trauma phase, expected/available views, capture domain, indication and readiness |
| Image | Format, decoded dimensions/bit depth, photometric interpretation where applicable, geometry/spacing validity, hash, source/derivative lineage, view source/certainty, de-identification review |
| Examination | Wound/open status, named neurovascular findings, pain/skin concerns and examination timestamp with explicit unknown states |
| Finding | Bone/segment/site, image/region references, fracture status including indeterminate, morphology, displacement/angulation where assessed, joint extension/alignment and source/certainty |
| Labels | Target ontology/version, annotator and evidence used, independent review, adjudication, reference method/time and eligibility |
| Outcome | Confirmatory imaging/specialist report, follow-up and treatment as observed events; not automatic truth about optimal care |
| AI run | Input snapshot/hash, model artifact/revision, preprocessing/calibration/prompt versions, supported scope, run state, findings, evidence, limitations and clinician disposition |

Do not force AO/OTA or Salter–Harris codes when not adequately supported; use unknown/not applicable and record classification version/licensing. Distinguish absent, not assessed, indeterminate and unsupported. Absence of a fracture box is not an explicit negative label.

## 6. Radiograph ingestion and viewer requirements

Support PNG/JPEG demo ingestion and a genuine tested DICOM research path, scoped to declared CR/DX single-frame formats initially. Detect unsupported compressed/multi-frame data and return a specific error rather than a blank image or guessed conversion. Generate a synthetic DICOM fixture for decoder tests. If a codec is unavailable, reject that transfer syntax explicitly.

Use a suitable maintained viewer/decoder, such as a currently documented Cornerstone integration. Respect modality/VOI transformations, pixel representation, stored bit depth and MONOCHROME1 versus MONOCHROME2. Record the deterministic display/model preprocessing pipeline. A thumbnail is not the model input or the complete diagnostic image.

Viewer tools: zoom, pan, reset, side-by-side views, window/level where meaningful, overlay toggle and original versus derived image indication. Do not mirror anatomy silently. Metadata, visible markers and entered laterality may conflict; require resolution or preserve unknown. Label uncalibrated measurements as pixels; detector pixel spacing alone does not guarantee true anatomical millimetres because of projection magnification. State any angle/length convention and uncertainty.

Separate capture domains: native DICOM, direct exported radiograph, screenshot, photograph of film and photograph of a monitor. Domain labels, quality gates and evaluation must remain separate. The default model scope should reject photographic domains unless tested for them.

De-identification must address headers, private tags, UIDs/date policy, overlays and identifying burned-in pixels. Use quarantine before research eligibility. Keep clinically relevant side markers where appropriate. Changing a DICOM flag, converting to JPEG, removing a header or putting an opaque overlay over identifiers does not prove de-identification. Follow the DICOM source in the evidence register and document human review. Do not attempt to connect to a hospital PACS or retrieve clinical studies without explicit institutional authorisation.

## 7. Analyst application: required workflow

Retain the simple burns prototype concept: case input and images on one side, structured analysis/review on the other. Add radiograph-specific study tabs and multi-view viewing.

Implement:

1. Clearly separated demo entry and configured real login/session/logout flows.
2. Case selection or pseudonymous new case; clinical question, age, mechanism, injury timing, anatomy/laterality, relevant wound and neurovascular observations.
3. Multi-file study upload, preview, view association and explicit confirmation of missing/conflicting views.
4. A manual clinical-concern pathway available before AI. Suspected open injury, neurovascular concern or other urgent clinical findings must not wait for or be suppressed by model output. Use approved local protocols for actual action wording; otherwise label content as an inactive illustrative rule awaiting review.
5. Async analysis job creation and polling with idempotent retry, cancellation handling, progress and failure states. Bind the job/result to the exact study/version/user access context.
6. Output: scope/quality, images and views used, provisional findings/regions, possible interpretation, uncertainty, missing information, limitations, evidence-linked considerations and specialist-review status.
7. Clinician correction and review request. Saving a draft must not mark it adjudicated or training-eligible.
8. Case history and review queue. Any sharing/referral requires an identified authorised recipient, minimum necessary data, access grant and audit event; no anonymous public patient link.

A “no fracture detected” result must not imply injury excluded, safe discharge, intact neurovascular function, absence of open fracture or no need for clinical review. No fracture diagnosis alone determines cast position, reduction, antibiotics or operative treatment. Preserve escalation for clinical concern, inadequate views or discordance. Do not generate unverified dosing or procedural instructions.

## 8. Authentication, Supabase and backend controls

Implement local schema/migrations and configuration for Supabase Auth, Postgres, private Storage and optional pgvector. Use an institution/membership/case-access model, not “all authenticated users can see all cases.” Verify current Supabase documentation before code, including RLS, views, storage and current API conventions.

Required controls:

- RLS and matching Storage policies; deny unauthenticated and cross-institution/cross-case reads, writes, thumbnails, inference retrieval and exports by default.
- Roles cannot be self-promoted through editable user metadata. Enforce reviewer/adjudicator permissions server-side.
- Publishable client config only in frontend; service/secret credentials stay server-side. Include `.env.example`, ignore live env files and prevent sensitive logging.
- Server-side validated sessions, case access and model capability checks on job submission, worker processing and result retrieval. Do not treat a client-supplied user/institution ID as authority.
- Limited-size uploads with decoded-content validation, checksums, private object paths, and short-lived authorised asset access. Protect against decompression bombs and malicious files/URLs.
- JSON/text context and imported reports are untrusted data, not instructions. Prevent arbitrary remote-URL fetching and prompt-driven tools from obtaining broader access.
- Exact approved origins for credentialed CORS; no wildcard bypass. Rate limits and request-size/time bounds.
- No patient-image service-worker cache or browser persistence in research mode. Purge in-memory images and object URLs at logout where feasible; design separate device security before any offline patient capture.
- Tested job failure/rollback and duplicate handling. A partial upload cannot silently become a complete or training-ready study.
- Restricted audit write paths and retention; do not claim tamper-proof auditing merely because a table exists.

Maintain a security/access test matrix with real direct API attempts when the local backend is available. Mock tests are useful but cannot prove deployed RLS. Do not create or alter a live Supabase project during this task.

## 9. Model interfaces, architecture and training scaffolding

Create a provider-neutral interface that accepts a study with supported views and structured context and returns schema-validated output. Providers:

- `MockProvider`: deterministic fixture results, prominently simulated and never clinical-performance evidence.
- `LocalModelProvider`: integration for a deliberately configured trained artifact/runtime; fails explicitly if unavailable or incompatible.
- Optional `RemoteResearchProvider`: institution-approved endpoint, disabled until configured and reviewed.

Do not train on every upload automatically or invent a model/checkpoint. No approved labelled radiograph dataset or trained orthopaedic artifact is supplied with this brief. Implement real load/inference plumbing and reproducible training scripts; use synthetic smoke tests and clearly mark real clinical training/evaluation as pending eligible data and compute.

Recommended research sequence: clinical-only/simple baseline → pretrained vision encoder + small classifier → fracture localisation model if labels support it → multi-view aggregation → optional VLM structured-report adapter. Compare MedSigLIP, a standard DINOv2 checkpoint, MedGemma 1.5 4B and Qwen3-VL-8B-Instruct where appropriate. SAM is annotation assistance, not automatic fracture reasoning. Select exact code/weight licenses; some popular detection implementations impose different commercial terms, so no unreviewed default license choice.

Define a two-part architecture: visual evidence prediction plus a versioned clinical-context/evidence layer. The report model cannot fabricate an image finding or override safety rules. Retrieval can provide reviewed analogous cases but is not training and must obey access, anatomy, age/domain and test-patient exclusions.

Training scaffolding must include dataset validation, patient-grouped split manifests, deduplication, preprocessing configs, class balance, seeds, baseline training, calibration, evaluation, experiment logging and a model card. Include fine-tuning/adapters as a later recipe, not an asserted completed model. Synthetic training may demonstrate pipeline mechanics only.

Model registry fields: artifact URI/hash, ontology/contract versions, dataset/split hashes, input modality/domain, anatomical/age scope, preprocessing, calibration, thresholds, measured metrics/uncertainty, license, intended use, limitations, reviewer, promotion state and rollback version. An artifact with incompatible scope or schema must not be selectable simply because a file exists.

## 10. Evaluation and clinical research design

- Independent patients, all views, patches, derived images, serial studies and post-reduction images must remain in the same partition. Handle repeat/contralateral imaging consistently.
- Explicitly distinguish study-level, image-level and lesion-level labels/metrics. Never relabel MURA “abnormal” as “fractured.”
- Freeze development/calibration/test cohorts. Test outside the development site/time period and evaluate target South African case mix, machines and acquisition pathways.
- Use independent expert reference assessment and adjudication; document when CT/follow-up changes the reference label. Do not supply those future results as index-time model inputs.
- Hide AI suggestions during reference assessment or measure induced bias. Clinician agreement with AI is not an independent reference standard.
- Evaluate sensitivity/specificity, AUROC/AUPRC, PPV/NPV at stated prevalence, calibrated risk, abstention, localisation FROC or suitable detection metrics and patient-level uncertainty. No universal arbitrary accuracy target.
- Analyse clinically important misses, normal variants, casts/hardware, poor views, occult injuries and unsupported anatomy/age groups. Report sample-size limits.
- Plan clinician-alone versus clinician-plus-AI evaluation with appropriate ordering/washout, reviewer balance and statistical input. No claim of patient benefit from a retrospective leaderboard score.

## 11. Fixtures and verification

Use enough synthetic studies to exercise real workflows. Suggested fixtures: no visible abnormality with persistent clinical concern; distal radius finding across PA/lateral; inadequate single view; conflicting laterality; paediatric study outside adult model scope; cast/hardware; pre/post-reduction linked studies; malformed file; MONOCHROME1 DICOM; model timeout; denied cross-institution case. Use generated geometric/anatomy schematics labelled synthetic, not fabricated photorealistic clinical truth.

Required verification:

| Area | Checks |
|---|---|
| Domain conversion | No burns fields in active orthopaedic UI/contracts; no unsupported approval/accuracy/team claims; source acknowledgements retained |
| Registry | Combined filters, stable deep links, study/view grouping, review transitions, export eligibility and actual derived counts |
| Viewer | Supported image/DICOM rendering, inversion/bit-depth fixtures, zoom/reset, geometry persistence, no silent mirroring/calibration claims |
| Analyst | Missing/invalid study, missing views, unsupported scope, duplicate jobs, stale study version, timeout, unavailable provider and no fake-success fallback |
| Security | Direct unauthenticated/cross-case/role-escalation/storage/retrieval/export tests where backend runs; secrets scan and malicious metadata/file checks |
| ML integrity | Patient split assertions, duplicate/derived-image isolation, future-label exclusion, ontology mapping and synthetic-versus-clinical metrics separation |
| Usability | Phone/desktop sizes, keyboard/focus, labels, contrast, realistic slow/failed network and accessible errors |
| Build/integration | Each repo installs/builds independently; shared contract versions match; both apps use the same seeded backend in integration mode |

Run meaningful tests and show actual results. Do not substitute implementation-mirroring tests for cross-boundary behaviour. Do not claim deployment or clinical validation from a successful build. If a dependency prevents a check, explain the exact command/environment and retain the test/runbook for the user.

## 12. Required deliverables in the new repositories

Both repositories: updated README, source provenance, architecture/mode explanation, environment examples, pinned dependencies, working screens, synthetic fixtures, appropriate tests, screenshots/local review evidence, implementation status and clear run instructions.

Database repository additionally owns:

- Canonical schemas/OpenAPI, schema versioning and the analyst contract-export mechanism.
- Local Supabase migrations/seed/access tests and inference service/worker contracts.
- Annotation manual, eligibility/export manifest tools and study/lesion mapping.
- Reproducible experiment/training/evaluation scaffolding and model registry/card template.

Copy/adapt the companion research roadmap and evidence register to `docs/research/` in both repos, fix relative links, and maintain the database copy as canonical with a documented sync/version process. Add a backlog, risk register, claim/evidence ledger, cost assumptions and pitch notes. Keep real data/identifiers outside Git and CI logs.

Maintain `docs/PUBLISH_HANDOFF.md` in each repo with local path, current commit, checks, destination status, expected demo build/base-path configuration, backend requirements and unresolved blockers. Do not copy secrets into it.

## 13. Destination URLs and later pushing

Once local work is complete, ask only for the two destinations and clearly map database versus analyst. Leave both repositories intact with local commits and documentation; do not lose completed work while waiting. Do not start public hosting or clinical deployment as an implied consequence of pushing source.

When the user later supplies the exact URLs with the expected push instruction:

1. Validate each destination is the intended repository and is not either burns origin. Confirm account ownership/access and inspect existing branches/content.
2. Add the supplied URL as the new `origin` for the corresponding local clone. Never interpolate untrusted URLs through unsafe shell construction.
3. For an empty destination, push the prepared branch/default branch as appropriate and set upstream. For a nonempty destination, integrate without overwriting user work or push a new feature branch and prepare a reviewable PR. No force push or history rewrite.
4. Review inherited workflows first. Do not carry across automatic deployment/publishing triggers unintentionally. Keep public demo hosting separate from a private clinical backend.
5. Verify the pushed commit through GitHub and report links. If permission/network access blocks the push, preserve commits and provide exact next actions without claiming success.

No further conversational permission is needed for already-authorised routine local implementation or the later explicitly requested push. Ask only for essential missing decisions that actually block dependent work; continue independent work meanwhile.

## 14. Completion response

Report:

- The two local paths, source/current commit IDs and main functional changes.
- What works in demo, what was verified in local research mode, and what requires configuration.
- Tests actually run with pass/fail/blocked status and review evidence.
- Exact trained-model status: none, synthetic smoke artifact, research checkpoint or externally validated artifact, as supported by evidence.
- Known limitations and next three actions.
- The two destination URLs still needed, if not yet supplied.

Do not stop after an audit, brainstorming document, visual reskin or a promise to continue. Complete the comprehensive bounded research MVP, contracts, reproducible scaffolding and handoff that are possible without actual clinical data, paid infrastructure or missing destination URLs.
