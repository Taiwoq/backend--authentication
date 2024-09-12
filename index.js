const express = require("express")

const app = express()

const port = 5050

const connectDb = require("./database/db")
connectDb()

const userRoute = require("./routes/userRoute")

// this allows to use json format
app.use(express.json())
// to use url encoded values instead of json
app.use(express.urlencoded({extended : true}))


app.get("/api", (request,response) => {
    response.json(
        {message:"welcome to the server....."}
    )
})

app.use("/api/users", userRoute)












app.listen(port, () => {
    console.log("server connected successfully....");
    
})