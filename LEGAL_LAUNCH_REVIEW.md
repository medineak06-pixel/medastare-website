# MedaStaré legal launch review

The public legal pages are fully written and connected to the application routes. They are designed to support Apple review and the current global launch plan.

## Confirm before production launch

1. Confirm the registered corporate address approved for public display. Do not publish a private home address without a deliberate legal decision.
2. Confirm whether MedaStaré Inc. is formally incorporated in Delaware and confirm the registered entity spelling.
3. Confirm the actual application cloud, database, analytics, crash reporting, support and notification providers. Update subprocessors.html.
4. Confirm which AI providers are active for each feature, provider API retention and whether model training is contractually disabled. The in app consent must show the actual provider.
5. Confirm backend retention and deletion behavior matches the Privacy Policy and Account Deletion page.
6. Confirm the production account deletion endpoint, data export endpoint, consent withdrawal endpoint and status handling are implemented.
7. Confirm the minimum user age. These pages currently state 18 years.
8. Confirm subscription names, benefits and StoreKit product configuration. Prices must come from StoreKit, not this website.
9. Confirm whether nonessential website analytics is enabled. The current source contains no advertising or analytics tag. Add a compliant consent manager before activating nonessential analytics where required.
10. Complete legal review and localization for Italy, Brazil, the United Arab Emirates, Singapore and the Philippines before active consumer launch where required.
11. Keep App Store Connect privacy answers, PrivacyInfo.xcprivacy, in app disclosures and these pages synchronized.
12. Use Apple Standard EULA unless counsel deliberately selects and supplies a custom EULA with all Apple minimum terms and the required developer address.

## Deployment

Deploy the entire folder, not only index.html. The included vercel.json enables clean routes such as /privacy and /terms while the .html files remain directly available.

## Files intentionally not linked from the main footer

community-guidelines.html and copyright.html are included for activation when social or user content features are released. They may be linked from the app and Terms when those functions are enabled.
