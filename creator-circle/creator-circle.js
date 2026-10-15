// SCC enrollment: classic script, Firebase compat SDK loaded by SCC-only bootstrap.
// Avoid ES module imports which can fail on mobile embedded browsers.
const initializeApp=(config)=>firebase.initializeApp(config,"scc");
const getAuth=(app)=>app.auth();
const getFirestore=(app)=>app.firestore();
const doc=(db,collection,id)=>db.collection(collection).doc(id);
const getDoc=(ref)=>ref.get();
const setDoc=(ref,data)=>ref.set(data);
const serverTimestamp=()=>firebase.firestore.FieldValue.serverTimestamp();
const sendSignInLinkToEmail=(auth,email,settings)=>auth.sendSignInLinkToEmail(email,settings);
const isSignInWithEmailLink=(auth,url)=>auth.isSignInWithEmailLink(url);
const signInWithEmailLink=(auth,email,url)=>auth.signInWithEmailLink(email,url);
const onAuthStateChanged=(auth,cb)=>auth.onAuthStateChanged(cb);
const signOut=(auth)=>auth.signOut();
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
 const pending=()=>{try{return JSON.parse(localStorage.getItem(key)||sessionStorage.getItem(key)||"null");}catch{return null;}};
 const savePending=data=>{localStorage.setItem(key,JSON.stringify(data));sessionStorage.setItem(key,JSON.stringify(data));};
 let verifiedUser=null;
 const allowed=new Set(["US","SG","AE","IT","BR","JP","OTHER"]);
 const platformAllowed=new Set(["Instagram","TikTok","YouTube","Other"]);
 function validProfile(value){
   try{const u=new URL(value);return u.protocol==="https:" && Boolean(u.hostname) && !["localhost","127.0.0.1"].includes(u.hostname);}catch{return false;}
 }
 async function activate(user,data){
   const ref=doc(db,"sccCreators",user.uid);
   const snapshot=await getDoc(ref);
   if(!snapshot.exists){
     if(!data||user.email?.toLowerCase()!==data.email.toLowerCase())throw Error("Registration details were not found. Please complete the form again.");
     await setDoc(ref,{
       uid:user.uid,email:user.email.toLowerCase(),name:data.name.trim(),
       country:data.country,platform:data.platform,profileUrl:data.profile,
       membershipStatus:"active",verificationStatus:"unverified",rewardStatus:"locked",
       createdAt:serverTimestamp(),updatedAt:serverTimestamp()
     });
   }
   const member=await getDoc(ref);
   const memberId="SCC-"+user.uid.slice(0,10).toUpperCase();
   $("member-id").dataset.memberId=memberId;
   $("member-id").textContent="Member ID · "+memberId;
   $("form-view").classList.add("hidden");
   $("success-view").classList.remove("hidden");
   sessionStorage.removeItem(key);
   localStorage.removeItem(key);
   verifiedUser=null;
 }
 const copyButton=$("copy-member-id");
 if(copyButton)copyButton.addEventListener("click",async()=>{
   const id=$("member-id").dataset.memberId;
   if(!id)return;
   try{
     if(navigator.clipboard?.writeText)await navigator.clipboard.writeText(id);
     else{
       const field=document.createElement("textarea");
       field.value=id;field.style.position="fixed";field.style.opacity="0";
       document.body.appendChild(field);field.select();
       const copied=document.execCommand("copy");field.remove();
       if(!copied)throw Error("Copy unavailable");
     }
     $("copy-status").textContent="SCC ID copied. Keep it for future creator applications.";
   }catch{
     $("copy-status").textContent="Copy unavailable. Select the SCC ID above to copy it manually.";
   }
   $("copy-status").classList.remove("hidden");
 });
 $("join-form").addEventListener("submit",async e=>{
   e.preventDefault();
   const btn=$("submit");btn.disabled=true;
   const data={name:$("name").value.trim(),email:$("email").value.trim().toLowerCase(),country:$("country").value,platform:$("platform").value,profile:$("profile").value.trim()};
   try{
     if(data.name.length<2||!allowed.has(data.country)||!platformAllowed.has(data.platform)||!validProfile(data.profile)||!$("consent").checked)throw Error("Please check all fields and your public HTTPS profile URL.");
     if(verifiedUser){
       if(verifiedUser.email?.toLowerCase()!==data.email)throw Error("Please enter your verified email address.");
       await activate(verifiedUser,data);
       return;
     }
     savePending(data);
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
       if(data)await activate(result.user,data);
       else{
         verifiedUser=result.user;
         $("email").value=result.user.email||email;
         msg("Email verified. Please complete the form on this page to activate your Creator Circle membership. No second verification email is needed.");
       }
     }
   }catch(err){msg(err?.message||"Verification failed. Please retry registration.");}
 })();
 onAuthStateChanged(auth,async user=>{
   if(!user)return;
   try{
     const snap=await getDoc(doc(db,"sccCreators",user.uid));
     if(snap.exists)await activate(user,null);
     else if(!verifiedUser && !isSignInWithEmailLink(auth,location.href)){
       verifiedUser=user;
       $("email").value=user.email||"";
       msg("Email verified. Complete the form to activate your membership. No second verification email is needed.");
     }
   }catch(err){msg("Signed in, but your profile could not be loaded. Please try again.");}
 });
}
