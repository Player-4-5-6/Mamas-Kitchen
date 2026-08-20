import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc  Register new customer
// @route POST /api/auth/register
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, phone });
    const token = generateToken(user._id, user.role);

    res.status(201).json({ user: user.toSafeObject(), token });
  } catch (error) {
    next(error);
  }
};

// @desc  Login
// @route POST /api/auth/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id, user.role);
    res.json({ user: user.toSafeObject(), token });
  } catch (error) {
    next(error);
  }
};

// @desc  Get logged in user profile
// @route GET /api/auth/me
export const getMe = async (req, res, next) => {
  try {
    res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
  } catch (error) {
    next(error);
  }
};

// @desc  Add address to profile
// @route POST /api/auth/addresses
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { label, street, area, city, phone, isDefault } = req.body;

    if (isDefault) {
      user.addresses.forEach((a) => (a.isDefault = false));
    }

    user.addresses.push({ label, street, area, city, phone, isDefault });
    await user.save();

    res.status(201).json({ addresses: user.addresses });
  } catch (error) {
    next(error);
  }
};
