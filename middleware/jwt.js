const jwt=require('jsonwebtoken');
require('dotenv').config();

const jwtAuthMiddleware=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({error:"Token missing or incorrect format."});
    }
    const token=req.headers.authorization.split(" ")[1];

    try{
        const decodedData=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decodedData;                                 //now req.user holds the decoded jwt , i.e information of payload.
        next();
    }catch(err){
        console.log(err);
        res.status(401).json({error:"Invalid token."});
    }
}



const generateToken=function (payload){
    try{
        const tokengenerated= jwt.sign(payload,process.env.JWT_SECRET);
        return tokengenerated;
    }catch(err){
        throw err;
    }
}

module.exports={jwtAuthMiddleware,generateToken};