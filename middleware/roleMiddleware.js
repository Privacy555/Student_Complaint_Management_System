const roleMiddleware=(roleToBeAllowed)=>{
    return function(req,res,next){
        const data=req.user;
        if(!data || data.role!==roleToBeAllowed){
            return res.status(403).json({error:"Access Denied: Insufficient permissions."});
        }
        next();
    };
};

module.exports=roleMiddleware;