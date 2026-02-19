// scripts/confirmation.js

// DOM Elements
const randomIdSpan = document.getElementById('randomId');
const submissionDataDiv = document.getElementById('submissionData');
const copyButton = document.getElementById('copyButton');
const backToTopBtn = document.getElementById('backToTop');
const shareButtons = document.querySelectorAll('.share-btn');

// Initialize the page
function initializeConfirmationPage() {
    console.log('Confirmation page initializing...');
    
    setCurrentYear();
    initializeHamburgerMenu();
    setupBackToTop();
    generateSubmissionId();
    loadSubmissionData();
    setupCopyButton();
    setupShareButtons();
}

// Set current year in footer
function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialize hamburger menu
function initializeHamburgerMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', () => {
        nav.classList.toggle('active');
        const isExpanded = nav.classList.contains('active');
        hamburger.setAttribute('aria-expanded', isExpanded);
    });
}

// Setup back to top button
function setupBackToTop() {
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Generate random submission ID
function generateSubmissionId() {
    if (!randomIdSpan) return;
    
    // Generate random 6-digit number with letters and numbers
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    randomIdSpan.textContent = result;
}

// Load submission data from sessionStorage
function loadSubmissionData() {
    if (!submissionDataDiv) return;
    
    // Try to get data from sessionStorage (from form submission)
    let submissionData = null;
    
    try {
        const storedData = sessionStorage.getItem('recipeSubmission');
        if (storedData) {
            submissionData = JSON.parse(storedData);
            console.log('Loaded from sessionStorage:', submissionData);
        }
    } catch (error) {
        console.error('Error loading from sessionStorage:', error);
    }
    
    // Display the data or show fallback
    if (submissionData) {
        displaySubmissionData(submissionData);
        // Clear sessionStorage after displaying
        try {
            sessionStorage.removeItem('recipeSubmission');
        } catch (error) {
            console.error('Error clearing sessionStorage:', error);
        }
    } else {
        displayFallbackData();
    }
}

// Display submission data in the confirmation card
function displaySubmissionData(data) {
    // Format timestamp
    const submissionDate = data.timestamp ? new Date(data.timestamp) : new Date();
    const formattedDate = submissionDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    // Format dietary preferences
    const dietaryList = data.dietary && data.dietary.length > 0 
        ? data.dietary.map(diet => `<span class="dietary-chip">${diet}</span>`).join('')
        : '<span class="dietary-chip">None selected</span>';
    
    // Build HTML
    const html = `
        <div class="detail-section">
            <h4>📋 Submission Details</h4>
            <div class="detail-row">
                <span class="detail-label">Submitted On:</span>
                <span class="detail-value">${formattedDate}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>👤 Your Information</h4>
            <div class="detail-row">
                <span class="detail-label">Full Name:</span>
                <span class="detail-value">${escapeHtml(data.personal?.name || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${escapeHtml(data.personal?.email || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">${escapeHtml(data.personal?.phone || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${escapeHtml(data.personal?.location || 'Not provided')}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🍳 Recipe Details</h4>
            <div class="detail-row">
                <span class="detail-label">Recipe Name:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.name || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Description:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.description || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Cuisine:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.cuisine || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Category:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.category || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Cooking Time:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.cookingTime || 'Not provided')} minutes</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Prep Time:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.prepTime || 'Not provided')} minutes</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Servings:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.servings || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Difficulty:</span>
                <span class="detail-value">${escapeHtml(data.recipe?.difficulty || 'Not provided')}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>🥗 Dietary Information</h4>
            <div class="detail-row">
                <span class="detail-label">Preferences:</span>
                <div class="dietary-chips">${dietaryList}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>📝 Ingredients</h4>
            <div class="detail-row">
                <div class="detail-value multiline">${escapeHtml(data.recipe?.ingredients || 'Not provided').replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>👩‍🍳 Instructions</h4>
            <div class="detail-row">
                <div class="detail-value multiline">${escapeHtml(data.recipe?.instructions || 'Not provided').replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>✨ Additional Information</h4>
            <div class="detail-row">
                <span class="detail-label">Tips & Variations:</span>
                <span class="detail-value">${escapeHtml(data.additional?.tips || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Required Equipment:</span>
                <span class="detail-value">${escapeHtml(data.additional?.equipment || 'Not provided')}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Recipe Source:</span>
                <span class="detail-value">${escapeHtml(data.additional?.source || 'Not provided')}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>⭐ Your Rating</h4>
            <div class="detail-row">
                <span class="detail-label">Rating:</span>
                <span class="detail-value">${'★'.repeat(parseInt(data.rating || 5))}${'☆'.repeat(5 - parseInt(data.rating || 5))} (${data.rating || 5}/5)</span>
            </div>
        </div>
    `;
    
    submissionDataDiv.innerHTML = html;
}

// Display fallback data when no submission exists
function displayFallbackData() {
    const html = `
        <div class="empty-state" style="padding: 2rem; text-align: center;">
            <svg width="60" height="60" viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="40" stroke="#E8E8E8" stroke-width="4"/>
                <path d="M30 50 L45 65 L70 35" stroke="#C67B5C" stroke-width="4" fill="none"/>
            </svg>
            <h3 style="color: #6B8E7F; margin: 1rem 0 0.5rem;">No Submission Data</h3>
            <p style="color: #636E72;">This confirmation page is shown after submitting a recipe.</p>
            <a href="submit.html" class="cta-button" style="display: inline-block; margin-top: 1.5rem; padding: 0.75rem 2rem;">
                Submit a Recipe
            </a>
        </div>
    `;
    
    submissionDataDiv.innerHTML = html;
}

// Escape HTML to prevent XSS
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Setup copy button functionality
function setupCopyButton() {
    if (!copyButton) return;
    
    copyButton.addEventListener('click', async () => {
        // Get all text content from submission details
        const submissionText = getSubmissionText();
        
        try {
            await navigator.clipboard.writeText(submissionText);
            
            // Visual feedback
            const originalText = copyButton.innerHTML;
            copyButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.5 4.5L6.5 11.5L3 8" stroke="white" stroke-width="2" fill="none"/></svg> Copied!';
            
            setTimeout(() => {
                copyButton.innerHTML = originalText;
            }, 2000);
            
        } catch (err) {
            console.error('Failed to copy:', err);
            alert('Failed to copy to clipboard');
        }
    });
}

// Get submission text for copying
function getSubmissionText() {
    const submissionId = document.querySelector('.submission-id .value')?.textContent || 'Unknown';
    const details = [];
    
    // Collect all detail rows
    const detailRows = document.querySelectorAll('.detail-row');
    detailRows.forEach(row => {
        const label = row.querySelector('.detail-label')?.textContent || '';
        const value = row.querySelector('.detail-value')?.textContent || '';
        if (label && value) {
            details.push(`${label} ${value}`);
        }
    });
    
    return `Global Recipe Hub - Recipe Submission
Submission ID: ${submissionId}
Date: ${new Date().toLocaleString()}

${details.join('\n')}

Thank you for submitting to Global Recipe Hub!`;
}

// Setup share buttons
function setupShareButtons() {
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            const platform = button.classList.contains('facebook') ? 'facebook' :
                            button.classList.contains('twitter') ? 'twitter' :
                            button.classList.contains('pinterest') ? 'pinterest' : 'email';
            
            shareOnPlatform(platform);
        });
    });
}

// Share on social media platforms
function shareOnPlatform(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent('I just shared a recipe on Global Recipe Hub!');
    const description = encodeURIComponent('Check out Global Recipe Hub for amazing recipes from around the world.');
    
    let shareUrl = '';
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
            break;
        case 'pinterest':
            shareUrl = `https://pinterest.com/pin/create/button/?url=${url}&description=${description}`;
            break;
        case 'email':
            shareUrl = `mailto:?subject=${title}&body=${description}%0A%0A${url}`;
            break;
    }
    
    if (shareUrl) {
        if (platform === 'email') {
            window.location.href = shareUrl;
        } else {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeConfirmationPage);