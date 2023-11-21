const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs/promises')

let count = 0

const getData = async (link) => {
    console.log('Starting the extraction')
    const browser = await puppeteer.launch({headless: "new"})
    const page = await browser.newPage()
    await page.goto(link)

    let data = {}

    const bookLinks = await page.$$eval('.bookTitle', links =>
        links.map(link => link.href)
    );

    bookLinks.splice(0, 17)

    console.log(`Found ${bookLinks.length} books on page`);

    //Go through each book link to get each book information
    for(let i = 0; i < bookLinks.length; i++) {
        await page.goto(bookLinks[i], {timeout: 60000})
        
        let bookData = await page.evaluate(() => {
            let titleElement = document.querySelector('.Text__title1')
            let authorElement = document.querySelector('.ContributorLink__name')
            let pagesElement = document.querySelector('.FeaturedDetails [data-testid="pagesFormat"]')
            let publicationElement = document.querySelector('.FeaturedDetails [data-testid="publicationInfo"]').textContent.split('published')[1].trim()
            let genreElement = document.querySelectorAll('.CollapsableList .Button__labelItem')
            let coverElement = document.querySelector('.ResponsiveImage')
            
            let publicationData = publicationElement?.split(',')
            let yearOfPublication = publicationData[1]?.trim()
            let monthOfPublication = publicationData[0]?.split(' ')[0]
            let dayOfPublication = publicationData[0]?.split(' ')[1]


            let priceElement = document.querySelector('.Button--buy .Button__labelItem')
            let ratingElement = document.querySelector('.RatingStatistics__rating')

            return {
                title: titleElement ? titleElement?.textContent.trim() : null,
                author: authorElement ? authorElement?.textContent.trim() : null,
                price : priceElement ? priceElement?.textContent.trim().split('$')[1] : null,
                rating : ratingElement ? ratingElement?.textContent.trim() : null,
                pages: pagesElement ? pagesElement?.textContent.split('pages')[0].trim() : null,
                publication : publicationElement ? publicationElement : null,
                year: yearOfPublication ? yearOfPublication : null,
                month: monthOfPublication ? monthOfPublication : null,
                day: dayOfPublication ? dayOfPublication : null,
                genres: [genreElement[0]?.textContent, genreElement[1]?.textContent, genreElement[2]?.textContent],
                image: coverElement ? coverElement.src : null
            }
        })

        console.log(bookData);
        
        count++
        console.log(count, '%');

        
        if(!data.books) {
            data.books = [bookData]
        } else {
            data.books.push(bookData)
        }
        
    }

    console.log(JSON.stringify(data));

    await page.close()
    await browser.close();

    await fs.mkdir('data', {recursive: true})

    await fs.writeFile(`data/books.json`, JSON.stringify(data))

    console.log('End of extraction');
}

getData('https://www.goodreads.com/list/show/264.Books_That_Everyone_Should_Read_At_Least_Once?page=3')

//100 books
// https://www.goodreads.com/list/show/264.Books_That_Everyone_Should_Read_At_Least_Once?

//200 books
//https://www.goodreads.com/list/show/264.Books_That_Everyone_Should_Read_At_Least_Once?page=2

//300 books 
//https://www.goodreads.com/list/show/264.Books_That_Everyone_Should_Read_At_Least_Once?page=3

