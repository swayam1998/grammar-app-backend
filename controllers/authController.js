const jwt = require('jsonwebtoken');

// I have Hardcoded the credentials to avoid using a database for the test project
const ADMIN_USER = {
    username: 'admin',
    password: 'admin'
};

const login = (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        const token = jwt.sign(
            { username: ADMIN_USER.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        return res.json({ success: true, token });
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
};

module.exports = { login };