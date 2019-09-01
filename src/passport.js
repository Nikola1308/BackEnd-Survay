const GooglePlusTokenStrategy = require('passport-google-plus-token')
const passport = require('passport')
const survayList = require('./models/SurvayList')


passport.use("googleToken",new GooglePlusTokenStrategy({
    clientID:'679948799018-5u26v86nvio9eqpsmfq6drgf1b88lug3.apps.googleusercontent.com',
    clientSecret:'iSpFkkyjemh8yeY61hOSnyx2'
},async(accesToken,refreshToken,profile,done)=>{
    try{
   //     console.log('acceTokes',accesToken)
   // console.log('refreshToken',refreshToken)
   // console.log('profirle',profile)

    //const id = profile.id
   // console.log(id)
    const existingUser = await survayList.NewUser.findOne({ 'id':profile.id })
   // console.log(existingUser)
    if(existingUser){
        console.log('User already exists')
        return done(null,existingUser)
    }
    console.log('User dosnt not exist')
    const newUser = new survayList.NewUser({
        id:profile.id,
        email:profile.emails[0].value
    })
    await newUser.save()
    done(null,newUser)
    }catch(error){
        done(error,false,error.message)
    }
   
}))