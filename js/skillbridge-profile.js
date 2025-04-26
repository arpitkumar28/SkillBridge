// SkillBridge: Dynamic Profile Display (modular, non-intrusive)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, updateProfile } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBbWgTUhdvtf00UnvHOKz-_cqBrQggdBo4",
  authDomain: "skillbridge-90392.firebaseapp.com",
  projectId: "skillbridge-90392",
  storageBucket: "skillbridge-90392.appspot.com",
  messagingSenderId: "208543781402",
  appId: "1:208543781402:web:671bc3ebdf06fc6b18b7a3",
  measurementId: "G-DPPSFN4CLG"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const userName = document.getElementById('userName');
const userBio = document.getElementById('userBio');
const skillsToShare = document.getElementById('skillsToShare');
const skillsToLearn = document.getElementById('skillsToLearn');
const stats = document.querySelectorAll('.stat-value');

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    userName.textContent = "Not logged in";
    userBio.textContent = "";
    skillsToShare.innerHTML = "";
    skillsToLearn.innerHTML = "";
    stats[0].textContent = "0";
    stats[1].textContent = "0";
    return;
  }
  // Fetch user data from Firestore
  let displayName = user.displayName || "";
  let bio = "";
  let teachSkills = [];
  let learnSkills = [];
  let connections = 0;
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.displayName) displayName = data.displayName;
      if (data.bio) bio = data.bio;
      if (data.skillsTeach) teachSkills = data.skillsTeach;
      if (data.skillsLearn) learnSkills = data.skillsLearn;
      if (data.connections) connections = data.connections;
    }
  } catch (e) {
    // fallback to auth data
  }
  userName.textContent = displayName || "No Name";
  userBio.textContent = bio || "Student on SkillBridge";
  // Render teach skills
  skillsToShare.innerHTML = (teachSkills.length > 0)
    ? teachSkills.map(skill => `<span class="skill-chip">${skill}</span>`).join(' ')
    : '<span style="color:#aaa;">No skills listed</span>';
  // Render learn skills
  skillsToLearn.innerHTML = (learnSkills.length > 0)
    ? learnSkills.map(skill => `<span class="skill-chip">${skill}</span>`).join(' ')
    : '<span style="color:#aaa;">No skills listed</span>';
  // Update stats
  stats[0].textContent = teachSkills.length;
  stats[1].textContent = learnSkills.length;
  stats[2].textContent = connections || 0;
});

