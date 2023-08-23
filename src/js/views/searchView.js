class SearchView {
  _parentElement = document.querySelector('.search');

  queryInput() {
    const input = this._parentElement.querySelector('.search__field').value;
    console.log(input);
    this.#clearInput();
    return input;
  }

  #clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
