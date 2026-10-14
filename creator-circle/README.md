# StarDay Creator Circle (SCC) — staging implementation

This directory contains a draft standalone Creator Circle portal. It is NOT connected to a Firebase project and must not be deployed as a functional registration flow until configured and reviewed.

## Firebase activation checklist
1. Confirm the correct MedaStaré Firebase project and create/register a Web App.
2. Enable Firebase Authentication **Email link (passwordless)** and email/password provider as required by Firebase. Add medastare.com and any preview domain to authorized domains.
3. Create Firestore and deploy the `firestore.rules` contents after reviewing their interaction with the project's EXISTING Firestore rules. **Do not replace global rules blindly.** Integrate only the `sccCreators` match block into existing rules.
4. Create `creator-circle/firebase-config.js` using the public Firebase Web App config (see example). Never commit service-account credentials.
5. Verify `/terms` and `/privacy` links exist or update the links to the correct official legal documents before launch.
6. Add Firebase App Check, abuse/rate limiting and server-side reward eligibility checks before accepting real traffic.
7. Add privacy-compliant consent record and data retention/deletion flows, verify applicable country restrictions and final Creator Terms.
8. Test first registration, existing user login, cross-device email-link flow, Firestore permissions, duplicate signup, malicious input and mobile layout.
9. Only after approval: link from homepage header/hero and deploy.

## Design
Open enrollment after verified email. `sccCreators/{auth.uid}` can be created once, read only by the owner, and cannot be modified from client. Creator earnings and verification remain locked and require privileged backend processes and final rules. No client-side award issuance.

## Important
The frontend `SCC-<UID prefix>` is a display label, not a secure verification token or an official payout identifier. Do not expose application records based solely on this ID.
