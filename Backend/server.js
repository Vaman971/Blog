const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const path = require("path")

const IndexRoute = require("./Routers/index")
const connectDatabase = require("./Helpers/database/connectDatabase")
const customErrorHandler = require("./Middlewares/Errors/customErrorHandler")

dotenv.config()

connectDatabase()

const app = express() ;

app.use(express.json())
app.use(cors())

app.use("/", IndexRoute);

// Serve userPhotos statically
app.use('/userPhotos', express.static(path.join(__dirname, 'public/userPhotos')));

// Serve storyImages statically
app.use('/storyImages', express.static(path.join(__dirname, 'public/storyImages')));

// Serve static files from the React frontend build folder
app.use(express.static(path.join(__dirname, "../Frontend/build")));

// For any route not handled by API, serve the React index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../Frontend/build", "index.html"));
});

app.use(customErrorHandler)

const PORT = process.env.PORT || 5000 ;


const server = app.listen(PORT,()=>{

    console.log(`Server running on port  ${PORT} : ${process.env.NODE_ENV}`)

})

process.on("unhandledRejection",(err , promise) =>{
    console.log(`Logged Error : ${err}`)

    server.close(()=>process.exit(1))
})