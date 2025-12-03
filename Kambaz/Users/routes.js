import UsersDao from "./dao.js";
import jwt from 'jsonwebtoken';
import { authenticate } from './middleware.js';
let currentUser = null;
export default function UserRoutes(app) {
    const dao = UsersDao();
    const createUser = async (req, res) => {
        const user = await dao.createUser(req.body);
        res.json(user);
    };
    const deleteUser = async (req, res) => {
        const status = await dao.deleteUser(req.params.userId);
        res.json(status);
    };
    const findAllUsers = async (req, res) => {
        const { role, name } = req.query;
        if (role) {
            const users = await dao.findUsersByRole(role);
            res.json(users);
            return;
        }
        if (name) {
            const users = await dao.findUsersByPartialName(name);
            res.json(users);
            return;
        }
        const users = await dao.findAllUsers();
        res.json(users);
    };
    const findUserById = async (req, res) => {
        const user = await dao.findUserById(req.params.userId);
        res.json(user);
    };
    const updateUser = async (req, res) => {
        const userId = req.params.userId;
        const userUpdates = req.body;
        await dao.updateUser(userId, userUpdates);
        const currentUser = req.session["currentUser"];
        if (currentUser && currentUser._id === userId) {
            req.session["currentUser"] = { ...currentUser, ...userUpdates };
        }
        res.json(currentUser);
    };

    const signup = async (req, res) => {
        try {
            console.log("🔐 SIGNUP:", req.body.username, "Role:", req.body.role);

            const user = await dao.findUserByUsername(req.body.username);
            if (user) {
                return res.status(400).json({ message: "Username already in use" });
            }

            const currentUser = await dao.createUser(req.body);

            const token = jwt.sign(
                {
                    userId: currentUser._id,
                    username: currentUser.username,
                    role: currentUser.role
                },
                process.env.JWT_SECRET || 'your-secret-key',
                { expiresIn: '24h' }
            );

            console.log("✅ User created with token");
            res.json({ user: currentUser, token });
        } catch (error) {
            console.error("❌ Signup error:", error);
            res.status(500).json({ message: "Signup failed" });
        }
    };

    const signin = async (req, res) => {
        try {
            console.log("🔐 SIGNIN:", req.body.username);

            const { username, password } = req.body;
            const currentUser = await dao.findUserByCredentials(username, password);

            if (currentUser) {
                const token = jwt.sign(
                    {
                        userId: currentUser._id,
                        username: currentUser.username,
                        role: currentUser.role
                    },
                    process.env.JWT_SECRET || 'your-secret-key',
                    { expiresIn: '24h' }
                );

                console.log("✅ Token created for:", currentUser.username);
                res.json({ user: currentUser, token });
            } else {
                console.log("❌ Invalid credentials");
                res.status(401).json({ message: "Unable to login. Try again later." });
            }
        } catch (error) {
            console.error("❌ Signin error:", error);
            res.status(500).json({ message: "Signin failed" });
        }
    };

    const signout = (req, res) => {
        req.session.destroy();
        res.sendStatus(200);
    };
    const profile = (req, res) => {
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            res.sendStatus(401);
            return; ƒ
        }
        res.json(currentUser);
    };
    app.post("/api/users", createUser);
    app.get("/api/users", findAllUsers);
    app.get("/api/users/:userId", findUserById);
    app.put("/api/users/:userId", updateUser);
    app.delete("/api/users/:userId", deleteUser);
    app.post("/api/users/signup", signup);
    app.post("/api/users/signin", signin);
    app.post("/api/users/signout", signout);
    app.post("/api/users/profile", authenticate, profile);
}
