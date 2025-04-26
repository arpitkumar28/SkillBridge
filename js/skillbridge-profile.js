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

// Skill Box Add/Remove Logic
const skillBoxContainer = document.getElementById('skillBoxContainer');
const newSkillInput = document.getElementById('newSkillInput');
const addSkillBtn = document.getElementById('addSkillBtn');

// Separate Skill Box Add/Remove Logic for Share and Learn
const skillsToShareBox = document.getElementById('skillsToShareBox');
const newSkillToShareInput = document.getElementById('newSkillToShareInput');
const addSkillToShareBtn = document.getElementById('addSkillToShareBtn');
const skillsToLearnBox = document.getElementById('skillsToLearnBox');
const newSkillToLearnInput = document.getElementById('newSkillToLearnInput');
const addSkillToLearnBtn = document.getElementById('addSkillToLearnBtn');

let skills = [];
let shareSkills = [];
let learnSkills = [];

function renderSkills() {
  skillBoxContainer.innerHTML = '';
  skills.forEach((skill, idx) => {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-box';
    skillDiv.innerHTML = `
      <span>${skill}</span>
      <button class="remove-skill-btn" title="Remove skill" data-idx="${idx}">&times;</button>
    `;
    skillBoxContainer.appendChild(skillDiv);
  });
}

function renderShareSkills() {
  skillsToShareBox.innerHTML = '';
  shareSkills.forEach((skill, idx) => {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-box';
    skillDiv.innerHTML = `
      <span>${skill}</span>
      <button class="remove-skill-btn" title="Remove skill" data-idx="${idx}">&times;</button>
    `;
    skillsToShareBox.appendChild(skillDiv);
  });
}

function renderLearnSkills() {
  skillsToLearnBox.innerHTML = '';
  learnSkills.forEach((skill, idx) => {
    const skillDiv = document.createElement('div');
    skillDiv.className = 'skill-box';
    skillDiv.innerHTML = `
      <span>${skill}</span>
      <button class="remove-skill-btn" title="Remove skill" data-idx="${idx}">&times;</button>
    `;
    skillsToLearnBox.appendChild(skillDiv);
  });
}

addSkillBtn.addEventListener('click', () => {
  const skill = newSkillInput.value.trim();
  if (skill && !skills.includes(skill)) {
    skills.push(skill);
    newSkillInput.value = '';
    renderSkills();
  }
});

skillBoxContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-skill-btn')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    skills.splice(idx, 1);
    renderSkills();
  }
});

addSkillToShareBtn.addEventListener('click', () => {
  const skill = newSkillToShareInput.value.trim();
  if (skill && !shareSkills.includes(skill)) {
    shareSkills.push(skill);
    newSkillToShareInput.value = '';
    renderShareSkills();
  }
});

skillsToShareBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-skill-btn')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    shareSkills.splice(idx, 1);
    renderShareSkills();
  }
});

addSkillToLearnBtn.addEventListener('click', () => {
  const skill = newSkillToLearnInput.value.trim();
  if (skill && !learnSkills.includes(skill)) {
    learnSkills.push(skill);
    newSkillToLearnInput.value = '';
    renderLearnSkills();
  }
});

skillsToLearnBox.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-skill-btn')) {
    const idx = parseInt(e.target.getAttribute('data-idx'));
    learnSkills.splice(idx, 1);
    renderLearnSkills();
  }
});

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
  let connections = 0;
  try {
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      if (data.displayName) displayName = data.displayName;
      if (data.bio) bio = data.bio;
      if (data.skillsTeach) teachSkills = data.skillsTeach;
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
  // Update stats
  stats[0].textContent = teachSkills.length;
  stats[1].textContent = learnSkills.length;
  stats[2].textContent = connections || 0;
});

// Optionally, initialize with some skills or load from storage
renderSkills();
renderShareSkills();
renderLearnSkills();

