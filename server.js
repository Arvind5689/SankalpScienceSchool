const express = require("express");
const mongoose = require("mongoose");
const Student = require("./models/student.js");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("views"));

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/schoolDB")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Register API
app.post("/register", async (req, res) => {
  try {
    const {
      studentName,
      fatherName,
      motherName,
      genderClass: genderSelect,
      class: className,
      emailOrRoll,
      phone,
      password
    } = req.body;

    // Check duplicate
    const exists = await Student.findOne({ emailOrRoll });
    if (exists) {
      return res.send("❌ Email / Roll already registered");
    }

    // Save data
    const student = new Student({
      studentName,
      fatherName,
      motherName,
      genderClass: genderSelect,
      className,
      emailOrRoll,
      phone,
      password
    });

    await student.save();
    res.send("✅ Registration Successful");

  } catch (err) {
    res.send("❌ Error occurred");
  }
});
// Login API
app.post("/login", async (req, res) => {
  console.log("BODY:", req.body); // check what data is coming
  try {
    const { emailOrRoll, password } = req.body;
    console.log("Email/Roll:", emailOrRoll, "Password:", password);

    const user = await Student.findOne({ emailOrRoll });
    if (!user) return res.send("User not found ❌");

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match?", match);
    if (!match) return res.send("Wrong password ❌");

    res.send("Login successful ✅");
  } catch (err) {
    console.log("LOGIN ERROR:", err);
    res.send("Login error ❌");
  }
});


// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
