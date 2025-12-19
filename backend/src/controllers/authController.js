import { registerUser, loginUser } from "../utils/authService.js";
import { AuthenticationError } from "../errors/AuthenticationError.js";

// Register a new user
const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return next(error);
  }
};

// Login user and generate a JWT token
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    if (result.token) {
      return res.json(result);
    }
    
    throw new AuthenticationError("Invalid credentials");
  } catch (error) {
    return next(error);
  }
};

export { register, login };