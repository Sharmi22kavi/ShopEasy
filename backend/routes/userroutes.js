const express = require("express");
const router = express.Router();
const pool = require("../config/postgres");

// Register
router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const result = await pool.query(
            "INSERT INTO users(name,email,password) VALUES($1,$2,$3) RETURNING *",
            [name, email, password]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

// Login
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1 AND password=$2",
            [email, password]
        );

        if (result.rows.length === 0) {

            return res.status(401).json({
                message: "Invalid Login"
            });

        }

        res.json(result.rows[0]);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });

    }

});

router.put("/update/:id", async (req, res) => {

    const { id } = req.params;
    const { name } = req.body;

    const result = await pool.query(
        "UPDATE users SET name=$1 WHERE id=$2 RETURNING *",
        [name, id]
    );

    res.json(result.rows[0]);
});

module.exports = router;