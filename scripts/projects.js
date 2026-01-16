// const projects = [
//     {
//         title: 'LDS Connect News',
//         subject: 'WDD',
//         description: 'A news and information website for LDS community featuring articles, events, and community updates. Built with responsive design principles and modern web technologies.',
//         technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
//         image: './images/lds_news.png',
//         liveUrl: 'https://imaosazee4github.github.io/LDSConnectNews/index.html',
//         githubUrl: 'https://github.com/imaosazee4github/LDSConnectNews',
//         completed: true
//     },
//     {
//         title: 'WDD131 Course Project',
//         subject: 'WDD',
//         description: 'Dynamic web fundamentals project showcasing JavaScript event handling, DOM manipulation, and responsive web design techniques learned in WDD 131.',
//         technologies: ['HTML', 'CSS', 'JavaScript', 'DOM Manipulation'],
//         image: 'images/port_w.png',
//         liveUrl: 'https://imaosazee4github.github.io/wdd131',
//         githubUrl: 'https://github.com/imaosazee4github/wdd131',
//         completed: true
//     }
// ];

// function createProjectCards() {
//     const grid = document.getElementById('projects-grid');
    
//     // Clear existing content
//     grid.innerHTML = '';
    
//     projects.forEach(project => {
//         const card = document.createElement('div');
//         card.className = 'card-item';
        
//         // Build technologies list
//         const techList = project.technologies.map(tech => 
//             `<span class="tech-tag">${tech}</span>`
//         ).join('');
        
//         card.innerHTML = `
//             <img src="${project.image}" alt="${project.title}" class="project-image">
//             <div class="project-content">
//                 <span class="subject-badge">${project.subject}</span>
//                 <h3>${project.title}</h3>
//                 <p>${project.description}</p>
//                 <div class="technologies">
//                     ${techList}
//                 </div>
//                 <div class="project-links">
//                     <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-live">
//                         View Live
//                     </a>
//                     <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-github">
//                         GitHub
//                     </a>
//                 </div>
//             </div>
//         `;
        
//         grid.appendChild(card);
//     });
// }

// // Call the function when DOM is ready
// document.addEventListener('DOMContentLoaded', createProjectCards);



const projects = [
    {
        title: 'LDS Connect News',
        subject: 'WDD',
        description: 'A news and information website for LDS community featuring articles, events, and community updates. Built with responsive design principles and modern web technologies.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'Responsive Design'],
        image: './images/lds_news.png',
        liveUrl: 'https://imaosazee4github.github.io/LDSConnectNews/index.html',
        githubUrl: 'https://github.com/imaosazee4github/LDSConnectNews',
        completed: true
    },
    {
        title: 'WDD131 Course Project',
        subject: 'WDD',
        description: 'Dynamic web fundamentals project showcasing JavaScript event handling, DOM manipulation, and responsive web design techniques learned in WDD 131.',
        technologies: ['HTML', 'CSS', 'JavaScript', 'DOM Manipulation'],
        image: 'images/port_w.png',
        liveUrl: 'https://imaosazee4github.github.io/wdd131',
        githubUrl: 'https://github.com/imaosazee4github/wdd131',
        completed: true
    }
];

function createProjectCards() {
    const grid = document.getElementById('projects-grid');
    
    // Clear existing content
    grid.innerHTML = '';
    
    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'card-item';
        
        // Build technologies list
        const techList = project.technologies.map(tech => 
            `<span class="tech-tag">${tech}</span>`
        ).join('');
        
        card.innerHTML = `
            <img src="${project.image}" alt="${project.title}" class="project-image">
            <div class="project-content">
                <span class="subject-badge">${project.subject}</span>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="technologies">
                    ${techList}
                </div>
                <div class="project-links">
                    <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn-live">
                        View Live
                    </a>
                    <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-github">
                        GitHub
                    </a>
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
}

// Call the function when DOM is ready
document.addEventListener('DOMContentLoaded', createProjectCards);