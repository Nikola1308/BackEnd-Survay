const mongoose = require('mongoose')

//Connection to DB - MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Survay-list',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})
