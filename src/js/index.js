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
    const query = 'pizza';

    if (query) {
        // 2) New search object and add to state
        State.search = new Search(query);

        //3) Prepare UI for results

        // 4) Search for recipes
        await State.search.getResults();

        //5) Render results on UI 
        console.log(State.search.result);
    }
};

document.querySelector('.search').addEventListener('submit', e => {
   e.preventDefault();
   controlSearch();
});