import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PageView extends View {
  _parentElement = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numOfPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    // if page 1 and other pages
    if (curPage === 1 && numOfPages > 1) {
      return `
        <span class="middle right">${curPage}/${numOfPages}</span>
        <button class="btn--inline pagination__btn--next" data-goto ="${curPage + 1}">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> 
      `;
    }
    // if page other than 1 and last
    if (curPage < numOfPages && numOfPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto ="${curPage - 1}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <span class="middle">${curPage}/${numOfPages}</span>
        <button class="btn--inline pagination__btn--next" data-goto ="${curPage + 1}">
          <span>Page ${curPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button> 
      `;
    }
    // if page last one
    if (curPage === numOfPages && numOfPages > 1) {
      return `
        <button class="btn--inline pagination__btn--prev" data-goto ="${curPage - 1}">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${curPage - 1}</span>
        </button>
        <span class="middle">${curPage}/${numOfPages}</span>
      `;
    }
    // if page 1 and no page
    return '';
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const goTo = +btn.dataset.goto;
      handler(goTo);
    });
  }
}

export default new PageView();
