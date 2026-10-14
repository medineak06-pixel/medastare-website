/**
 * OS-aware destination for MedaStaré's public share links.
 * The recipient goes straight to the appropriate app store, never to a
 * campaign/profile page or the public website.
 *
 * Deliberately ignore type/id query params: they identify the invitation,
 * but MUST NOT be forwarded to Google Play (its own ?id= is the app package).
 */
const APP_STORE = "https://apps.apple.com/app/id6813994639";
const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.medastare.app";

module.exports = function medastareShareToStore(request, response) {
  const userAgent = String(request.headers["user-agent"] || "");
  const store = /android/i.test(userAgent) ? GOOGLE_PLAY : APP_STORE;
  response.statusCode = 302;
  response.setHeader("Location", store);
  response.setHeader("Cache-Control", "private, no-store, max-age=0");
  response.setHeader("Vary", "User-Agent");
  response.end();
};
