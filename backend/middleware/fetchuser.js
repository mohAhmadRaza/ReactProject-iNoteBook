const jwt = require('jsonwebtoken');
const secret = "shhhhh";

const fetchuser = (req, res, next) => {

    const token = req.header('auth-token');
    if (!token){
        req.status(401).send({error: 'Pls, authenticate correctly!'})
    }
    
    try {
        const data = jwt.verify(token, secret);
        req.user = data.user;
        next();
    } catch (error) {
        req.status(401).send({error: 'Pls, authenticate correctly!'})
    }
    
}
module.exports = fetchuser;