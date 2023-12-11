const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const {
    create,
    find,
    update
} = require('../adapters/postgres')


// JWT Secret Key
const JWT_SECRET = 'your_secret_key';


exports.register = async (req,res,next) => {
    try {
        const { name, email, password, role } = req.body;
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
    
        // Insert user into the database
        await create('users', {name, email, password:hashedPassword, role})

        res.json({ success: 'success!' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


exports.login= async (req,res,next) => {
    try {
        const { email, password } = req.body;
    
        // Check if user exists
        const result = await find('users', {email})
        const user = result[0];
        if (!user) {
          return res.status(401).json({ error: 'Invalid Credentials' });
        }
    
        // Compare passwords
        const passwordMatch = await bcrypt.compare(password, user.password);
    
        if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid Credentials' });
        }
    
        // Generate JWT
        const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET);
    
        res.json({ token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


exports.changePassword= async (req,res,next) => {
    try {
        const { resetToken, newPassword } = req.body;
    
        // Check if the reset token is valid
        const result = await find('users', {reset_token: resetToken})
        const user = result[0];
    
        if (!user || Date.now() > user.reset_token_expiry) {
          return res.status(400).json({ error: 'Invalid or expired reset token' });
        }
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
    
        // Update the user's password and clear the reset token
        await update('users',{password: hashedPassword},  {id: user.id})
    
        res.json({ message: 'Password changed successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}


exports.forgotPassword= async (req,res,next) => {
    try {
        const { email } = req.body;
    
        // Check if user exists
        const result = await find('users',{email})
        const user = result[0];
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
    
        // Generate a unique token for password reset
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpiry = new Date(Date.now() + 3600000); // Current time plus 1 hour
        // Convert to ISO string (includes timezone information)
        const resetExpiryISO = resetExpiry.toISOString();
  
        // Store the token and its expiry in the database
        await update('users',{reset_token: resetToken, reset_token_expiry: resetExpiryISO},  {id: user.id})
    
        res.json({ resetToken });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}