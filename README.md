# inJectyou

This is an in-progress website for a platform connecting interns with company projects. It is not ready for production use.

## Current state

The account screens use the public Supabase JavaScript SDK and the project's publishable key. Intern and company sign-up and sign-in call Supabase Auth. After sign-in, a user can create their own account record; company accounts start pending. The installed database account policies restrict account reads to the owner and do not permit self-registration as an administrator. These flows still require end-to-end verification with confirmed accounts and properly configured email redirects.

Project applications, company project management, administrative review, payments, file uploads, certificates and messaging are not connected to production. The older `portal.js` is a fictional local demo and is not loaded by the account screens. Do not collect confidential project data or invite real users until the complete service is implemented and reviewed.

## Local preview

Run `node serve.mjs` and visit `http://127.0.0.1:4173`. The server is only for local preview. It serves a restricted set of browser assets and is not a production hosting server. Account access requires network access to the Supabase project. The official Supabase JavaScript SDK is included locally at version 2.119.0; its license is in SUPABASE-LICENSE.txt.

The Supabase publishable key is intended for browser use; never add a secret or service-role key to the repository or browser code. Configure the final site URL and allowed redirect URLs in Supabase Auth before testing email confirmations on a deployed site. Production hosting must provide HTTPS and an appropriate Content Security Policy.

## Checks

Run `node validate.mjs` for asset references, JavaScript syntax, branding and approved runtime dependencies. `node database/test.mjs` tests the separate local SQLite schema; it does not verify the remote Supabase database or its access policies. End-to-end authentication and authorization tests remain necessary.

Keep this source in a private repository unless the owner chooses otherwise. The SQLite file and environment files are excluded by `.gitignore`.


## Project workflows (database installed)

`database/company-briefs.sql` contains a proposed migration for private company briefs, administrator company review, public-to-intern opportunities, and private applications. It was applied to the inJectyou Supabase project on 2026-11-23. Local PostgreSQL tests checked representative role isolation, and live anonymous requests to the account and project tables were denied. Authenticated end-to-end tests against the live project are still required. Admin accounts must be provisioned separately by a trusted operator; users cannot grant themselves the admin role.

This migration does not implement file storage, delivery review, payment processing, payout, certificates, notifications or a full audit trail. Do not use it as evidence that the overall service is production-ready.

