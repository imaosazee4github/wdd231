import { openModal, initializeModal, displayRecipes } from './utils.js';

let allRecipes = [];

async function fetchRecipes() {
    try {
        const response = await fetch('./data/recipes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allRecipes = data.recipes;
        
        displayFeaturedRecipes();
        
        saveToLocalStorage('allRecipes', allRecipes);
        
    } catch (error) {
        console.error('Error fetching recipes:', error);

        const container = document.getElementById('featured-recipes');
        if (container) {
            container.innerHTML = `
                     <div class="empty-state">
                    <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                        <circle cx="50" cy="50" r="40" stroke="#E8E8E8" stroke-width="4"/>
                        <path d="M30 50 L45 65 L70 35" stroke="#C67B5C" stroke-width="4" fill="none"/>
                    </svg>
                    <h3>Failed to Load Recipes</h3>
                    <p>Please try again later.</p>
                </div>
            `;
        }
    }
}

function displayFeaturedRecipes() {
   const container = document.getElementById('featured-recipes');
    if (!container) return;

     container.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Loading delicious recipes...</p>
        </div>
    `;

    const featuredRecipes = allRecipes.slice(0, 6);

     displayRecipes(featuredRecipes, 'featured-recipes');

       attachRecipeCardListeners();
}
    

function attachRecipeCardListeners() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = parseInt(card.dataset.id);
            const recipe = allRecipes.find(r => r.id === recipeId);
            
            if (recipe) {
                openModal(recipe);
                saveToLocalStorage('lastViewedRecipe', recipe);
            }
        });
    });
}

function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

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

function setCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

async function initialize() {
    setCurrentYear();
    initializeHamburgerMenu();
    initializeModal();
    await fetchRecipes();
}

document.addEventListener('DOMContentLoaded', initialize);
