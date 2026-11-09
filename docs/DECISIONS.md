# Architecture decisions — 9 November 2026

The inherited input-left/results-right concept is retained using static ES modules and local CSS. There are no runtime CDNs or required package dependencies. Relative paths support arbitrary repository subpaths.

The analyst consumes a snapshotted version 0.1.0 study/analysis contract and shared bounded DICOM decoder from the database repo. `contracts/SHA256` is checked in tests. Database migrations remain canonical in the database repo.

Demo mode explicitly uses generated schematics, browser-only data and deterministic mock output. Research mode requires local publishable configuration and Auth, then reads RLS-authorised metadata, creates quarantined synthetic studies and fetches private objects. Analysis is disabled there until a protected worker, approved artifact and scope/quality controls exist. No mock fallback or public patient link is available.
