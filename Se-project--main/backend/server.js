const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
const studentRoutes = require("./routes/studentRoutes");
app.use("/api/student", studentRoutes);
const leaveRoutes = require("./routes/leaveRoutes");
app.use("/api/leave", leaveRoutes);
const teacherRoutes = require("./routes/teacherRoutes");
app.use("/api/teacher", teacherRoutes);
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/admin", adminRoutes);




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
