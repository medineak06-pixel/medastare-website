'use strict';
// Deploy as a standalone Firebase Functions codebase; no service account JSON required.
// Only verified Firebase Auth users can create their own SCC profile.
const {onRequest} = require('firebase-functions/v2/https');
const {initializeApp,getApps} = require('firebase-admin/app');
const {getAuth} = require('firebase-admin/auth');
const {getFirestore,FieldValue} = require('firebase-admin/firestore');
if (!getApps().length) initializeApp();
const allowedOrigins = new Set(['https://medastare.com','https://www.medastare.com']);
const countries = new Set(['US','SG','AE','IT','BR','JP','OTHER']);
const platforms = new Set(['Instagram','TikTok','YouTube','Other']);
const profileOk = value => {
  if (typeof value !== 'string' || value.length > 500) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname.includes('.') &&
      !['localhost','127.0.0.1'].includes(url.hostname) &&
      !url.username && !url.password;
  } catch {return false;}
};
exports.sccEnroll = onRequest({
  region:'us-central1',cors:false,invoker:'public',maxInstances:10,
  timeoutSeconds:30,memory:'256MiB'
},async(req,res)=>{
  res.set('Cache-Control','no-store');
  const origin=req.headers.origin;
  if (allowedOrigins.has(origin)) {
    res.set('Access-Control-Allow-Origin',origin);
    res.set('Vary','Origin');
    res.set('Access-Control-Allow-Headers','Authorization, Content-Type');
    res.set('Access-Control-Allow-Methods','POST, OPTIONS');
  }
  if (!allowedOrigins.has(origin)) return res.status(403).json({error:'Origin not allowed'});
  if (req.method==='OPTIONS') return res.status(204).end();
  if (req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  const authorization=req.headers.authorization||'';
  const token=authorization.startsWith('Bearer ')?authorization.slice(7):'';
  if (!token || token.length>8192) return res.status(401).json({error:'Sign in required'});
  try {
    const user=await getAuth().verifyIdToken(token,true);
    if (!user.email_verified || !user.email) return res.status(403).json({error:'Verified email required'});
    const ref=getFirestore().collection('sccCreators').doc(user.uid);
    const memberId='SCC-'+user.uid.slice(0,10).toUpperCase();
    const existing=await ref.get();
    if (existing.exists) return res.status(200).json({memberId,status:'active'});
    const data=req.body||{};
    if (typeof data.name!=='string' || data.name.trim().length<2 ||
        data.name.trim().length>100 || !countries.has(data.country) ||
        !platforms.has(data.platform) || !profileOk(data.profile) ||
        data.consent!==true || String(data.email||'').toLowerCase()!==user.email.toLowerCase()) {
      return res.status(400).json({error:'Invalid registration details'});
    }
    try {
      await ref.create({
        uid:user.uid,email:user.email.toLowerCase(),name:data.name.trim(),
        country:data.country,platform:data.platform,profileUrl:data.profile,
        membershipStatus:'active',verificationStatus:'unverified',rewardStatus:'locked',
        createdAt:FieldValue.serverTimestamp(),updatedAt:FieldValue.serverTimestamp()
      });
    } catch(err) {
      if (err.code!==6 && err.code!=='already-exists') throw err;
    }
    return res.status(200).json({memberId,status:'active'});
  } catch(err) {
    if (err.code==='auth/id-token-expired' || err.code==='auth/argument-error' ||
        err.code==='auth/id-token-revoked') return res.status(401).json({error:'Invalid or expired session'});
    console.error('SCC enrollment:',err.code||err.message);
    return res.status(500).json({error:'Enrollment failed'});
  }
});
