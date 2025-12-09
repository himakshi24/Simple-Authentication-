import dbConnect from '../../../lib/db';
import User from '../../../models/User';
import bcrypt from 'bcryptjs';
// Make sure these utility paths are correct:
import { signToken, setTokenCookie } from '../../../utils/auth'; 

export default async function handler(req, res) {
    // 1. Method Check (Fail fast)
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;

    // 2. Input Validation (Fail fast)
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // 3. Database Connection Check
        // CRITICAL: A common 500 error is here if 'dbConnect' or its dependencies fail.
        await dbConnect(); 
        
        const lowercasedEmail = email.toLowerCase();

        // 4. Find User
        const user = await User.findOne({ email: lowercasedEmail }).select('+password'); // Ensure password field is selected if not by default

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 5. Password Comparison
        // CRITICAL: Ensure 'user.password' exists (check your Mongoose model 'select' option)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 6. Token Generation and Cookie Setting
        const token = signToken({ 
            id: user._id, 
            email: user.email, 
            name: user.name 
        });

        // CRITICAL: This is where cookie setting happens. Ensure 'setTokenCookie' handles the response object (res).
        setTokenCookie(res, token); 

        // 7. Success Response
        // Remove sensitive data (like the password field) from the user object before sending, if needed.
        return res.status(200).json({ 
            message: 'Login successful', 
            user: { id: user._id, email: user.email, name: user.name } 
        });

    } catch (err) {
        // 8. Server Error Handling
        console.error("Login API Error:", err);
        // Do not expose sensitive error details to the client
        return res.status(500).json({ message: 'An internal server error occurred during login.' });
    }
}

// NOTE: Ensure your User model schema defines the 'password' field with 'select: false' 
// if you needed to use .select('+password') above, or ensure it's selectable by default.
