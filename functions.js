const authorBooksOrderedByYear = (authorName, graph) => {
    console.log(graph)
    const allWrittebBooks = graph.adjacentList.authors[authorName].wrote

    let finalResult = []

    for(let i = 0; i < allWrittebBooks.length; i++) {
        const bookInfo = {[allWrittebBooks[i]] : graph.adjacentList.books[allWrittebBooks[i]].publishedIn[0]}
        finalResult.push(bookInfo)
    }

    finalResult.sort((a, b) => a[Object.keys(a)[0]] - b[Object.keys(b)[0]])

    return finalResult
}

const booksWithSameGenreAndDecade = (bookName, n, graph) => {
    const decadeToSearch = Math.floor(parseInt(graph.adjacentList.books[bookName].publishedIn[0], 10) / 10) * 10
    const genresToSearch = graph.adjacentList.books[bookName].is

    let booksFound = new Set()

    for(let i = 0; i < genresToSearch.length; i++) {
        let books = graph.adjacentList.decades[decadeToSearch][genresToSearch[i]]

        books = books.filter(element => element !== bookName)

        booksFound = [...books]
    }

    let finalResult = []

    for(let i = 0; i < n; i++) {
        if(i >= booksFound.length) {
            console.warn('Max books found reached', booksFound.length);
            return finalResult
        }

        finalResult.push(booksFound[i])
    }

    return finalResult;
}

const authorsOrderedByBooksWrittenInGenre = (genre, graph) => {
    /* console.log(graph); */
    const authors = Object.keys(graph.adjacentList.genres[genre])
    const booksPerAuthor = Object.values(graph.adjacentList.genres[genre])

    let finalResult = []

    for(let i = 0; i < authors.length; i++) {
        const authorAndTotalBooks = {[authors[i]]: booksPerAuthor[i].length}
        finalResult.push(authorAndTotalBooks)
    }

    finalResult.sort((a, b) => b[Object.keys(b)[0]] - a[Object.keys(a)[0]])

    return finalResult
}  

const booksWithinGenreAndCertainRating = ( ratingNumber, genres, graph) => {
    /* console.log(graph); */

    let finalResult = []

    const booksGenresInRating = graph.adjacentList.rating[ratingNumber]

    for (let i = 0; i < genres.length; i++) {
        
        if(booksGenresInRating[genres[i]]) {
            finalResult = [ ...finalResult, booksGenresInRating[genres[i]] ]
        }
    }

    return finalResult.flat()

}

const recommendShoppingList = (money, genres, graph) => {
    /* console.log(graph); */

    let moneyToFloat = parseFloat(money)

    const allPrices = Object.keys(graph.adjacentList.prices).filter(element => parseFloat(element) <= moneyToFloat)
    
    //Splice first element cuz we don't want to recommend the user books that costs $0
    allPrices.sort((a, b) => a - b).splice(0, 1);

    let finalResult = []

    for(let i = 0; i < allPrices.length; i++) {

        for(let j = 0; j < genres.length; j++) {
            if(graph.adjacentList.prices[allPrices[i]][genres[j]]) {
                graph.adjacentList.prices[allPrices[i]][genres[j]].forEach((book) => {
                    finalResult.push({title: book, price: allPrices[i], genre: genres[j]})
                })
            }
        }
    }

    finalResult = shuffleArray(finalResult)

    let finalFinalResult = []
    
    finalResult.forEach((book) => {
        if(moneyToFloat > book.price) {
            finalFinalResult.push(book)
            moneyToFloat -= book.price
        }
    })

    return finalFinalResult

}


//Suffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


export {
    authorBooksOrderedByYear,
    booksWithSameGenreAndDecade,
    authorsOrderedByBooksWrittenInGenre,
    booksWithinGenreAndCertainRating,
    recommendShoppingList
}