# MedaStaré website deployment

Deploy this entire folder to Vercel. Do not upload only `index.html`, because the application and App Store links depend on the legal pages in this package.

## Public application routes

* `/privacy`
* `/terms`
* `/support`
* `/account-deletion`
* `/privacy-choices`
* `/ai-data-processing`
* `/subscription-terms`

`vercel.json` enables the clean routes while preserving the corresponding `.html` files.

## Homepage protection

The existing MedaStaré homepage was preserved. Only the footer legal links were expanded and one footer wrapping rule was added so the additional links fit responsively. Hero content, product cards, About, market cards, device mockups, animations, colors and JavaScript were not changed.

## Before App Store submission

Review `LEGAL_LAUNCH_REVIEW.md`. Confirm the exact corporate public address, active AI and infrastructure providers, backend retention and deletion behavior, subscription configuration and launch-region legal review. Keep the app disclosures, App Store Connect privacy answers and these pages synchronized.
