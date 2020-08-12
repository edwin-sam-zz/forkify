import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/recipe';
import * as searchView from './views/searchView';
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
    console.log(query);

    if (query) {
        // 2) New search object and add to state
        State.search = new Search(query);

        //3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        // 4) Search for recipes
        await State.search.getResults();

        //5) Render results on UI 
        clearLoader();
        searchView.renderResults(State.search.result);
        console.log(State.search.result);
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

const r = new Recipe(47746);
r.getRecipe();
console.log(r);

