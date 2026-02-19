// scripts/recipes.js
import { openModal, initializeModal, displayRecipes, debounce } from './utils.js';

let allRecipes = [];
let filteredRecipes = [];
let currentPage = 1;
const recipesPerPage = 9;
let currentView = 'grid'; // 'grid' or 'list'

// DOM Elements
const recipesContainer = document.getElementById('recipes-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const cuisineFilter = document.getElementById('cuisineFilter');
const dietFilter = document.getElementById('dietFilter');
const timeFilter = document.getElementById('timeFilter');
const difficultyFilter = document.getElementById('difficultyFilter');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const recipeCountSpan = document.getElementById('recipeCount');
const filterStatus = document.getElementById('filter-status');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageNumbersDiv = document.getElementById('pageNumbers');
const gridViewBtn = document.getElementById('gridView');
const listViewBtn = document.getElementById('listView');
const activeFiltersDiv = document.getElementById('active-filters');
const emptyStateDiv = document.getElementById('empty-state');
const paginationSection = document.getElementById('pagination-section');
const backToTopBtn = document.getElementById('backToTop');

// Initialize the page
async function initializeRecipesPage() {
    console.log('Recipes page initializing...');
    
    setCurrentYear();
    initializeHamburgerMenu();
    initializeModal();
    setupBackToTop();
    await fetchAllRecipes();
    setupEventListeners();
    
    // Check for URL parameters on load
    checkUrlParams();
}

// Fetch all recipes
async function fetchAllRecipes() {
    try {
        const response = await fetch('./data/recipes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        allRecipes = data.recipes;
        filteredRecipes = [...allRecipes];
        
        // Update UI
        updateRecipesDisplay();
        updateFilterStatus();
        
    } catch (error) {
        console.error('Error fetching recipes:', error);
        showErrorState();
    }
}

// Show error state
function showErrorState() {
    if (recipesContainer) {
        recipesContainer.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 100 100" fill="none">
                    <circle cx="50" cy="50" r="40" stroke="#E8E8E8" stroke-width="4"/>
                    <path d="M30 50 L45 65 L70 35" stroke="#C67B5C" stroke-width="4" fill="none"/>
                </svg>
                <h3>Failed to Load Recipes</h3>
                <p>Please try refreshing the page.</p>
                <button onclick="location.reload()" class="cta-button">Refresh Page</button>
            </div>
        `;
    }
}

// Set up event listeners
function setupEventListeners() {
    // Search
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
    }
    
    // Filter buttons
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', applyFilters);
    }
    
    if (resetFiltersBtn) {
        resetFiltersBtn.addEventListener('click', resetAllFilters);
    }
    
    // View toggle
    if (gridViewBtn && listViewBtn) {
        gridViewBtn.addEventListener('click', () => switchView('grid'));
        listViewBtn.addEventListener('click', () => switchView('list'));
    }
    
    // Pagination
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', () => changePage(currentPage - 1));
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', () => changePage(currentPage + 1));
    }
    
    // Enter key in search
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        filteredRecipes = [...allRecipes];
    } else {
        filteredRecipes = allRecipes.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.cuisine.toLowerCase().includes(searchTerm) ||
            (recipe.ingredients && recipe.ingredients.some(ing => 
                ing.toLowerCase().includes(searchTerm)
            ))
        );
    }
    
    currentPage = 1;
    updateRecipesDisplay();
    updateFilterStatus();
    updateActiveFiltersDisplay();
}

// Apply all filters
function applyFilters() {
    let results = [...allRecipes];
    
    // Apply search filter if exists
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
        results = results.filter(recipe => 
            recipe.name.toLowerCase().includes(searchTerm) ||
            recipe.description.toLowerCase().includes(searchTerm) ||
            recipe.cuisine.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply cuisine filter
    if (cuisineFilter.value !== 'all') {
        results = results.filter(recipe => recipe.cuisine === cuisineFilter.value);
    }
    
    // Apply dietary filter
    if (dietFilter.value !== 'all') {
        results = results.filter(recipe => 
            recipe.dietary && recipe.dietary.includes(dietFilter.value)
        );
    }
    
    // Apply time filter
    if (timeFilter.value !== 'all') {
        results = results.filter(recipe => {
            if (timeFilter.value === 'quick') return recipe.cookingTime <= 30;
            if (timeFilter.value === 'medium') return recipe.cookingTime > 30 && recipe.cookingTime <= 60;
            if (timeFilter.value === 'long') return recipe.cookingTime > 60;
            return true;
        });
    }
    
    // Apply difficulty filter
    if (difficultyFilter.value !== 'all') {
        results = results.filter(recipe => recipe.difficulty === difficultyFilter.value);
    }
    
    filteredRecipes = results;
    currentPage = 1;
    updateRecipesDisplay();
    updateFilterStatus();
    updateActiveFiltersDisplay();
}

// Reset all filters
function resetAllFilters() {
    // Reset input fields
    searchInput.value = '';
    cuisineFilter.value = 'all';
    dietFilter.value = 'all';
    timeFilter.value = 'all';
    difficultyFilter.value = 'all';
    
    // Reset results
    filteredRecipes = [...allRecipes];
    currentPage = 1;
    
    // Update display
    updateRecipesDisplay();
    updateFilterStatus();
    updateActiveFiltersDisplay();
}

// Update active filters display
function updateActiveFiltersDisplay() {
    if (!activeFiltersDiv) return;
    
    const activeFilters = [];
    
    if (searchInput.value.trim()) {
        activeFilters.push(`Search: "${searchInput.value}"`);
    }
    
    if (cuisineFilter.value !== 'all') {
        activeFilters.push(`Cuisine: ${cuisineFilter.value}`);
    }
    
    if (dietFilter.value !== 'all') {
        activeFilters.push(`Diet: ${dietFilter.value}`);
    }
    
    if (timeFilter.value !== 'all') {
        const timeLabels = { quick: 'Quick (<30 min)', medium: 'Medium (30-60 min)', long: 'Long (>60 min)' };
        activeFilters.push(`Time: ${timeLabels[timeFilter.value]}`);
    }
    
    if (difficultyFilter.value !== 'all') {
        activeFilters.push(`Difficulty: ${difficultyFilter.value}`);
    }
    
    if (activeFilters.length === 0) {
        activeFiltersDiv.innerHTML = '';
        return;
    }
    
    activeFiltersDiv.innerHTML = `
        <span class="active-filters-label">Active Filters:</span>
        ${activeFilters.map(filter => `
            <span class="filter-tag">${filter}</span>
        `).join('')}
    `;
}

// Update recipes display with pagination
function updateRecipesDisplay() {
    if (!recipesContainer) return;
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * recipesPerPage;
    const endIndex = startIndex + recipesPerPage;
    const paginatedRecipes = filteredRecipes.slice(startIndex, endIndex);
    
    // Show/hide empty state
    if (filteredRecipes.length === 0) {
        showEmptyState();
        return;
    } else {
        hideEmptyState();
    }
    
    // Show/hide pagination
    if (filteredRecipes.length > recipesPerPage) {
        showPagination();
        updatePagination();
    } else {
        hidePagination();
    }
    
    // Display recipes with current view
    if (currentView === 'grid') {
        displayRecipes(paginatedRecipes, 'recipes-container');
    } else {
        displayRecipesAsList(paginatedRecipes);
    }
    
    // Attach click listeners to new recipe cards
    attachRecipeCardListeners();
    
    // Update recipe count
    updateRecipeCount();
}

// Display recipes as list view
function displayRecipesAsList(recipes) {
    const recipesHTML = recipes.map(recipe => `
        <div class="recipe-card list-view" data-id="${recipe.id}">
            <img 
                src="${recipe.image}" 
                alt="${recipe.name}" 
                class="recipe-image"
                loading="lazy">
            <div class="recipe-info">
                <h3 class="recipe-title">${recipe.name}</h3>
                <p>${recipe.description.substring(0, 120)}${recipe.description.length > 120 ? '...' : ''}</p>
                <div class="recipe-meta">
                    <span class="recipe-tag">${recipe.cuisine}</span>
                    <span>⏱️ ${recipe.cookingTime} min</span>
                    <span>🍽️ ${recipe.servings} servings</span>
                    <span>📊 ${recipe.difficulty}</span>
                </div>
                ${recipe.dietary && recipe.dietary.length > 0 ? 
                    `<div class="dietary-tags">
                        ${recipe.dietary.map(diet => `<span class="dietary-tag">${diet}</span>`).join('')}
                    </div>` : ''}
            </div>
        </div>
    `).join('');
    
    recipesContainer.innerHTML = recipesHTML;
}

// Switch between grid and list view
function switchView(view) {
    currentView = view;
    
    // Update button active states
    if (gridViewBtn && listViewBtn) {
        if (view === 'grid') {
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            recipesContainer.classList.remove('list-view-mode');
        } else {
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            recipesContainer.classList.add('list-view-mode');
        }
    }
    
    // Refresh display
    updateRecipesDisplay();
}

// Update recipe count display
function updateRecipeCount() {
    if (recipeCountSpan) {
        recipeCountSpan.textContent = filteredRecipes.length;
    }
}

// Update filter status message
function updateFilterStatus() {
    if (!filterStatus) return;
    
    if (filteredRecipes.length === allRecipes.length) {
        filterStatus.textContent = 'Showing all recipes';
    } else {
        filterStatus.textContent = `Found ${filteredRecipes.length} recipe${filteredRecipes.length !== 1 ? 's' : ''}`;
    }
}

// Show empty state
function showEmptyState() {
    if (emptyStateDiv) {
        emptyStateDiv.style.display = 'block';
    }
    if (recipesContainer) {
        recipesContainer.innerHTML = '';
    }
    hidePagination();
}

// Hide empty state
function hideEmptyState() {
    if (emptyStateDiv) {
        emptyStateDiv.style.display = 'none';
    }
}

// Show pagination
function showPagination() {
    if (paginationSection) {
        paginationSection.style.display = 'block';
    }
}

// Hide pagination
function hidePagination() {
    if (paginationSection) {
        paginationSection.style.display = 'none';
    }
}

// Update pagination controls
function updatePagination() {
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    
    // Update previous/next buttons
    if (prevPageBtn) {
        prevPageBtn.disabled = currentPage === 1;
    }
    
    if (nextPageBtn) {
        nextPageBtn.disabled = currentPage === totalPages;
    }
    
    // Generate page numbers
    if (pageNumbersDiv) {
        let pageNumbersHTML = '';
        
        // Always show first page
        pageNumbersHTML += `<button class="page-number ${currentPage === 1 ? 'active' : ''}" data-page="1">1</button>`;
        
        // Show ellipsis if needed
        if (currentPage > 3) {
            pageNumbersHTML += `<span class="page-ellipsis">...</span>`;
        }
        
        // Show pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            if (i > 1 && i < totalPages) {
                pageNumbersHTML += `<button class="page-number ${currentPage === i ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
        }
        
        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            pageNumbersHTML += `<span class="page-ellipsis">...</span>`;
        }
        
        // Always show last page if more than 1 page
        if (totalPages > 1) {
            pageNumbersHTML += `<button class="page-number ${currentPage === totalPages ? 'active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        pageNumbersDiv.innerHTML = pageNumbersHTML;
        
        // Add event listeners to page numbers
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                changePage(page);
            });
        });
    }
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    updateRecipesDisplay();
    
    // Scroll to top of recipes
    recipesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Attach click listeners to recipe cards
function attachRecipeCardListeners() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = parseInt(card.dataset.id);
            const recipe = allRecipes.find(r => r.id === recipeId);
            
            if (recipe) {
                openModal(recipe);
            }
        });
    });
}

// Check URL parameters for filters
function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const cuisineParam = urlParams.get('cuisine');
    
    if (cuisineParam && cuisineFilter) {
        cuisineFilter.value = cuisineParam;
        applyFilters();
    }
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeRecipesPage);