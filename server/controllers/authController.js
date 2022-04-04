const bcrypt = require('bcrypt');
const pool = require("../model/db");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { email,password } = req.body;
    if (!email || !password)  {
        return res.status(400).json({ 'message': 'Email and password are required.' });
    }

    const foundUser = await pool.query("SELECT * FROM projekt.register WHERE email=$1",[email]);
    if (foundUser.rows.length===0) return res.sendStatus(401);//Unauthorized 
    // evaluate password 

    try {
        const match = await bcrypt.compare(password, foundUser.rows[0].password);
        if (match) {
            const roles = Object.values(foundUser.rows[0].roles).filter(Boolean);
            // create JWTs
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": foundUser.rows[0].email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "email": foundUser.rows[0].email },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // Saving refreshToken with current user
            if((await pool.query("SELECT * FROM projekt.token WHERE register_id=$1",[foundUser.rows[0].register_id])).rows.length===0)
            {
                await pool.query(
                    "INSERT INTO projekt.token (register_id,token) VALUES($1,$2) RETURNING *",
                    [foundUser.rows[0].register_id,refreshToken]
                );
            }
            else
            { 
                await pool.query(
                    "UPDATE projekt.token SET token = $2 WHERE register_id = $1 RETURNING *",
                    [foundUser.rows[0].register_id,refreshToken]
                );
            }
            
            res.cookie('jwt', refreshToken, { httpOnly: true,  maxAge: 24 * 60 * 60 * 1000 });
            res.json({ roles,accessToken});
        } else {
            res.sendStatus(401);
        }
    }catch (err) {
        res.status(500).json(err.message);
    } 

}

module.exports = { handleLogin };