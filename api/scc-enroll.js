// Server-only SCC enrollment. No changes to mobile app or Firestore security rules.
// Requires FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL and FIREBASE_ADMIN_PRIVATE_KEY.
const admin = require('firebase-admin');
const https = require('node:https');
const PROJECT = process.env.FIREBASE_ADMIN_PROJECT_ID;
const EMAIL = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.FIREBASE_ADMIN_PRIVATE_KEY;
const origins = new Set(['https://www.medastare.com', 'https://medastare.com']);
const countries = new Set(['US','SG','AE','IT','BR','JP','OTHER']);
const platforms = new Set(['Instagram','TikTok','YouTube','Other']);
const validProfile = value => {
  if (typeof value !== 'string' || value.length > 500) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'https:' && u.hostname.includes('.') && !['localhost','127.0.0.1'].includes(u.hostname);
  } catch { return false; }
};
module.exports = async (req, res) => {
  res.setHeader('Cache-Control','no-store');
  if (req.method !== 'POST') { res.setHeader('Allow','POST'); return res.status(405).json({error:'Method not allowed'}); }
  const origin = req.headers.origin;
  if (!origins.has(origin)) return res.status(403).json({error:'Origin not allowed'});
  if (!PROJECT || !EMAIL || !PRIVATE_KEY) return res.status(503).json({error:'SCC enrollment is being configured'});
  const authorization = req.headers.authorization || '';
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  if (!token || token.length > 8192) return res.status(401).json({error:'Sign in required'});
  try {
    if (!admin.apps.length) admin.initializeApp({credential:admin.credential.cert({projectId:PROJECT,clientEmail:EMAIL,privateKey:PRIVATE_KEY.replace(/\\n/g,'\n')})});
    const identity = await admin.auth().verifyIdToken(token, true);
    if (!identity.email_verified || !identity.email) return res.status(403).json({error:'Verified email required'});
    const ref = admin.firestore().collection('sccCreators').doc(identity.uid);
    const existing = await ref.get();
    const memberId = 'SCC-' + identity.uid.slice(0,10).toUpperCase();
    if (existing.exists) return res.status(200).json({memberId,status:'active'});
    const data = req.body || {};
    if (typeof data.name !== 'string' || data.name.trim().length < 2 || data.name.trim().length > 100 ||
        !countries.has(data.country) || !platforms.has(data.platform) || !validProfile(data.profile) ||
        data.consent !== true || (data.email || '').toLowerCase() !== identity.email.toLowerCase()) {
      return res.status(400).json({error:'Invalid registration details'});
    }
    await ref.create({
      uid:identity.uid,email:identity.email.toLowerCase(),name:data.name.trim(),
      country:data.country,platform:data.platform,profileUrl:data.profile,
      membershipStatus:'active',verificationStatus:'unverified',rewardStatus:'locked',
      createdAt:admin.firestore.FieldValue.serverTimestamp(),
      updatedAt:admin.firestore.FieldValue.serverTimestamp()
    }).catch(async err => {
      if (err.code !== 6 && err.code !== 'already-exists') throw err;
    });
    return res.status(200).json({memberId,status:'active'});
  } catch (err) {
    console.error('SCC enrollment failed:',err.code || err.message);
    return res.status(500).json({error:'Could not complete enrollment'});
  }
};
