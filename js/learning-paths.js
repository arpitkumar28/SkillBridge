// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB8QJwXQJwXQJwXQJwXQJwXQJwXQJwXQJw",
    authDomain: "skillbridge-12345.firebaseapp.com",
    projectId: "skillbridge-12345",
    storageBucket: "skillbridge-12345.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const userGreeting = document.getElementById('userGreeting');
const learningPathsContainer = document.getElementById('learningPathsContainer');

// Learning paths data
const learningPaths = [
    {
        id: 'fullstack',
        title: 'Full Stack Development',
        url: 'fullstack-path.html'
    },
    {
        id: 'frontend',
        title: 'Frontend Development',
        url: 'frontend-path.html'
    },
    {
        id: 'backend',
        title: 'Backend Development',
        url: 'backend-path.html'
    },
    {
        id: 'data-science',
        title: 'Data Science',
        url: 'data-science-path.html'
    },
    {
        id: 'ai-ml',
        title: 'Artificial Intelligence',
        url: 'ai-ml-path.html'
    },
    {
        id: 'blockchain',
        title: 'Blockchain Development',
        url: 'blockchain-path.html'
    },
    {
        id: 'game-dev',
        title: 'Game Development',
        url: 'game-dev-path.html'
    },
    {
        id: 'ui-ux',
        title: 'UI/UX Design',
        url: 'ui-ux-path.html'
    },
    {
        id: 'product-management',
        title: 'Product Management',
        url: 'product-management-path.html'
    },
    {
        id: 'digital-marketing',
        title: 'Digital Marketing',
        url: 'digital-marketing-path.html'
    },
    {
        id: 'project-management',
        title: 'Project Management',
        url: 'project-management-path.html'
    },
    {
        id: 'technical-writing',
        title: 'Technical Writing',
        url: 'technical-writing-path.html'
    },
    {
        id: 'dev-ops',
        title: 'DevOps Engineering',
        url: 'devops-path.html'
    },
    {
        id: 'cloud-architect',
        title: 'Cloud Architecture',
        url: 'cloud-architect-path.html'
    },
    {
        id: 'machine-learning',
        title: 'Machine Learning Engineering',
        url: 'ml-engineering-path.html'
    },
    {
        id: 'data-engineering',
        title: 'Data Engineering',
        url: 'data-engineering-path.html'
    }
];

// Handle authentication state
onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = '../login.html';
    } else {
        // Update greeting with user's name if available
        if (user.displayName) {
            userGreeting.textContent = `Welcome back, ${user.displayName}!`;
        }
        await loadUserProgress(user.uid);
    }
});

// Load user progress
async function loadUserProgress(userId) {
    try {
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
            const userData = userDoc.data();
            const activePath = userData.activePath;
            
            // Update UI with active path
            if (activePath) {
                const pathLink = document.querySelector(`[data-path-id="${activePath}"]`);
                if (pathLink) {
                    pathLink.classList.add('active');
                }
            }
        }
    } catch (error) {
        console.error('Error loading user progress:', error);
    }
}

// Display learning paths
function displayLearningPaths() {
    learningPathsContainer.innerHTML = '';
    learningPaths.forEach(path => {
        const pathLink = document.createElement('a');
        pathLink.href = path.url;
        pathLink.className = 'path-link';
        pathLink.setAttribute('data-path-id', path.id);
        pathLink.innerHTML = `
            <div class="path-item">
                <i class="fas fa-arrow-right"></i>
                <span>${path.title}</span>
            </div>
        `;
        learningPathsContainer.appendChild(pathLink);
    });
}

// Handle logout
function handleLogout() {
    signOut(auth).then(() => {
        window.location.href = '../login.html';
    }).catch((error) => {
        console.error('Error signing out:', error);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayLearningPaths();
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
}); 