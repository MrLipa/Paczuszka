const bcrypt = require('bcrypt');
const pool = require("../model/db");

const handleNewUser = async (req, res) => {
    const { firstname,lastname,email,password } = req.body;
    if (!firstname || !lastname || !email || !password) return res.status(400).json({ 'message': 'First, last names,email and password are required.' });

    const duplicate = await pool.query("SELECT * FROM projekt.register WHERE email=$1",[email]);
    if (duplicate.rows===[]) return res.sendStatus(409);

    try {
        if (!firstname || !lastname || !email || !password)  {
            return res.status(400).json({ 'message': 'First, last names,email and password are required.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newTodo = await pool.query(
            "INSERT INTO projekt.register (firstName,lastName,email,password,roles) VALUES($1,$2,$3,$4,$5) RETURNING *",
            [firstname,lastname,email,hashedPassword,{"Admin": 5150,"Editor": 1984,"User": 2001}]
        );

        res.status(201).json({ 'success': `New user ${email} created!` });
    }catch (err) {
        res.status(500).json(err.message);
    } 
}

module.exports = { handleNewUser };