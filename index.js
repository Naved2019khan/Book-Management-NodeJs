const express = require("express")
const usersRoutes = require("./routes/users")
const booksRoutes = require("./routes/books")

const app = express()

app.use(express.json())


app.get('/', (req, res) => {
    res.status(200).json({
        msg : "server is running"
    })
})

app.use("/users", usersRoutes)
app.use("/books",booksRoutes)


app.get("*", (req,res) => {
    res.status(404).json({
        message : "no page found"
    })
})

app.listen(8081, () => {
    console.log("server running here 8081")
})