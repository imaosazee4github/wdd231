const membersContainer = document.getElementById('members-container');
const gridViewBtn = document.getElementById('grid-view');
const listViewBtn = document.getElementById('list-view');
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

let membersDate = [];
let currentView = 'grid';

const getMembers = async() => {
    try {
        const response = await fetch('data/members.json');
        const data = await response.json();
        membersDate = data.members;
        displayMembers(membersData, currentView);;
    }catch (error) {
        console.error('Error fetching members: ', error);
        membersContainer.innerHTML = '<p>Unable to load member directory. Please try agin later.</p>';
    }
}

const displayMembers = (members, view) => {
    membersContainer.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.classList.add('member-card');

        const membershipBadge = getMembershipBadge(member.membershipLevel);

        if (view === 'grid') {
        card.innerHTML = `
        <img src="${member.image}" alt="${member.name}" class="member-image" loading="lazy">
        <div class=member-info> 
           <h3>${member.name}</h3>
           ${membershipBadge}
           <p><strong>Address:</strong>${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
            <p>${member.description}</p>
            <p><em>Founded: ${member.yearFounded}</em></p>
            </div>
        `;
        }
        else {
            card.innerHTML = `
            <div class="member-info">
            <h3>${member.name}</h3>
            ${membershipBadge}
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Website:</strong> <a href="${member.website}" target="_blank" rel="noopener">${member.website}</a></p>
            </div>
            `;
        }
        membersContainer.appendChild(card);
    });
}

function getMembershipBadge(level) {
    switch(level) {
        case 3:
            return '<span class="membership-badge badge-gold">Gold Member</span>';
        case 2:
            return '<span class="membership-badge badge-silver">Silver Member</span>';
        case 1:
            return '<span class="membership-badge badge-member">Member</span>';
        default:
            return '';
    }
}

function toggleView(view) {
    currentView = view;

    if (view === 'grid') {
        membersContainer.classList.remove('members-list');
        membersContainer.classList.add('members-grid');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
    } else {
        membersContainer.classList.remove('members-grid');
        membersContainer.classList.add('members-list');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }

    displayMembers(membersDate, currentView);
}


// Event Listeners
gridViewBtn.addEventListener('click', () => toggleView('grid'));
listViewBtn.addEventListener('click', () => toggleView('list'));

hamburger.addEventListener('click', () => {
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    const expanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !expanded);
    
    // Change hamburger icon
    if (nav.classList.contains('active')) {
        hamburger.textContent = '✕';
    } else {
        hamburger.textContent = '☰';
    }
})

document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
    });
})

document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.textContent = '☰';
    }
});

// Display current year in footer
document.getElementById('currentYear').textContent = new Date().getFullYear();


document.getElementById('lastModified').textContent = `Last Modified: ${document.lastModified}`;

// Initialize - Load members when page loads
getMembers();