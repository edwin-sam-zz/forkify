import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView  from './views/recipeView';
import Search from './models/Search';

/** Global State of the app
 *  - Search object
 *  - Current Recipe object
 *  - Shopping list object
 *  - Liked recipes
 */

const State = {};

 /**
  * SEARCH CONROLLER
  */

const controlSearch = async () => {
    // Get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to state
        State.search = new Search(query);

        //3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            // 4) Search for recipes
            await State.search.getResults();

            //5) Render results on UI 
            clearLoader();
            searchView.renderResults(State.search.result);
            console.log(State.search.result);
        } catch (error) {
            alert('Error processing search results');
            clearLoader();
        }
    }
};

elements.searchForm.addEventListener('submit', e => {
   e.preventDefault();
   controlSearch();
});

elements.searchRecPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(State.search.result, goToPage);
    }
});
 
/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async() => {
    // Get ID from URL 
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        // Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);
        
        //Highlight selected 
        if (State.search) searchView.highlightSelected(id);

        // Create new recipe object
        State.recipe = new Recipe(id);
        try {
            // Get recipe data and parse ingredients 
            await State.recipe.getRecipe();
            State.recipe.parseIngredients();

            // Calculate servings and time
            State.recipe.calcTime();
            State.recipe.calcServings();  

            // Render recipe
            clearLoader();
            recipeView.renderRecipe(State.recipe);
        }
        catch (error) {
            alert('Error processing recipe!');
            clearLoader();
        }
    }
};

//If hash changes or page loads, fire event 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (State.recipe.servings > 1) {
            // Decrease button is clicked
            State.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(State.recipe);
        }
        
    } else if (e.target.matches('.btn-increase, .btn-increase  *')) {
        // Increase button is clicked
        State.recipe.updateServings('inc');
        console.log(State.recipe);
        recipeView.updateServingsIngredients(State.recipe);
    }
});

window.l = new List();


