# Source audit — 8 November 2026

Source head: `f59083d9b6c038fc4a08e1ed2fb2896b588593cd`. The original is one static `index.html`, a small `style.css`, a Hugging Face Space README and GitHub Pages workflow. It has no backend, model, data contract or tests.

| Evidence at source head | Actual behaviour | Conversion |
|---|---|---|
| `index.html:7` | Tailwind runtime CDN | Local CSS and modules |
| `index.html:744-746,799-803` | Login navigates without authentication | Explicit demo entry; configured Auth path |
| `index.html:749-764` | One image gets a preview only | Grouped, validated multiview study |
| `index.html:770-775` | Confidence bars use `Math.random()` | No fabricated confidence |
| `index.html:815-846` | Timer reveals fixed results without checking input | Input-bound deterministic demo jobs and failure states |
| `index.html:486,522-548,601-615` | Validation, privacy and certification claims unsupported | Evidence and capability status |
| `index.html:621-733` | Pilot form has no submission endpoint | Removed until a governed pilot exists |

Reusable: input-left/results-right clinician workspace and restrained visual hierarchy. Risks: fake security, unsupported diagnosis/management claims and fixed output. Migration: burn image→complete radiographic study; depth/area→versioned fracture observation; heatmap→editable region overlay; fixed recommendations→manual clinical concern and reviewed evidence; fake pilot→research status.
