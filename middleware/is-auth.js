const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    const authToken = req.get('Authorization');
    const token = authToken && authToken.split(' ')[1];
    if (authToken == null || authToken.toString() === "") {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    let decodedToken;
    try{
        decodedToken = jwt.verify(token,'SomeSuperSecreteSecret');
    }catch(err){
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    next();
}