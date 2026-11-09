# Transfer from the burns showcase

Reviewed the companion local Burns projects at `burnbank` commit `bf1e1a95a0bd909584c15f98f8c67f99a7affcc3` and `burndx` commit `7302c882391db3093b29b70642576e56bfd7e0f7` on 9 November 2026. Their case records are fictional burns examples; none was imported as an orthopaedic patient, image or label.

| Burns pattern | Radiograph adaptation |
|---|---|
| BurnDx upload-first preview and file checks | A keyboard-accessible drag/drop target feeds the existing PNG/JPEG/DICOM view association, decoded-content checks, duplicate detection and quarantine workflow. |
| BurnDx unknown/yes/no concern pathway | Existing open-wound, perfusion and nerve states remain separate from simulated analysis. The new handover flags marked concerns and preserves not-assessed states. |
| BurnDx deterministic handover | A structured draft summarises the saved context, expected and available views, missing fields, concern note and review flags. It can be copied for clinician review but sends nothing. |
| BurnBank linked events and explainable search | The registry repo now shows ordered episode acquisitions and `XR-` concept match explanations. |

Burn-specific TBSA, depth, dressing fields and fixed example analysis were not copied. No Vula account connection, referral transmission, image inference or clinical rule is claimed. GitHub Pages serves the synthetic demo only.
