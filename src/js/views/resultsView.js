import View from './view.js';
import Preview from './previewView.js'

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query. Please try again!';

  _generateMarkup() {
    return this._data.map(result => Preview.render(result,false)).join('');
  }

  addHandlerSort(handler) {
    document.querySelector('.search-results').addEventListener('click',function(e) {
      e.preventDefault();
      const btn = e.target.closest('.sorting');
      if(!btn) return;
      console.log(btn.value);
      handler(btn.value);
    })
  }
}

export default new ResultsView();
