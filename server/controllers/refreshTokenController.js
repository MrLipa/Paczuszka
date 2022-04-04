const jwt = require('jsonwebtoken');
const pool = require("../model/db");
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;


    const foundUser = await pool.query("SELECT * FROM projekt.register JOIN projekt.token USING (register_id) WHERE token=$1",[refreshToken]);
    if (foundUser.rows.length===0) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.rows[0].email !== decoded.email) return res.sendStatus(403);
            const roles = Object.values(foundUser.rows[0].roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "email": decoded.email,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }