import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView  from './views/recipeView';
import * as listView  from './views/listView';
import Search from './models/Search';
import Likes from './models/Likes';

/** Global State of the app
 *  - Search object
 *  - Current Recipe object
 *  - Shopping list object
 *  - Liked recipes
 */

const State = {};
window.state = State;

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

 /**
  * LIST CONROLLER
  */

const controlList = () => {
    // Create a new list IF there is none yet
    if (!State.list) State.list = new List();
    
    //Add each ingredient to the list and UI
    State.recipe.ingredients.forEach(el => {
        const item = State.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    })
};

// Handle delete and update list events 
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    //Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        State.list.deleteItem(id);

        // Delete from UI 
        listView.deleteItem(id);
    
        //Handle count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        State.list.updateCount(id, val);
    }
});

 /**
  * LIKES CONROLLER
  */

const controlLike = () => {
    if (!State.likes) State.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!State.likes.isLiked(currentID)) {
        //Add like to the state
        const newLike = State.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button

        // Add like to UI list 
        console.log(State.likes);

    // User HAS liked current recipe
    } else {
        // Remove like from the state 
        State.likes.deleteLike(currentID);

        //Toggle the like button

        // Remove like from UI List 
        console.log(State.likes);
    }


};



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

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // "Add to shopping list" button
        console.log('shopping list button clicked');
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

window.l = new List();


