// SCC enrollment — Firebase credentials are deliberately not committed.
// Configure window.MEDASTARE_SCC_FIREBASE in creator-circle/firebase-config.js
// using public Firebase Web SDK config (never a service-account/private key).
import {initializeApp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {getAuth,sendSignInLinkToEmail,isSignInWithEmailLink,signInWithEmailLink,onAuthStateChanged,signOut} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,serverTimestamp} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
const $=id=>document.getElementById(id);
const msg=(s)=>{$("message").textContent=s;$("message").classList.remove("hidden");};
const config=window.MEDASTARE_SCC_FIREBASE;
if(!config?.apiKey||!config?.projectId||!config?.authDomain){
  $("setup").classList.remove("hidden");
  $("form-view").classList.add("hidden");
}else{
 const app=initializeApp(config,"scc");
 const auth=getAuth(app),db=getFirestore(app);
 document.getElementById("join-form").dataset.sccReady="true";
 const key="medastare_scc_pending_v1";
 const pending=()=>{try{return JSON.parse(sessionStorage.getItem(key)||"null");}catch{return null;}};
 const allowed=new Set(["US","SG","AE","IT","BR","JP","OTHER"]);
 const platformAllowed=new Set(["Instagram","TikTok","YouTube","Other"]);
 function validProfile(value){
   try{const u=new URL(value);return u.protocol==="https:" && Boolean(u.hostname) && !["localhost","127.0.0.1"].includes(u.hostname);}catch{return false;}
 }
 async function activate(user,data){
   const ref=doc(db,"sccCreators",user.uid);
   const snapshot=await getDoc(ref);
   if(!snapshot.exists()){
     if(!data||user.email?.toLowerCase()!==data.email.toLowerCase())throw Error("Registration details were not found. Please complete the form again.");
     await setDoc(ref,{
       uid:user.uid,email:user.email.toLowerCase(),name:data.name.trim(),
       country:data.country,platform:data.platform,profileUrl:data.profile,
       membershipStatus:"active",verificationStatus:"unverified",rewardStatus:"locked",
       createdAt:serverTimestamp(),updatedAt:serverTimestamp()
     });
   }
   const member=await getDoc(ref);
   $("member-id").textContent="Member ID · SCC-"+user.uid.slice(0,10).toUpperCase();
   $("form-view").classList.add("hidden");
   $("success-view").classList.remove("hidden");
   sessionStorage.removeItem(key);
 }
 $("join-form").addEventListener("submit",async e=>{
   e.preventDefault();
   const btn=$("submit");btn.disabled=true;
   const data={name:$("name").value.trim(),email:$("email").value.trim().toLowerCase(),country:$("country").value,platform:$("platform").value,profile:$("profile").value.trim()};
   try{
     if(data.name.length<2||!allowed.has(data.country)||!platformAllowed.has(data.platform)||!validProfile(data.profile)||!$("consent").checked)throw Error("Please check all fields and your public HTTPS profile URL.");
     sessionStorage.setItem(key,JSON.stringify(data));
     await sendSignInLinkToEmail(auth,data.email,{url:location.origin+"/creator-circle/",handleCodeInApp:true});
     msg("Verification email requested successfully. Check your inbox and spam folder. Your membership is NOT active until you open the verification link and your profile is saved.");
   }catch(err){msg("Registration was not completed: "+(err?.code||err?.message||"Unable to send verification email. Please try again."));}
   finally{btn.disabled=false;}
 });
 $("sign-out").addEventListener("click",async()=>{await signOut(auth);$("success-view").classList.add("hidden");$("form-view").classList.remove("hidden");});
 (async()=>{
   try{
     if(isSignInWithEmailLink(auth,location.href)){
       const data=pending();
       const email=data?.email||prompt("Enter the email address used to join Creator Circle:");
       if(!email)return;
       const result=await signInWithEmailLink(auth,email,location.href);
       history.replaceState({},document.title,location.pathname);
       await activate(result.user,data);
     }
   }catch(err){msg(err?.message||"Verification failed. Please retry registration.");}
 })();
 onAuthStateChanged(auth,async user=>{
   if(!user)return;
   try{
     const snap=await getDoc(doc(db,"sccCreators",user.uid));
     if(snap.exists())await activate(user,null);
   }catch(err){msg("Signed in, but your profile could not be loaded. Please try again.");}
 });
}
