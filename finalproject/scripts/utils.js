export function initializeModal() {

    console.log('1. openModal called with recipe:', recipeModal.name);

    const modal = document.getElementById('recipeModal');
    const closeButton = document.querySelector('.modal-close');
    
   
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}


export function openModal(recipe) {
    const modal = document.getElementById('recipeModal');
    const modalBody = document.getElementById('modalBody');
    
   
    const ingredientsList = recipe.ingredients
        .map(ingredient => `<li>${ingredient}</li>`)
        .join('');
    
 
    const instructionsList = recipe.instructions
        .map(instruction => `<li>${instruction}</li>`)
        .join('');
    
  
    const dietaryTags = recipe.dietary.length > 0
        ? `<p><strong>Dietary:</strong> ${recipe.dietary.join(', ')}</p>`
        : '';
    
   
    modalBody.innerHTML = `
        <img 
            src="${recipe.image}" 
            alt="${recipe.name}" 
            class="modal-recipe-image"
            loading="lazy">
        
        <h2 id="modalTitle">${recipe.name}</h2>
        
        <div class="recipe-meta">
            <span class="recipe-tag">${recipe.cuisine}</span>
            <span>⏱️ ${recipe.cookingTime} minutes</span>
            <span>🍽️ ${recipe.servings} servings</span>
            <span>📊 ${recipe.difficulty}</span>
        </div>
        
        ${dietaryTags}
        
        <p>${recipe.description}</p>
        
        <div class="modal-section">
            <h3>Ingredients</h3>
            <ul class="ingredients-list">
                ${ingredientsList}
            </ul>
        </div>
        
        <div class="modal-section">
            <h3>Instructions</h3>
            <ol class="instructions-list">
                ${instructionsList}
            </ol>
        </div>
    `;
    

    modal.classList.add('active');
    
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    const modal = document.getElementById('recipeModal');
    modal.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
}

// ===== DISPLAY RECIPES (Reusable function) =====
export function displayRecipes(recipes, containerId = 'featured-recipes') {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
    }
    
    if (recipes.length === 0) {
        container.innerHTML = `
            <p class="error-message">No recipes found.</p>
        `;
        return;
    }
    
    const recipesHTML = recipes.map(recipe => `
        <div class="recipe-card" data-id="${recipe.id}">
            <img 
                src="${recipe.image}" 
                alt="${recipe.name}" 
                class="recipe-image"
                loading="lazy">
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.name}</h3>
                <p>${recipe.description}</p>
                <div class="recipe-meta">
                    <span class="recipe-tag">${recipe.cuisine}</span>
                    <span>⏱️ ${recipe.cookingTime} min</span>
                    <span>🍽️ ${recipe.servings} servings</span>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = recipesHTML;
}

// ===== FORMAT TIME =====
export function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} minutes`;
    }
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (mins === 0) {
        return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
}

// ===== DEBOUNCE FUNCTION =====
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== TRUNCATE TEXT =====
export function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength) + '...';
}

// ===== SHUFFLE ARRAY =====
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}