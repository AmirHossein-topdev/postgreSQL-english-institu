// backend\src\controller\auth.controller.js
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { employeeCode, password } = req.body;
    const result = await loginUser(employeeCode, password);
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
