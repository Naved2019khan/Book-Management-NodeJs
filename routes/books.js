const express = require("express")
const { books } = require("../data/books.json")
const { users } = require("../data/users.json")
 
const router = express.Router()

/**Get all books */
router.get("/", (req,res) => {
    res.status(200).json({
        status : true ,
        data : books
    })
})

/**Get  books  by  id*/
router.get("/:id", (req, res) => {
    const { id } = req.params
    const selectedBook = books.find((item) => { if (item.id === id){ return item }  return false })

    if (!selectedBook) { return res.status(401).json({ msg: "No Book found" }) }
    return res.status(200).json({
        status: true,
        data: selectedBook
    })
})


router.get("/issued/books", (req, res) => {

    const issueId = users.filter((item) => { if (item.issuedBook != undefined) { return item.issuedBook }  } )
    const getBooks = issueId.map((userBook) => {
        const book = books.filter((item) => { if (userBook.issuedBook == item.id) return item })
        return book
    })

    if (getBooks.length == 0) { return res.status(401).json({ message: "No Book found here" }) }
    return res.status(200).json({
        status: true,
        data : getBooks
    })


    
})


// add books

router.post("/", (req, res) => {
    const { id, name, author, genre, price, publisher } = req.body
    const didFind = books.find((item) => { item.id === id })
    if (didFind) { return res.status(401).json({ message: "Already Exist" }) }
    books.push({ id, name, author, genre, price, publisher })
    return res.status(200).json({
        status: true,
        data : books
    })

})

router.put("/:id", (req, res) => {
    
    const { id } = req.params
    const { data } = req.body
    const bookId = books.find((each) => each.id == id)
    if (!bookId) { return res.status(401).json({ message : "No Book found by Id"})}
    
    const updateArray = books.map((each) => {
        if (each.id == id)
        {
            return {...each,...data}
        }
        return each
    })
    return res.status(200).json({
        status: true,
        data : updateArray
    })
})
 
module.exports = router