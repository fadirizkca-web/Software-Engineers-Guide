/**
 * DEVROADMAP CENTRAL ENGINE (app.js) - 2026 Edition
 * Full Integration: Multi-User Auth + Dynamic Roadmap Injection
 */

// --- 1. INITIAL DATABASE SEED ---
const initialRoadmapData = {
    "universal": {
        "junior": ["Variables, Loops, Functions", "Data Structures & Algorithms", "Git + GitHub", "CLI Usage", "HTTP Basics (Requests/Headers)"],
        "mid": ["Design Patterns (MVC, Factory)", "System Design Basics", "Unit & Integration Testing", "CI/CD + DevOps Basics"]
    },
    "python": {
        "frontend": {
            "junior": { "topics": ["HTML Basics", "CSS Fundamentals", "JS Basics"], "tools": ["VS Code", "Browser DevTools"] },
            "mid": { "topics": ["Django Templates", "HTMX Integration", "Interactive UI with Python"], "tools": ["HTMX", "Jinja2"] },
            "senior": { "topics": ["SSR Optimization", "Hybrid Rendering", "WASM/PyScript Research"], "tools": ["Django", "HTMX"] }
        },
        "backend": {
            "junior": { "topics": ["Python Syntax & OOP", "REST APIs (Flask/FastAPI)", "SQL Basics"], "tools": ["Python 3.x", "PostgreSQL", "Pip"] },
            "mid": { "topics": ["AsyncIO (FastAPI)", "JWT/OAuth Auth", "Caching (Redis)", "Testing (Pytest)"], "tools": ["FastAPI", "Redis", "Docker"] },
            "senior": { "topics": ["Microservices Design", "Message Queues (Kafka/RabbitMQ)", "Observability (Prometheus)", "Performance Tuning"], "tools": ["Kafka", "Grafana", "Kubernetes"] }
        },
        "fullstack": {
            "junior": { "topics": ["React Basics", "FastAPI Basics", "Tailwind CSS"], "tools": ["Vite", "PostgreSQL"] },
            "mid": { "topics": ["TypeScript Integration", "SQLAlchemy ORM", "Component Architecture"], "tools": ["React", "FastAPI"] },
            "senior": { "topics": ["GraphQL Integration", "Distributed AI Systems", "Cloud Deployment"], "tools": ["AWS", "Docker"] }
        }
    },
    "javascript": {
        "frontend": {
            "junior": { "topics": ["JS Fundamentals", "DOM Manipulation", "ES6+ Syntax"], "tools": ["Node.js", "Chrome DevTools"] },
            "mid": { "topics": ["React Hooks & Routing", "State Management (Zustand)", "TypeScript"], "tools": ["React", "Vite", "Tailwind CSS"] },
            "senior": { "topics": ["Micro-frontends", "Next.js SSR", "Performance Optimization", "Accessibility Systems"], "tools": ["Next.js", "Webpack", "Sentry"] }
        },
        "backend": {
            "junior": { "topics": ["Node.js + Express", "REST APIs", "MongoDB Basics"], "tools": ["Node.js", "Express", "Postman"] },
            "mid": { "topics": ["JWT Security", "GraphQL", "WebSockets"], "tools": ["Apollo Server", "Socket.io", "Docker"] },
            "senior": { "topics": ["Distributed Systems", "Event-Driven Arch", "Scaling Node Instances"], "tools": ["Kubernetes", "Redis", "Prometheus"] }
        },
        "fullstack": {
            "junior": { "topics": ["MERN Stack Basics", "JS -> TS Transition", "Git Flow"], "tools": ["MongoDB", "Express", "React", "Node"] },
            "mid": { "topics": ["Next.js Full Stack", "Database Normalization", "Auth.js (NextAuth)"], "tools": ["Next.js", "Prisma"] },
            "senior": { "topics": ["High-Scale Architecture", "Edge Functions", "Multi-region Deployment"], "tools": ["Vercel", "GCP/Azure"] }
        }
    },
    "java": {
        "backend": {
            "junior": { "topics": ["Java Fundamentals", "Deep OOP Concepts", "Spring Boot Basics"], "tools": ["JDK", "Maven/Gradle", "IntelliJ"] },
            "mid": { "topics": ["Spring Boot REST APIs", "Hibernate / JPA", "Spring Security"], "tools": ["PostgreSQL", "Docker", "JUnit"] },
            "senior": { "topics": ["Spring Cloud (Microservices)", "High-Performance Distributed Systems", "JVM Tuning"], "tools": ["Spring Cloud", "Prometheus", "Jira"] }
        }
    },
    "go": {
        "backend": {
            "junior": { "topics": ["Go Syntax", "Goroutines", "Basic HTTP Servers"], "tools": ["Go CLI", "VS Code", "Git"] },
            "mid": { "topics": ["REST APIs", "gRPC Fundamentals", "Database Handling"], "tools": ["PostgreSQL", "Docker", "Go by Example"] },
            "senior": { "topics": ["Distributed Cloud-Native Apps", "Kubernetes Ecosystem", "Advanced Concurrency"], "tools": ["K8s", "Docker", "Terraform"] }
        }
    },
    "csharp": {
        "backend": {
            "junior": { "topics": ["C# Basics", ".NET Core", "ASP.NET MVC"], "tools": ["Visual Studio", ".NET SDK", "SQL Server"] },
            "mid": { "topics": ["Web APIs", "Entity Framework", "Identity Auth"], "tools": ["Azure", "Docker", "ReSharper"] },
            "senior": { "topics": ["Distributed Microservices", "Azure Cloud Native", "Performance Tuning"], "tools": ["Azure DevOps", "Redis", "RabbitMQ"] }
        }
    },
    "cpp": {
        "backend": {
            "junior": { "topics": ["C++ Fundamentals", "Memory Management", "STL"], "tools": ["GCC / Clang", "CMake", "GDB"] },
            "mid": { "topics": ["Networking", "Multithreading", "System-level Coding"], "tools": ["Valgrind", "Ninja"] },
            "senior": { "topics": ["High-Performance Systems", "Game Engines", "Trading Systems"], "tools": ["Jenkins", "Perf"] }
        }
    }
};

