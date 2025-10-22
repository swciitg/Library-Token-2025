
const attachSocketIO = (io, userConnections) => {
  return (req, res, next) => {
    req.io = io;
    req.userConnections = userConnections;

    req.emitToUser = (roll_no, event, data) => {
      io.to(roll_no.toString()).emit(event, data);
    };
    
    req.isUserConnected = (roll_no) => {
      return userConnections.has(roll_no.toString());
    };
    
    next();
  };
};

export default attachSocketIO;
