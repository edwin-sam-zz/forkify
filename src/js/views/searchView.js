import { elements } from './base';

// Get whats in the input 
export const getInput = () => elements.searchInput.value;

// Clear input field
export const clearInput = () => {
    elements.searchInput.value = '';
};

// Clear results from page
export const clearResults = () => {
    elements.searchRecList.innerHTML = '';
    elements.searchRecPages.innerHTML = '';
}

// Limit title of recipe to 17 characters 
const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc +  cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return results 
        return `${newTitle.join(' ')} ...`;
    }
    return title;
}

//Rendering the recipe in the "results" column
const renderRecipe = recipe => {
    const markup = `
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">P${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.searchRecList.insertAdjacentHTML("beforeend", markup);
};


// Type: 'prev' or 'next'
const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}> 
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`; 

// Render recipe page next and back button
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        // Button to go to next page
        button = createButton(page, 'next');
    } else if (page < pages) {
        // Both button to go back and forth 
        button = `
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `
    }
    else if (page === pages && pages > 1) {
        //only button to go to previous page
        button = createButton(page, 'prev');

    }
    elements.searchRecPages.insertAdjacentHTML('afterbegin', button);
};

// Display amount of results and pages 
export const renderResults = (recipes, page = 1, recPerPage = 10) => {
    // Render results of current page 
    const start = (page - 1) * recPerPage;
    const end = page * recPerPage;
    recipes.slice(start, end).forEach(renderRecipe); 

    // Render pagination buttons
    renderButtons(page, recipes.length, recPerPage);
};