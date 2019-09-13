const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//Schema for new User
const NewUser = new Schema({
    id:{
        type:String
    },
    email:{
        type:String,
        lowercase:true
    }
}
//!!! in case we need to hide __v ,{versionKey: false}
 )

module.exports.NewUser = mongoose.model('NewUser',NewUser)


//Schema for new Survey
const NewSurvey = new Schema({
    titleForNewSurvey:{
        type:String,
        required:true
    },
    descriptionForNewSurvey:{
        type:String,
        required:true
    },
    questions : [{
        type:Schema.Types.ObjectId,
        ref:'NewQuestion'
    }]
})

//Pre Hook for deleting Survay by id , questions from that survay and anwers
NewSurvey.pre('remove', async function(next){
    try{
       let answersForDelete =await this.model('NewQuestion').find({_id:{$in: this.questions }}).exec()

        let answersArrForDeleted =await answersForDelete.map((answerForDelet)=>{
            return answerForDelet.answers
        })
        let newArrForDeleting = [];

        for(let i = 0; i < answersArrForDeleted.length; i++)
        {
            newArrForDeleting = newArrForDeleting.concat(answersArrForDeleted[i]);
        }
    
       let answerDeleted =await this.model('newAnswer').deleteMany({_id:{$in:newArrForDeleting}}).exec()
       let questionDeleted=await this.model('NewQuestion').deleteMany({_id:{$in: this.questions }}).exec()       
       
        next()
    }catch(err){
        next(err)
    }
})


module.exports.NewSurvey = mongoose.model('NewSurvey',NewSurvey)

//Schema forn new Question
const NewQuestion = new Schema({
    questionTitle:{
        type:String
    },
    answers:[{
        type:Schema.Types.ObjectId,
        ref:'newAnswer'
    }]
})

//Pre hook for Questiong By Id and all answers from that question 
NewQuestion.pre('remove', async function(next){
    try{
        await this.model('newAnswer').deleteMany({_id:{$in: this.answers }})
        next()
    }catch(err){
        next(err)
    }
})


module.exports.NewQuestion = mongoose.model('NewQuestion',NewQuestion)

//Schema for new Answer
const newAnswer = new Schema({
    answerTitle:{
        type:String
    },
    answerDecision:{
        type:Boolean,
        default:false
    }
})

module.exports.newAnswer = mongoose.model('newAnswer',newAnswer)

