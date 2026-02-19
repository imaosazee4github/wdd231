// scripts/form.js

// DOM Elements
const form = document.getElementById('recipeForm');
const descriptionTextarea = document.getElementById('description');
const charCountSpan = document.getElementById('charCount');
const ratingInput = document.getElementById('rating');
const ratingValue = document.getElementById('ratingValue');
const starDisplay = document.getElementById('starDisplay');
const backToTopBtn = document.getElementById('backToTop');
const timestampInput = document.getElementById('timestamp');

// Initialize the page
function initializeFormPage() {
    console.log('Form page initializing...');
    
    setCurrentYear();
    initializeHamburgerMenu();
    setupBackToTop();
    setupCharacterCounter();
    setupRatingInput();
    setupFormValidation();
    setTimestamp();
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

// Setup character counter for description
function setupCharacterCounter() {
    if (!descriptionTextarea || !charCountSpan) return;
    
    // Update character count on input
    descriptionTextarea.addEventListener('input', () => {
        const count = descriptionTextarea.value.length;
        charCountSpan.textContent = count;
        
        // Visual feedback when approaching limit
        if (count > 450) {
            charCountSpan.style.color = '#E74C3C';
        } else if (count > 400) {
            charCountSpan.style.color = '#F39C12';
        } else {
            charCountSpan.style.color = '#6B8E7F';
        }
    });
}

// Setup rating input with star display
function setupRatingInput() {
    if (!ratingInput || !ratingValue || !starDisplay) return;
    
    const stars = ['★', '★★', '★★★', '★★★★', '★★★★★'];
    
    ratingInput.addEventListener('input', () => {
        const value = ratingInput.value;
        ratingValue.textContent = value;
        starDisplay.textContent = stars[value - 1];
    });
}

// Set hidden timestamp field
function setTimestamp() {
    if (timestampInput) {
        const now = new Date();
        timestampInput.value = now.toISOString();
    }
}

// Setup form validation
function setupFormValidation() {
    if (!form) return;
    
    // Remove novalidate attribute to use browser validation but enhance it
    form.removeAttribute('novalidate');
    
    form.addEventListener('submit', handleFormSubmit);
    form.addEventListener('reset', handleFormReset);
    
    // Add real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove existing error states
    field.classList.remove('error', 'success');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Required field validation
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }
    
    // Pattern validation
    if (isValid && field.hasAttribute('pattern')) {
        const pattern = new RegExp(field.getAttribute('pattern'));
        if (!pattern.test(value)) {
            isValid = false;
            errorMessage = field.getAttribute('data-error') || 'Invalid format';
        }
    }
    
    // Minlength validation
    if (isValid && field.hasAttribute('minlength') && value.length < parseInt(field.getAttribute('minlength'))) {
        isValid = false;
        errorMessage = `Minimum ${field.getAttribute('minlength')} characters required`;
    }
    
    // Maxlength validation
    if (isValid && field.hasAttribute('maxlength') && value.length > parseInt(field.getAttribute('maxlength'))) {
        isValid = false;
        errorMessage = `Maximum ${field.getAttribute('maxlength')} characters exceeded`;
    }
    
    // Email validation
    if (isValid && field.type === 'email' && value !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Number validation
    if (isValid && field.type === 'number') {
        const num = parseFloat(value);
        if (isNaN(num)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else {
            if (field.hasAttribute('min') && num < parseFloat(field.getAttribute('min'))) {
                isValid = false;
                errorMessage = `Minimum value is ${field.getAttribute('min')}`;
            }
            if (field.hasAttribute('max') && num > parseFloat(field.getAttribute('max'))) {
                isValid = false;
                errorMessage = `Maximum value is ${field.getAttribute('max')}`;
            }
        }
    }
    
    // Checkbox validation (for agreement)
    if (field.type === 'checkbox' && field.hasAttribute('required') && !field.checked) {
        isValid = false;
        errorMessage = 'You must agree to the terms';
    }
    
    // Update UI
    if (!isValid && errorMessage) {
        field.classList.add('error');
        const errorDiv = document.createElement('small');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errorMessage;
        field.parentNode.appendChild(errorDiv);
    } else if (value !== '') {
        field.classList.add('success');
    }
    
    return isValid;
}

// Handle form submit
function handleFormSubmit(e) {
    e.preventDefault();
    
    console.log('Form submission started');
    
    // Validate all fields
    const fields = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    // Validate checkboxes group
    const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]');
    // Dietary is optional, so no validation needed
    
    if (!isFormValid) {
        console.log('Form validation failed');
        
        // Scroll to first error
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        
        // Show error summary
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Collect form data
    const formData = collectFormData();
    console.log('Form data collected:', formData);
    
    // Save to sessionStorage for confirmation page
    saveToSessionStorage('recipeSubmission', formData);
    
    // Show loading state
    const submitBtn = form.querySelector('.submit-button');
    const originalText = submitBtn.innerHTML;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="white" stroke-width="2" fill="none"/></svg> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate submission (remove in production)
    setTimeout(() => {
        // Submit the form
        form.submit();
    }, 500);
}

// Collect all form data into an object
function collectFormData() {
    const formData = {
        personal: {},
        recipe: {},
        dietary: [],
        additional: {},
        rating: null,
        timestamp: timestampInput ? timestampInput.value : new Date().toISOString()
    };
    
    // Personal Information
    formData.personal.name = document.getElementById('submitterName')?.value || '';
    formData.personal.email = document.getElementById('email')?.value || '';
    formData.personal.phone = document.getElementById('phone')?.value || '';
    formData.personal.location = document.getElementById('location')?.value || '';
    
    // Recipe Details
    formData.recipe.name = document.getElementById('recipeName')?.value || '';
    formData.recipe.description = document.getElementById('description')?.value || '';
    formData.recipe.cuisine = document.getElementById('cuisine')?.value || '';
    formData.recipe.category = document.getElementById('category')?.value || '';
    formData.recipe.cookingTime = document.getElementById('cookingTime')?.value || '';
    formData.recipe.prepTime = document.getElementById('prepTime')?.value || '';
    formData.recipe.servings = document.getElementById('servings')?.value || '';
    formData.recipe.difficulty = document.getElementById('difficulty')?.value || '';
    
    // Ingredients and Instructions
    formData.recipe.ingredients = document.getElementById('ingredients')?.value || '';
    formData.recipe.instructions = document.getElementById('instructions')?.value || '';
    
    // Additional Details
    formData.additional.tips = document.getElementById('tips')?.value || '';
    formData.additional.equipment = document.getElementById('equipment')?.value || '';
    formData.additional.source = document.getElementById('source')?.value || '';
    
    // Dietary Information (checkboxes)
    const dietaryCheckboxes = document.querySelectorAll('input[name="dietary"]:checked');
    dietaryCheckboxes.forEach(cb => {
        formData.dietary.push(cb.value);
    });
    
    // Rating
    formData.rating = document.getElementById('rating')?.value || '5';
    
    // Newsletter
    formData.newsletter = document.querySelector('input[name="newsletter"]')?.checked || false;
    
    return formData;
}

// Save data to sessionStorage
function saveToSessionStorage(key, data) {
    try {
        sessionStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
    }
}

// Handle form reset
function handleFormReset(e) {
    // Reset character counter
    if (charCountSpan) {
        charCountSpan.textContent = '0';
        charCountSpan.style.color = '#6B8E7F';
    }
    
    // Reset rating
    if (ratingInput && ratingValue && starDisplay) {
        ratingInput.value = '5';
        ratingValue.textContent = '5';
        starDisplay.textContent = '★★★★★';
    }
    
    // Remove all validation states
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
        field.classList.remove('error', 'success');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    });
    
    // Reset timestamp
    setTimestamp();
}

// Show notification (can be expanded to a toast component)
function showNotification(message, type = 'info') {
    // Simple alert for now - can be enhanced with a proper notification system
    alert(message);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFormPage);