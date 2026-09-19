const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

require("./jobs/dailyTask");

const Student = require("./models/Student");
const { getRandomAdvice } = require("./services/externalApi");
const cacheMiddleware = require("./middleware/cache");

const app = express();
const PORT = 3000;


// =====================================
// TASK 7 - RATE LIMITING
// =====================================

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later."
    }
});


// =====================================
// MIDDLEWARE
// =====================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

let message = null;


// =====================================
// TASK 6 - JWT AUTHENTICATION
// =====================================

function authenticateToken(req, res, next) {

    const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please login first."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {

        if (error) {
            return res.status(403).json({
                message: "Invalid or expired token."
            });
        }

        req.user = user;

        next();
    });
}


// =====================================
// HOME PAGE
// =====================================

app.get("/", async (req, res) => {

    try {

        const students = await Student
            .find()
            .select("-password");

        res.render("index", {
            message: message,
            users: students
        });

        message = null;

    } catch (error) {

        console.error(error);

        res.status(500).send("Error loading students.");
    }
});


// =====================================
// TASK 6 - STUDENT REGISTRATION
// =====================================

app.post("/submit", async (req, res) => {

    const { name, email, age, password } = req.body;

    if (!name || !email || !age || !password) {

        message = "Please fill in all fields.";

        return res.redirect("/");
    }

    if (name.length < 3) {

        message = "Name must contain at least 3 characters.";

        return res.redirect("/");
    }

    if (age < 18 || age > 100) {

        message = "Age must be between 18 and 100.";

        return res.redirect("/");
    }

    if (password.length < 6) {

        message = "Password must contain at least 6 characters.";

        return res.redirect("/");
    }

    try {

        const existingStudent = await Student.findOne({ email });

        if (existingStudent) {

            message = "Email is already registered.";

            return res.redirect("/");
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const student = new Student({
            name: name,
            email: email,
            age: age,
            password: hashedPassword
        });

        await student.save();

        message = "Registration successful!";

        res.redirect("/");

    } catch (error) {

        console.error(error);

        message = "Registration failed.";

        res.redirect("/");
    }
});


// =====================================
// TASK 6 - LOGIN
// =====================================

app.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const student = await Student.findOne({ email });

        if (!student) {

            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            student.password
        );

        if (!passwordMatch) {

            return res.status(401).json({
                message: "Invalid email or password."
            });
        }

        const token = jwt.sign(
            {
                id: student._id,
                email: student.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token: token
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Login failed."
        });
    }
});


// =====================================
// TASK 7 - EXTERNAL API
// =====================================

app.get("/api/advice", apiLimiter, async (req, res) => {

    try {

        const result = await getRandomAdvice();

        if (!result.success) {

            return res.status(503).json({
                message: result.advice
            });
        }

        res.json({
            message: "Advice fetched successfully",
            advice: result.advice
        });

    } catch (error) {

        console.error("Advice route error:", error);

        res.status(500).json({
            message: "Unable to process external API request."
        });
    }
});


// =====================================
// TASK 5 + TASK 6
// GET ALL STUDENTS
// =====================================

app.get("/api/students", cacheMiddleware, async (req, res) => {
    try {

        const students = await Student
            .find()
            .select("-password");

        res.json(students);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Error fetching students."
        });
    }
});


// =====================================
// TASK 6
// ADD STUDENT
// =====================================

app.post(
    "/api/students",
    authenticateToken,
    async (req, res) => {

        const {
            name,
            email,
            course,
            age,
            password
        } = req.body;

        if (!name || !email || !course) {

            return res.status(400).json({
                message: "Name, email and course are required."
            });
        }

        try {

            const existingStudent =
                await Student.findOne({ email });

            if (existingStudent) {

                return res.status(400).json({
                    message: "Email already exists."
                });
            }

            const hashedPassword = await bcrypt.hash(
                password || "default123",
                10
            );

            const newStudent = await Student.create({
                name: name,
                email: email,
                course: course,
                age: age,
                password: hashedPassword
            });

            const studentResponse =
                newStudent.toObject();

            delete studentResponse.password;

            res.status(201).json({
                message: "Student added successfully",
                student: studentResponse
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Error adding student."
            });
        }
    }
);


// =====================================
// TASK 6
// UPDATE STUDENT
// =====================================

app.put(
    "/api/students/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const {
                name,
                email,
                course,
                age
            } = req.body;

            const student =
                await Student.findById(req.params.id);

            if (!student) {

                return res.status(404).json({
                    message: "Student not found."
                });
            }

            if (name) {
                student.name = name;
            }

            if (email) {
                student.email = email;
            }

            if (course) {
                student.course = course;
            }

            if (age) {
                student.age = age;
            }

            await student.save();

            const studentResponse =
                student.toObject();

            delete studentResponse.password;

            res.json({
                message: "Student updated successfully",
                student: studentResponse
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Error updating student."
            });
        }
    }
);


// =====================================
// TASK 6
// DELETE STUDENT
// =====================================

app.delete(
    "/api/students/:id",
    authenticateToken,
    async (req, res) => {

        try {

            const student =
                await Student.findById(req.params.id);

            if (!student) {

                return res.status(404).json({
                    message: "Student not found."
                });
            }

            await Student.findByIdAndDelete(
                req.params.id
            );

            const studentResponse =
                student.toObject();

            delete studentResponse.password;

            res.json({
                message: "Student deleted successfully",
                student: studentResponse
            });

        } catch (error) {

            console.error(error);

            res.status(500).json({
                message: "Error deleting student."
            });
        }
    }
);


// =====================================
// TASK 7 - OAUTH CONCEPT DEMO
// =====================================

app.get("/auth/oauth-demo", (req, res) => {

    res.json({

        message: "OAuth authorization flow demonstration",

        steps: [
            "1. User requests authorization",
            "2. User is redirected to an external authorization provider",
            "3. Provider authenticates the user",
            "4. Provider returns an authorization code",
            "5. Server exchanges the code for an access token",
            "6. Server uses the access token to access permitted resources"
        ]

    });
});


// =====================================
// TASK 7 - 404 HANDLER
// =====================================

app.use((req, res) => {

    res.status(404).json({
        message: "Route not found."
    });
});


// =====================================
// TASK 7 - GLOBAL ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {

    console.error("Server Error:", err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: "Something went wrong on the server."
    });
});


// =====================================
// MONGODB CONNECTION
// =====================================

mongoose.connect(process.env.MONGO_URI)

    .then(() => {

        console.log(
            "MongoDB connected successfully"
        );

        app.listen(PORT, () => {

            console.log(
                `Server running at http://localhost:${PORT}`
            );

        });

    })

    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error
        );

    });