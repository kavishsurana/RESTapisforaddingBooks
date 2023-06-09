const express = require('express')
const User = require('../models/User')
const Auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users' , async(req,res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user , token})
    } catch (err) {
        res.status(400).send(err)
    }
})

router.post('/users/login', async(req,res) => {

    try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateAuthToken()
    res.send({user,token})

    } catch (err) {
        res.status(400).send(err)
    }
    
})


router.post('/users/logout' , Auth , async(req,res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
})


router.post('/users/logoutAll' , Auth , async(req,res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }catch(err){
        res.status(500).send()
    }
   
})


module.exports = router