// --- 2. STORAGE & AUTH ---
const defaultUsers = [
    { email: 'admin@dev.ca', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User' },
    { email: 'fadi@dev.ca', password: 'fadi123', role: 'user', firstName: 'Fadi', lastName: 'Dev' },
    { email: 'becca@dev.ca', password: 'becca123', role: 'user', firstName: 'Becca', lastName: 'Dev' },
    { email: 'joya@dev.ca', password: 'joya123', role: 'user', firstName: 'Joya', lastName: 'Dev' }
];

// Re-initialize users if the list has changed or is empty
const storedUsers = JSON.parse(localStorage.getItem('users'));
if (!storedUsers || storedUsers.length < 4) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
}

// Load Roadmaps (Check LocalStorage first for Admin updates)
window.roadmapDatabase = JSON.parse(localStorage.getItem('master_roadmaps')) || initialRoadmapData;

// --- 3. DYNAMIC ROADMAP INJECTION (Admin Only) ---
window.addNewLanguage = (langName, trackName, level, topics, tools) => {
    const key = langName.toLowerCase().trim();
    const trackKey = trackName.toLowerCase().trim();
    const levelKey = level.toLowerCase().trim();

    // Build the structure
    if (!window.roadmapDatabase[key]) window.roadmapDatabase[key] = {};
    if (!window.roadmapDatabase[key][trackKey]) window.roadmapDatabase[key][trackKey] = {};
    
    window.roadmapDatabase[key][trackKey][levelKey] = {
        topics: typeof topics === 'string' ? topics.split(',').map(s => s.trim()) : topics,
        tools: typeof tools === 'string' ? tools.split(',').map(s => s.trim()) : tools
    };

    // Save globally and locally
    localStorage.setItem('master_roadmaps', JSON.stringify(window.roadmapDatabase));
};

// --- 4. PROGRESS ENGINE ---
function getPathKey() {
    const selection = JSON.parse(localStorage.getItem('selectedPath'));
    if (!selection) return null;
    return `progress_${selection.lang.toLowerCase().replace(/\s/g, '')}_${selection.level.toLowerCase()}_${selection.track.toLowerCase()}`;
}

window.saveProgress = (type, index, isChecked) => {
    const key = getPathKey();
    if (!key) return;
    
    let allProgress = JSON.parse(localStorage.getItem(key)) || { universal: [], topics: [], tools: [] };
    
    if (isChecked) {
        if (!allProgress[type].includes(index)) allProgress[type].push(index);
    } else {
        allProgress[type] = allProgress[type].filter(i => i !== index);
    }
    localStorage.setItem(key, JSON.stringify(allProgress));
};

window.loadProgress = () => {
    const key = getPathKey();
    return JSON.parse(localStorage.getItem(key)) || { universal: [], topics: [], tools: [] };
};

// --- 5. GLOBAL LISTENERS & NAVIGATION ---

// SIGN IN LOGIC
document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = user.role === 'admin' ? 'AdminDashboard.html' : 'DashboardPage.html';
    } else {
        const errorDiv = document.getElementById('login-error');
        if (errorDiv) errorDiv.classList.remove('hidden');
        else alert("Invalid credentials provided.");
    }
});

// ROADMAP SELECTION LOGIC
document.getElementById('roadmap-selection-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const selection = {
        lang: document.getElementById('language').value,
        track: document.getElementById('track').value,
        level: document.getElementById('level').value
    };
    localStorage.setItem('selectedPath', JSON.stringify(selection));
    window.location.href = 'RoadmapPage.html';
});

// LOGOUT LOGIC
function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('selectedPath');
    window.location.href = 'SignInPage.html';
}