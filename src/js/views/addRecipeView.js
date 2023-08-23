import View from './view.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe successfully added :)';

  _window = document.querySelector('.add-recipe-window');
  _btn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');
  _overlay = document.querySelector('.overlay');

  constructor() {
    super();
    this._addHandlerShow();
    this._addHandlerHide();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _addHandlerShow() {
    this._btn.addEventListener('click',this.toggleWindow.bind(this));
  }

  _addHandlerHide() {
    this._closeBtn.addEventListener('click',this.toggleWindow.bind(this));
    this._overlay.addEventListener('click',this.toggleWindow.bind(this));
  }

  addHandlerRecipe(handler) {
    this._parentElement.addEventListener('submit',function(e) {
        e.preventDefault();
        const data = [...new FormData(this)];
        const object = Object.fromEntries(data);
        // console.log(object);
        handler(object);
    })
  }

  

}

export default new AddRecipeView();
