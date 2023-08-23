import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultView from './views/resultsView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import searchView from './views/searchView.js';
import addRecipeView from './views/addRecipeView.js';
import { MOD_TIM } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// if (module.hot) {
//   module.hot.accept();
// }
const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // 0. update highlights
    resultView.update(model.loadPageResults());
    bookmarkView.update(model.state.bookmarks);
    
    // 1.load recipe
    await model.loadRecipe(id);
    
    //2. rendering
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
    
    
    
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    resultView.renderSpinner();
    const query = searchView.queryInput();
    if (!query) return;
    // resultView.update(model.loadPageResults());
    // 1.load recipe
    await model.loadSearchResults(query);

   
    // 2.render recipe
    resultView.render(model.loadPageResults());

    // 3.render pages
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (pageToGo) {
  // 2.render recipe
  resultView.render(model.loadPageResults(pageToGo));

  // 3.render pages
  paginationView.render(model.state.search);
};

const controlServings = function(serving) {
  model.getRecipeServings(serving);
  recipeView.update(model.state.recipe);
}

const controlManageBookmarks = function() {
  if(!model.state.recipe.bookmarked) {
    model.addBookmark(model.state.recipe);
  }
  else {
    model.deleteBookmark(model.state.recipe.id);
  }
  
  console.log(model.state.recipe.bookmarked);


  recipeView.update(model.state.recipe);
  console.log(model.state.recipe);


  bookmarkView.render(model.state.bookmarks);
}

const controlBookmarks = function() {
  bookmarkView.render(model.state.bookmarks);
}

const controlAddRecipe = async function(newRecipe) {
  try {
    addRecipeView.renderSpinner();
    
    await model.addNewRecipe(newRecipe);
   
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();
    
    bookmarkView.render(model.state.bookmarks);

    window.history.pushState(null,'',`#${model.state.recipe.id}`);
    setTimeout(()=>{
      addRecipeView.toggleWindow();
    },MOD_TIM * 1000);

   } catch(err) {
    console.log(` Is this some kind of error or something ?? ${err.message}`);
    console.error(err);
    addRecipeView.renderError(err.message);
  }
}


const init = function () {
  bookmarkView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlManageBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerRecipe(controlAddRecipe);
  // resultView.addHandlerSort(controlSorting);
}
init();
