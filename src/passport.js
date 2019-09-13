const GooglePlusTokenStrategy = require('passport-google-plus-token')
const passport = require('passport')
const surveyList = require('./models/SurveyList')


passport.use("googleToken",new GooglePlusTokenStrategy({
    clientID:'679948799018-5u26v86nvio9eqpsmfq6drgf1b88lug3.apps.googleusercontent.com',
    clientSecret:'iSpFkkyjemh8yeY61hOSnyx2'
},async(accesToken,refreshToken,profile,done)=>{
    try{
    const existingUser = await surveyList.NewUser.findOne({ 'id':profile.id })
    if(existingUser){
        return done(null,existingUser)
    }
    const newUser = new surveyList.NewUser({
        id:profile.id,
        email:profile.emails[0].value
    })
    await newUser.save()
    done(null,newUser)
    }catch(error){
        done(error,false,error.message)
    }
   
}))