const pool = require("../model/db");

const handleLogout = async (req, res) => {
    // On client, also delete the accessToken

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); //No content
    const refreshToken = cookies.jwt;

    // Is refreshToken in db?
    const foundUser = await pool.query("SELECT * FROM projekt.register JOIN projekt.token USING (register_id) WHERE token=$1",[refreshToken]);
    if (foundUser.rows.length===0) {
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        return res.sendStatus(204);
    }

    // Delete refreshToken in db
    await pool.query("DELETE FROM projekt.token WHERE token=$1",[foundUser.rows[0].refreshToken]);

    res.clearCookie('jwt', { httpOnly: true});
    res.sendStatus(204);
}

module.exports = { handleLogout }