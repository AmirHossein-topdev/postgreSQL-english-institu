// backend/src/controller/auth.controller.js
import { registerUser, loginUser } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    console.log("========================================");
    console.log("📥 REGISTER: Request received");
    console.log("📌 req.body:", req.body);
    console.log("========================================");

    const result = await registerUser(req.body);

    console.log("✅ REGISTER: Successful");
    console.log("========================================");

    res.status(201).json(result);
  } catch (err) {
    console.log("❌ REGISTER: Failed -", err.message);
    console.log("========================================");

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

export const login = async (req, res) => {
  console.log("========================================");
  console.log("📥 LOGIN: Request received in CONTROLLER");
  console.log("📌 req.body:", req.body);
  console.log("========================================");

  try {
    const { employeeCode, password, role } = req.body;

    // اعتبارسنجی ورودی
    if (!employeeCode) {
      console.log("❌ LOGIN: employeeCode is missing");
      return res.status(400).json({
        success: false,
        message: "شناسه ورود الزامی است",
      });
    }

    if (!password) {
      console.log("❌ LOGIN: password is missing");
      return res.status(400).json({
        success: false,
        message: "رمز عبور الزامی است",
      });
    }

    if (!role) {
      console.log("❌ LOGIN: role is missing");
      return res.status(400).json({
        success: false,
        message: "نقش کاربر الزامی است",
      });
    }

    console.log("📌 employeeCode:", employeeCode);
    console.log("📌 role from frontend:", role);
    console.log("📌 password length:", password?.length || 0);
    console.log("========================================");

    const result = await loginUser(employeeCode, password, role);

    console.log("✅ LOGIN: Successful in CONTROLLER");
    console.log("📌 User ID:", result.user?.id);
    console.log("📌 User Role:", result.user?.role);
    console.log("========================================");

    res.json(result);
  } catch (err) {
    console.log("❌ LOGIN: Failed in CONTROLLER");
    console.log("📌 Error message:", err.message);
    console.log("========================================");

    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
