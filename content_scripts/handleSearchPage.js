;(function () {

  const isDev = true

  setTimeout(launch, 500)

  function launch() {
    if (isDev !== true) {
      handleSearchPageSO()
    } else {
      try {
        handleSearchPageSO()
      } catch (err) {
        const message = `
          Error [ handleSearchPageSO ]
          ${err.message || ''}
          `
        alert(message)
      }
    }
  }
})();

function handleSearchPageSO() {

  const resultsContainer = document.querySelector('.js-search-results > div:not(.ba)')
  const tokens = tokenizeSearch()
}

function tokenizeSearch() {
  const tokensContainer = {
    allTokens: [],
    queryParamsPhrases: [],
    keywords: [],
    keywordsSanitized: [],
    keywordsShorted: [],
    urlWithoutKeywords: '',
    queryStringOfLocation: '',
  }

  tokensContainer.queryStringOfLocation = (new URL(document.location)).searchParams.get('q')
  tokensContainer.allTokens = tokensContainer.queryStringOfLocation.split(/\s+/g)

  const regexPhrases = /([\[])|(\.\.)|(^-)|(:)/

  tokensContainer.allTokens.reduce((tokens, token) => {
    if (regexPhrases.test(token)) {
      tokens.queryParamsPhrases.push(token)
    } else {
      tokens.keywords.push(token)
    }
    return tokens
  }, tokensContainer)

  tokensContainer.queryParamsPhrases = tokensContainer.queryParamsPhrases.reduce((phrases, phrase) => {

    if (phrase.startsWith('title:')) {
      const word = phrase.replace('title:', '')
      tokensContainer.keywords.push(word)
      return phrases
    }

    if (phrase.startsWith('body:')) {
      const word = phrase.replace('body:', '')
      tokensContainer.keywords.push(word)
      return phrases
    }

    phrases.push(phrase)
    return phrases
  }, [])


  function getSearchWords(queryString) {
    const allWords = queryString.split(/\s+/g)
    const reg = /([\[])|(\.\.)|(^-)|(:)/
    let words = []

    words = allWords.filter(word => {
      const match = reg.test(word)
      return !match
    })

    return words
  }
}

function customSortResultByExact(resultsContainer) {
  const queryString = (new URL(document.location)).searchParams.get('q')
  const searchWords = getSearchWords(queryString)

  if (searchWords.length === 0) {
    return
  }

  const shortedWords = prepareWords(searchWords)

  const resultElems = [...resultsContainer.querySelectorAll('.question-summary.search-result')]
  const searchResultObjs = resultElems.map(formatResultToObject)
  const detectExactByKeywords = detectExact.bind(null, shortedWords)
  const exactResults = searchResultObjs.filter(detectExactByKeywords)

  if (exactResults.length === 0) {
    return
  }

  stylizeExactResults(exactResults)
  sortByExact(resultsContainer, exactResults)

  function getSearchWords(queryString) {
    const sanitized = queryString.trim()
      .replace(/title:/gi, '')
      .replace(/body:/gi, '')
    const allWords = sanitized.split(/\s+/g)
    const reg = /([\[])|(\.\.)|(^-)|(:)/
    let words = []

    words = allWords.filter(word => {
      const match = reg.test(word)
      return !match
    })

    return words
  }

  function prepareWords(words) {
    const shortedWords = words.map(word => {
      let wordLowerCase = word.toLowerCase()
      if (wordLowerCase.length < 5) {
        return wordLowerCase
      }
      return wordLowerCase.slice(0, wordLowerCase.length - Math.ceil(wordLowerCase.length / 4));
    });
    return shortedWords
  }

  function formatResultToObject(result) {
    const refDOM = result
    const titleElem = result.querySelector('H3')
    const titleLowerCase = titleElem.textContent.toLowerCase()

    return {
      refDOM,
      titleElem,
      titleLowerCase
    }
  }

  function detectExact(keywords, resultObj) {
    const {titleLowerCase} = resultObj
    const isExact = keywords.every(word => titleLowerCase.includes(word))
    return isExact
  }

  function stylizeExactResults(results) {
    results.forEach(result => {
      result.refDOM.style.border = '1px solid cyan'
    })
  }

  function sortByExact(resultsContainer, exactResults) {
    let index = exactResults.length - 1
    while (index) {
      const current = exactResults[index].refDOM
      resultsContainer.prepend(current)
      index -= 1
    }
  }
}



