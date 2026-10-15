# SCC Firebase Functions (isolated deployment)

This directory is deliberately separate from the MedaStaré mobile app repository and its existing Firebase Functions codebase.

Deploying requires Firebase CLI access, billing/Blaze eligibility, and suitable IAM permissions. Firebase Admin uses the managed runtime identity; do **not** create or upload service-account JSON keys.

1. In a temporary local working directory, install Firebase CLI and authenticate to project `medastare-502e6`.
2. Configure a dedicated Functions codebase pointing to this folder. **Do not overwrite an existing firebase.json or deploy all functions**; use `firebase deploy --only functions:scc` once the `scc` codebase is configured.
3. Ensure the runtime service account has minimum Firestore read/write permissions and token verification works.
4. Copy the deployed HTTPS endpoint URL into the website SCC client configuration only after testing.
5. Test email link flow on same and different browsers, existing member lookup, duplicate creation, and unauthenticated requests.

No Firestore Rules change is required because Firebase Admin SDK runs server-side. Existing mobile app code and rules remain untouched. Never put service-account keys in website files.
