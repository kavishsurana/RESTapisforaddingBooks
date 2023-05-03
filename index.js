const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const router = require('./routers/book')
const bodyParser = require('body-parser')

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const uri = process.env.MONGO_URL;
mongoose.connect(uri, {});

app.use(express.json())
app.use("/api/books",router)


const PORT=process.env.PORT

app.listen(PORT || 5000 , () => {
    console.log(`Server is listening on port ${PORT}`)
})

