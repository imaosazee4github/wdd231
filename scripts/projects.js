const projects = [
    {
        title: 'Chamber of Commerce Website',
        subject: 'WDD',
        description: 'A responsive business directory website featuring member listings, event calendar, and weather integration. Built with vanilla JavaScript and modern CSS Grid layout.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'API Integration'],
        image: 'images/projects/chamber-project.jpg',
        liveUrl: 'chamber.html',
        githubUrl: 'https://github.com/imaosazee4github/chamber-project',
        completed: true
    },
    {
        title: 'Recipe Book Application',
        subject: 'WDD',
        description: 'An interactive recipe management app with search functionality, ingredient lists, and step-by-step cooking instructions. Features local storage for saving favorites.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Local Storage'],
        image: 'images/projects/recipe-app.jpg',
        liveUrl: '#',
        githubUrl: 'https://github.com/imaosazee4github/recipe-app',
        completed: true
    },
    {
        title: 'Weather Dashboard',
        subject: 'WDD',
        description: 'Real-time weather application using OpenWeather API. Displays current conditions, 5-day forecast, and location-based weather alerts with responsive design.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Weather API'],
        image: 'images/projects/weather-dashboard.jpg',
        liveUrl: '#',
        githubUrl: 'https://github.com/imaosazee4github/weather-dashboard',
        completed: false
    },
    {
        title: 'Portfolio Website',
        subject: 'WDD',
        description: 'Personal portfolio showcasing web development projects and skills. Features responsive design, smooth animations, and dynamic content loading.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        image: 'images/projects/portfolio.jpg',
        liveUrl: 'index.html',
        githubUrl: 'https://github.com/imaosazee4github/portfolio',
        completed: false
    },
    {
        title: 'Form Validation Demo',
        subject: 'WDD',
        description: 'Interactive form with real-time validation, custom error messages, and user-friendly feedback. Demonstrates accessibility best practices and progressive enhancement.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Accessibility'],
        image: 'images/projects/form-validation.jpg',
        liveUrl: '#',
        githubUrl: 'https://github.com/imaosazee4github/form-validation',
        completed: true
    },
    {
        title: 'Responsive Image Gallery',
        subject: 'WDD',
        description: 'A dynamic photo gallery with filtering, lightbox modal, and lazy loading. Optimized for performance with responsive images and modern CSS techniques.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Lazy Loading'],
        image: 'images/projects/image-gallery.jpg',
        liveUrl: '#',
        githubUrl: 'https://github.com/imaosazee4github/image-gallery',
        completed: true
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const projectsContainer = document.getElementById('projects-grid');
    const allProjectsBtn = document.getElementById('all-projects-btn');

    // Check if elements exist before proceeding
    if (!projectsContainer) return;

    // Function to create project card using DOM manipulation
    function createProjectCard(project) {
        // Create main card container
        const card = document.createElement('div');
        card.className = 'project-card';

        // Create image element
        const img = document.createElement('img');
        img.src = project.image;
        img.alt = `${project.title} screenshot`;
        img.className = 'project-image';
        // Fallback for missing images
        img.onerror = function() {
            this.src = 'images/projects/placeholder.jpg';
        };

        // Create content container
        const content = document.createElement('div');
        content.className = 'project-content';

        // Create header with title and badge
        const header = document.createElement('div');
        header.className = 'project-header';

        const title = document.createElement('h3');
        title.textContent = project.title;

        const badge = document.createElement('span');
        badge.className = 'project-badge';
        badge.textContent = project.subject;

        header.appendChild(title);
        header.appendChild(badge);

        // Create description
        const description = document.createElement('p');
        description.className = 'project-description';
        description.textContent = project.description;

        // Create technologies container
        const techContainer = document.createElement('div');
        techContainer.className = 'project-tech';

        project.technologies.forEach(tech => {
            const techTag = document.createElement('span');
            techTag.className = 'tech-tag';
            techTag.textContent = tech;
            techContainer.appendChild(techTag);
        });

        // Create links container
        const linksContainer = document.createElement('div');
        linksContainer.className = 'project-links';

        // Live Demo link
        const liveLink = document.createElement('a');
        liveLink.href = project.liveUrl;
        liveLink.className = 'project-link';
        liveLink.textContent = '👁️ View Demo';
        liveLink.target = project.liveUrl.startsWith('http') ? '_blank' : '_self';

        // GitHub link
        const githubLink = document.createElement('a');
        githubLink.href = project.githubUrl;
        githubLink.className = 'project-link secondary';
        githubLink.textContent = '💻 GitHub';
        githubLink.target = '_blank';
        githubLink.rel = 'noopener';

        linksContainer.appendChild(liveLink);
        linksContainer.appendChild(githubLink);

        // Assemble the card
        content.appendChild(header);
        content.appendChild(description);
        content.appendChild(techContainer);
        content.appendChild(linksContainer);

        card.appendChild(img);
        card.appendChild(content);

        return card;
    }

    // Function to display projects
    function displayProjects(filteredProjects) {
        // Clear existing content
        projectsContainer.innerHTML = '';

        if (filteredProjects.length === 0) {
            const noProjects = document.createElement('p');
            noProjects.textContent = 'No projects found in this category.';
            noProjects.style.gridColumn = '1 / -1';
            noProjects.style.textAlign = 'center';
            noProjects.style.padding = '2rem';
            projectsContainer.appendChild(noProjects);
            return;
        }

        // Create and append project cards
        filteredProjects.forEach(project => {
            const card = createProjectCard(project);
            projectsContainer.appendChild(card);
        });
    }

    // Function to set active button
    function setActiveButton(activeBtn, buttons) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    }

    // Get all filter buttons
    const filterButtons = [allProjectsBtn, wddProjectsBtn, cseProjectsBtn];

    // Event listeners for filter buttons
    if (allProjectsBtn) {
        allProjectsBtn.addEventListener('click', () => {
            displayProjects(projects);
            setActiveButton(allProjectsBtn, filterButtons);
        });
    }

    if (wddProjectsBtn) {
        wddProjectsBtn.addEventListener('click', () => {
            const wddProjects = projects.filter(project => project.subject === 'WDD');
            displayProjects(wddProjects);
            setActiveButton(wddProjectsBtn, filterButtons);
        });
    }

    if (cseProjectsBtn) {
        cseProjectsBtn.addEventListener('click', () => {
            const cseProjects = projects.filter(project => project.subject === 'CSE');
            displayProjects(cseProjects);
            setActiveButton(cseProjectsBtn, filterButtons);
        });
    }

    // Display all projects by default
    displayProjects(projects);
});