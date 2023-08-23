import View from './view.js';
import Preview from './previewView.js';

class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';

  _generateMarkup() {
    return this._data.map(bookmark => Preview.render(bookmark,false)).join('');
  }

  addHandlerRender(handler) {
    window.addEventListener('load',handler);
  }
}

export default new BookmarkView();
