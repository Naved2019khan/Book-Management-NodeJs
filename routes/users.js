const express = require("express")
const { users } = require("../data/users.json")

const router =  express.Router()


router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: users

    })
})


router.get("/:id", (req, res) => {
    const { id } = req.params
    const user = users.find((each) => each.id === id)
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }
    return res.status(200).json({
        success: true,
        routes: "id",
        data: user

    })
})

router.post("/", (req, res) => {
    const { id, name, surname, email
        , issuedBook, issuedDate,
        returnDate, subscriptionType, subscriptionDate
    } = req.body
    const user = users.find((each) => each.id === id)
    if (user) {
        return res.status(404).json({
            status: false,
            msg: "User already exist"
        })
    }

    users.push({
        id, name, surname, email
        , issuedBook, issuedDate,
        returnDate, subscriptionType, subscriptionDate
    })


    return res.status(201).json({
        success: true,
        msg: users
    })
})

router.put('/:id', (req, res) => {
    const { id } = req.params
    const { data } = req.body

    const user = users.find((each) => each.id == id)
    if (!user) { return res.status(404).json({ success: false, msg: "No user found" }) }
    console.log("Put")
    const updateUser = users.map((each) => {
        if (each.id == id) {
            return {
                ...each,
                ...data
            }

        }
        return each
    })

    return res.status(200).json({
        success: true,
        msg: updateUser,
    })
})

router.get("/subscription-Detail/:id", (req, res) => {
    const { id } = req.params
    const user = users.find(((item) => (id == item.id)))
    if (!user) { return res.status(401).json({ message: "user not found" }) }
    
    const getDays = (data = "") => {
        let date;
        if (data == "")
        {
            date = new Date()
        }
        else {
            date = new Date(data)
        }
        const days = Math.floor(date / (1000 * 60 * 60 * 24))
        return days
    }

    // get subscriptionDate , purchase date
    const subscriptionType = (date) => {
        if (user.subscriptionType == "Basic") {
            date = date + 90
        }
        else if (user.subscriptionType == "Standard") {
            date += 180
        }
        else if (user.subscriptionType == "Premium") {
            date += 365
        }
        return date
    }

    const currentDate = getDays()
    const returnDate = getDays(user.returnDate)
    const subscriptionDate = getDays(user.subscriptionDate)
    const subscriptionExpiration = subscriptionType(subscriptionDate)

    console.log("currentDate",currentDate)
    console.log("returnDate",returnDate)
    console.log("subscriptionDate",subscriptionDate)
    console.log(subscriptionExpiration)

    const data = {
        ...user,
        subscriptionExpirated: subscriptionExpiration < currentDate,
        dayLeftExpiration: subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate,
        fine: returnDate < currentDate ? subscriptionExpiration <= currentDate ? 200 : 100 :
        0    
    }

    return res.status(200).json({
        status: true,
        data : data
    })


})


router.delete("/:id", (req, res) => {
    const { id } = req.params
    const user = users.find((each) => each.id == id)

    if (!user) { return res.status(404).json({ success: false, msg: "No user found" }) }

    const updateUser = users.filter((each) => {
        if (each.id != id) {
            return each
        }
    })

    return res.status(200).json({
        success: true,
        msg: updateUser
    })

})


module.exports = router