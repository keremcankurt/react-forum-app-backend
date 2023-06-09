const sendJwtToClient = (user, res) => {
    const token = user.generateJwtFromUser();
    const { JWT_COOKIE, NODE_ENV } = process.env;
    return res
      .cookie("access_token", token, {
        secure: false,
        expires: new Date(Date.now() + parseInt(JWT_COOKIE) * 1000),
      })
      .status(200)
      .json({
        fullName: user.name + " " + user.surname,
        profilePicture: user.profilePicture,
        
      })
  };
  
  const getAccessTokenFromHeader = (req) => {
    return req.headers["authorization"];
  };
  module.exports = {
    sendJwtToClient,
    getAccessTokenFromHeader,
  };
  
