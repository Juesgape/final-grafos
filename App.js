import { useEffect, useState } from 'react';
import './App.css';
import { Graph } from './classes/Graph';
import { authorBooksOrderedByYear, 
          booksWithSameGenreAndDecade, 
          authorsOrderedByBooksWrittenInGenre, 
          booksWithinGenreAndCertainRating,
          recommendShoppingList } from './utils/functions.js';

// G: {A: B}, R: {G:B}, P: {G:B}

const convertBooksToGraph = (data, setBooksData) => {
  const myGraph = new Graph()
  myGraph.addVertex("books")
  myGraph.addVertex("authors")
  myGraph.addVertex("decades")
  myGraph.addVertex("prices")
  myGraph.addVertex("rating")
  myGraph.addVertex("genres")

  const books = data.books


  for(let i = 0; i < books.length; i++) {

    const yearIntoDecadeParsed = parseInt(books[i].year, 10)
    const decade = Math.floor(yearIntoDecadeParsed / 10) * 10

    myGraph.addEdge("authors", books[i].author, "wrote", books[i].title)

    myGraph.addEdge("books", books[i].title, "publishedIn", books[i].year)
    
    myGraph.addEdge("books", books[i].title, "writtenBy", books[i].author)
    myGraph.addEdge("books", books[i].title, "costs", books[i].price)
    myGraph.addEdge("books", books[i].title, "wasRated", books[i].rating)
    myGraph.addEdge("books", books[i].title, "image", books[i].image)
    
    
    books[i].genres.forEach(genre => { 
      myGraph.addEdge("books", books[i].title, "is", genre)

      myGraph.addEdge("genres", genre, books[i].author, books[i].title)
      
      myGraph.addEdge("decades", decade, genre, books[i].title)
      
      myGraph.addEdge("rating", Math.ceil(parseInt(books[i].rating)), genre, books[i].title)
      
      myGraph.addEdge("prices", books[i].price, genre, books[i].title)
    })
  }

  console.log(authorBooksOrderedByYear('J.R.R. Tolkien', myGraph))
  console.log(booksWithSameGenreAndDecade('The Hobbit', 10, myGraph))
  console.log(authorsOrderedByBooksWrittenInGenre('Childrens', myGraph))
  console.log(booksWithinGenreAndCertainRating(3, ['Adventure', 'Biography'], myGraph))
  console.log(recommendShoppingList(10, ['Fiction', 'Classics'], myGraph))


  setBooksData(myGraph)
}

const getBooksData = async (setBooksData) => {
  try {
    const fetchingData = await fetch('http://localhost:3001/api/books')

    const finalData = await fetchingData.json()

    setBooksData(finalData)

    return finalData

  } catch(err) {
    console.error(err)
    return null
  }

} 

function App() {

  const [booksData, setBooksData] = useState({})
  const [convertGraph, setConvertGraph] = useState(true)

  
  useEffect(() => {
    if(Object.keys(booksData).length === 0) {
      getBooksData(setBooksData) 
    }
  }, [booksData])

  useEffect(() => {
    if(Object.keys(booksData).length > 0 && convertGraph === true) {
      convertBooksToGraph(booksData, setBooksData)
      setConvertGraph(false)
    } 
  }, [booksData])
  
  return (
    <div className="App">
      
    </div>
  );
}

export default App;
