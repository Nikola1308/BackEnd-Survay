module.exports = {
    googleOAuth: (req, res, next) => {
        // Generate token
        console.log('got here');
        console.log(req.user)
        const token = signToken(req.user);
        res.status(200).json({ token}); 
      }
}