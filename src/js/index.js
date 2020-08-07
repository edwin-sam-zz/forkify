import axios from 'axios';

async function getResults(query) {
    try {
        const result = await axios(`https://forkify-api.herokuapp.com/api/search?q=${query}`);
    const recipes = result.data.recipes;
    console.log(recipes);
    }
    catch (error) {
        alert(error);
    }
}
getResults('pasta');