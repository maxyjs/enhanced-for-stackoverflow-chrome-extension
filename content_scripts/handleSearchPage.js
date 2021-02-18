;(function () {
  console.clear()
  handleSearchPageSO().catch((error) => {
    console.error("handleSearchPageSO error")
    console.error(error)
  })
})();

async function handleSearchPageSO() {
  
  const queryString = (new URL(document.location)).searchParams.get('q')
  const resultsContainer = document.querySelector('.js-search-results > div')
  const necessaryWords = getSearchWords(queryString)

  function getSearchWords(queryString) {
    const allWords = queryString.trim().split(/\s+/g)
    const reg = /([\[])|(\.\.)|(^-)|(:)/
    let words = []
    
    words = allWords.filter(word => {
      const match = reg.test(word)
      return !match
    })

    return words
  }
}

