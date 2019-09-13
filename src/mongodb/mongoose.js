const mongoose = require('mongoose')

mongoose.Promise=global.Promise;
//Connection to DB - MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Survey-list',{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
})
