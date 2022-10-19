import express, { Response,Request } from "express"
const jwt=require('jsonwebtoken')


const verifyToken = (req, res, next) => {

  const token = req.headers.authorization.split(' ')[1]

  if (!token) {
   return res.status(404).json({
        status:404,
        message:"Token not found"
    })
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) 
    return res.status(404).json({
      status:404,
        message:"Invalid token"
    })
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
 
  if (req.user.is_admin===true) {
    return res.status(403).json({
      status:403,
        message:"You aren't authorized"
    })
  }
     next()

}

const verifyAdmin = (req, res, next) => {
    if (req.user.is_admin===false) {
        return res.status(403).json({
          status:403,
            message:"You arenot authorized"
        })
    }
         next()
}

export {verifyToken,verifyUser,verifyAdmin}