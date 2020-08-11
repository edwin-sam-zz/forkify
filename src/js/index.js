import { elements } from './views/base';
import * as searchView from './views/searchView';
import Search from './models/Search';

/** Global State of the app
 *  - Search object
 *  - Current Recipe object
 *  - Shopping list object
 *  - Liked recipes
 */

const State = {};

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
        
        // 4) Search for recipes
        await State.search.getResults();

        //5) Render results on UI 
        searchView.renderResults(State.search.result);
    }
};

elements.searchForm.addEventListener('submit', e => {
   e.preventDefault();
   controlSearch();
});