
import { API_URL, RES_PER_PAGE,KEY } from './config.js';
import { getJSON, sendJSON } from './helper.js';
export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    recipes: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const makeNewObject = function(data) {
  const { recipe } = data.data;
  return  {
      publisher: recipe.publisher,
      image: recipe.image_url,
      title: recipe.title,
      id: recipe.id,
      cookingTime: recipe.cooking_time,
      sourceUrl: recipe.source_url,
      servings: recipe.servings,
      ingredients: recipe.ingredients,
      ...(recipe.key && {key : recipe.key}) ,
    };
}
export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);
    
    state.recipe = makeNewObject(data);

    console.log(state.bookmarks);
    if(state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);
    // console.log(data);
    state.search.results = data.data.recipes.map(rec => {
      return {
        publisher: rec.publisher,
        image: rec.image_url,
        title: rec.title,
        id: rec.id,
        ...(rec.key && {key: rec.key}),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


export const loadPageResults = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};
// loadSearchResults('pizza');

export const getRecipeServings = function(newServings) {
  // const newQuantity = oldQuantity * newServings/oldServings;
  state.recipe.ingredients.forEach((ing) => {
    ing.quantity = ing.quantity * ( newServings / state.recipe.servings);
  })
  state.recipe.servings = newServings;
}

const persistantStorage = function() {
  localStorage.setItem('bookmarks',JSON.stringify(state.bookmarks));
}

export const addBookmark = function(recipe) {
  
  state.bookmarks.push(recipe);
  if(recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  

  persistantStorage();
}

export const deleteBookmark = function(id) {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index,1);

  if(state.recipe.id === id) state.recipe.bookmarked = false;

  persistantStorage();
}


const init = function() {
  const bookmarks = localStorage.getItem('bookmarks');
  if(bookmarks) {
    state.bookmarks = JSON.parse(bookmarks);
    // state.bookmarks.forEach(res => res.bookmarked = true);
  } 
  console.log(state.bookmarks); 
}

init();


const clearStorage = function() {
  localStorage.clear('bookmarks');
}

// clearStorage();

export const addNewRecipe = async function(newRecipe) {
  try  {
  
    const ingredients = Object.entries(newRecipe).filter(ing => ing[0].startsWith('ingredient') && ing[1] !== '').map(ing => {
      const ingArr = ing[1].replaceAll(' ','').split(',');
      if(ing[1].length < 3) {
        throw new Error('Invalid input .Please try again');
      }

      const [quantity,unit,description] = ingArr;
      return {quantity: (quantity) ? +quantity : null,unit, description}
    });
    
    
    const recipe = {
      publisher: newRecipe.publisher,
      image_url: newRecipe.image,
      title: newRecipe.title,
      cooking_time: +newRecipe.cookingTime,
      source_url: newRecipe.sourceUrl,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(`${API_URL}?key=${KEY}`,recipe);  

    state.recipe = makeNewObject(data);
    addBookmark(state.recipe);

  } catch(err) {
    console.error(err);
    throw err;
  }
}
