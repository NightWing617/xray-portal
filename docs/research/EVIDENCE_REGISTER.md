# Orthopaedic radiograph project: evidence and source register

Checked 8 November 2026. Focused primary-source scan; not a systematic review. Numerical source results below describe those studies/datasets, never the proposed product. Access terms, model versions and clinical guidance must be refreshed when implementation begins.

## Evidence relevant to the project

| ID | Source and verified point | Relevance | Limits / action |
|---|---|---|---|
| X01 | [Stanford MURA project](https://stanfordmlgroup.github.io/competitions/mura/), [author paper](https://openreview.net/pdf?id=r1Q98pjiG), [current AIMI listing](https://aimi.stanford.edu/datasets/mura-msk-xrays). Paper: 40,561 images, 14,863 studies; normal/abnormal study target. | Multi-view musculoskeletal abnormality baseline. | Abnormal is not synonymous with fracture. Inspect current dataset-specific access/terms before use; commercial/re-distribution rights are not established here. |
| X02 | [FracAtlas, Scientific Data 2023](https://www.nature.com/articles/s41597-023-02432-4). Bangladesh; 4,083 images, 717 fracture-positive images and 922 fracture instances; localisation/segmentation labels; paper states CC BY 4.0. | Fracture detection/localisation research. | Dataset images include varying regions, combined views and hardware. Patient independence and local generalisation require checking. A bounding box is not a management label. |
| X03 | [GRAZPEDWRI-DX, Scientific Data 2022](https://www.nature.com/articles/s41597-022-01328-z). Austrian paediatric wrist data: 6,091 patients, 10,643 studies, 20,327 images; 16-bit PNG; paper states CC BY 4.0 and prohibits re-identification attempts. | Paediatric wrist and multi-view methodology; possible later dedicated lane. | Children/wrist/Austria are a different target from adult South African general trauma. Review annotations, errors and longitudinal relationships. |
| X04 | [AI-supported fracture detection multi-reader study, 2024](https://pubmed.ncbi.nlm.nih.gov/38757067/). Retrospective study: 15 readers, 340 examinations; reported patient-wise sensitivity 72% unaided versus 80% aided, specificity 81% versus 85%. | Justifies evaluating clinician-plus-AI, not only stand-alone scores. | Balanced retrospective cases and a specific tool do not establish routine South African benefit; inspect the full design before quoting. |
| X05 | [Duron et al., Radiology 2021](https://pubmed.ncbi.nlm.nih.gov/33944629/). Multicentre retrospective reader study in France. | Additional precedent for an aided-reader evaluation. | Selected cases and exclusions limit inference; no claim of local validation or equivalent performance for our system. |
| X06 | [DICOM PS3.15 confidentiality options](https://dicom.nema.org/medical/Dicom/current/output/chtml/part15/sect_E.3.html). Identifying pixel data must be removed; an overlaid graphic is insufficient. | Define de-identification SOP and acceptance checks. | Header cleaning alone does not address burned-in identifiers. Human review may be required; do not simply change a flag to claim compliance. |

The scan did not establish that any proposed model has been independently validated for our exact South African intended use. Do not rewrite that uncertainty as either “no such research exists” or “local performance is proven.”

## Model and engineering resources

| ID | Resource | Appropriate role | Caveat |
|---|---|---|---|
| X07 | [MedSigLIP official card](https://developers.google.com/health-ai-developer-foundations/medsiglip/model-card) | Frozen embeddings, retrieval and small supervised heads | Health AI Developer Foundations terms; medical pretraining is not MSK fracture validation. |
| X08 | [MedGemma 1.5 official card](https://developers.google.com/health-ai-developer-foundations/medgemma/model-card), [official code/tutorials](https://github.com/Google-Health/medgemma) | Structured report experiments; evaluate adaptation | 1.5 is a 4B multimodal variant. Model terms differ from repository-code terms. Raw outputs require validation/adaptation; chest imaging capability does not prove fracture competence. |
| X09 | [Qwen3-VL-8B-Instruct official card](https://huggingface.co/Qwen/Qwen3-VL-8B-Instruct) | General VLM comparator with the same input/output contracts | Card lists Apache 2.0. No validated fracture-management performance inferred. |
| X10 | [DINOv2 official repository](https://github.com/facebookresearch/dinov2) | Standard image backbone baseline, frozen then selectively fine-tuned | Standard DINOv2 backbones/code advertise Apache 2.0; additional model families in the repository can have other terms. Verify the exact checkpoint and notices. |
| X11 | [SAM 2 official repository](https://github.com/facebookresearch/sam2) | Prompted annotation/mask assistance | No built-in fracture diagnosis; assess whether masks are a useful target. Checkpoint/training-code terms are Apache 2.0 with bundled notices. |
| X12 | [MONAI official repository](https://github.com/Project-MONAI/MONAI) | Reproducible medical-imaging transforms/training infrastructure | Toolkit, not a pretrained universal orthopaedic analyst; verify each dependency and weight license. Documentation endpoint timed out in this scan; repository was accessible. |
| X13 | [Cornerstone image-loader documentation](https://www.cornerstonejs.org/docs/concepts/cornerstone-core/imageloader/) | DICOM/web-image viewer integration | Decoder/worker/version support must be tested. Using a library does not make the application a certified diagnostic viewer. |
| X14 | [Supabase private Storage](https://supabase.com/docs/guides/storage/buckets/fundamentals), [permission-aware retrieval](https://supabase.com/docs/guides/ai/rag-with-permissions) | Governed files/metadata and access-filtered similarity search | Private storage, RLS and tested institution/case permissions must be configured; they are not achieved by a login screen. |

Do not hard-code “the best model.” Use comparable, task-specific experiments, exact model revisions, current terms and measured serving costs. A current institution-approved hosted multimodal API can be a comparator after data-use review; this pack does not select an API provider or authorise transmitting clinical images.

## South African clinical and governance anchors

| ID | Source | How to use it |
|---|---|---|
| X15 | [NDoH STGs and EML](https://www.health.gov.za/nhi-edp-stgs-eml/) | Locate current PHC/adult/paediatric guidance and errata. Have local orthopaedics/emergency medicine approve the actual referral/protocol pack. |
| X16 | [SAHPRA AI/ML medical-device communication](https://www.sahpra.org.za/document/regulatory-requirements-of-artificial-intelligence-and-machine-learning-ai-ml-enabled-medical-devices/) | Assess the precise intended use and applicable regulatory obligations. Do not invent a classification or approval. |
| X17 | [Information Regulator guidance](https://inforegulator.org.za/guidance-notes/) | Health and children's information, lawful basis, institutional/operator responsibilities, access, retention and transfers require context-specific review. |
| X18 | [DECIDE-AI author record](https://discovery.ucl.ac.uk/id/eprint/10149145/) and [FUTURE-AI](https://www.bmj.com/content/388/bmj-2024-081554) | Reporting and deployment-planning frameworks for clinical AI. These are guidance, not a regulatory clearance route. |

No clinical dose, fracture reduction technique or operative threshold is specified by this evidence register. Such content must come from a reviewed clinical protocol appropriate to the patient and facility.

## Source-repository provenance

| ID | Repository | `main` commit checked 8 November 2026 |
|---|---|---|
| X19 | [Burns database](https://github.com/NightWing617/Burns-database-prototype) | `dd4e0337d8c3eba5819c59be31d65f8992c70e20` |
| X20 | [Burns analyst](https://github.com/NightWing617/burns-analyst-interface) | `f59083d9b6c038fc4a08e1ed2fb2896b588593cd` |

Existing design is a reusable starting point. The 7 November audit found static sample content and simulated analysis; Codex must verify the state it actually clones and preserve attribution/licensing information. New orthopaedic destinations have not been provided.

## Evidence refresh and claims SOP

1. Open the primary source and record URL/DOI, access date, relevant section and exact claim.
2. Record independent patients, studies and images separately. Do not compare metrics with different analytic units as though identical.
3. For datasets: inspect the current download agreement, provenance, allowed use and patient linkage before ingestion. Registration or a signed agreement must be completed by an authorised person; a public listing is not acceptance.
4. For models: record model ID, revision/hash, code/weight licenses, dependencies, resolution/contexts and hardware measurements.
5. For clinical content: record jurisdiction, care level, age group, section, effective/review date and local approver.
6. Tag claims as observed, published evidence, design proposal or unresolved. Never label a proposal as a measured result.
7. Refresh before a funding/application/pitch claim, dataset import, model promotion or protocol change. Preserve previous versions for reproducibility.

Suggested evidence fields: `id`, `title`, `url`, `doi`, `accessed_at`, `source_type`, `population`, `input_domain`, `patient_count`, `study_count`, `image_count`, `label_target`, `reference_standard`, `split_unit`, `external_validation`, `metric`, `limitations`, `terms_status`, `decision_supported`.
