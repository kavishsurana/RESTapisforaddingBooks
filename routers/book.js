const router = require("express").Router();
const Auth = require('../middleware/auth')
const Book = require('../models/books');

router.get('/' , async(req,res) => {
    try {
        const books = await Book.find({})
        res.status(200).send(books)
    } catch (err) {
        res.status(400).send(err)
    }
    
})


router.post("/add" ,Auth ,  async(req,res) => {
    const { author, title, price , quantity } = req.body
    try{
        const newBook = await Book.create({
            author, 
            title,
            price,
            quantity
        });
        console.log(newBook)
        res.status(200).send(newBook);
    }catch(err){
       res.status(400).send()
       console.log(err)
    }
})


router.get("/:id" , async(req,res) => {
   try {
    const book = await Book.findOne({_id:req.params.id})

    if(!book){
        res.status(400).send({error : "Book not found"})
    }
    
    res.status(200).send(book);
   } catch (err) {
    res.status(400).send(err)
   }
})

router.patch("/update/:id" ,Auth ,  async(req,res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['title' , 'price' , 'quantity'];

    const isValidUpdate = updates.every((update) => 
        allowUpdates.includes(update)
    )

    if(!isValidUpdate){
        res.status(400).send({error : "Invalid Update"})
    }

    try {
        const book = await Book.findOne({_id:req.params.id})

        if(!book){
            res.status(404).send({error : "Book not found"})
        }

        updates.forEach((update) => book[update] = req.body[update])
        await book.save();
        res.send(book);
    } catch (err) {
        res.status(400).send()
    }
})


router.delete("/delete/:id" , Auth , async(req,res) => {


    try {
        const deleteBook = await Book.findOneAndDelete({_id:req.params.id})

        if(!deleteBook){
        res.status(400).send()
    }

        res.send(deleteBook)
        
    } catch (err) {
        res.status(400).send()
    }

    
})


module.exports = router
