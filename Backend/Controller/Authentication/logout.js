// Logout Controller
const logout = async (req, res) => {
  try {
    // Clear the 'token' cookie
    res.clearCookie('token', {
      httpOnly: true,   // Same as in login for consistency
      secure: false,    // Set to true in production with HTTPS
    });

    res.status(200).send({ message: 'Logout successful, token removed from cookies.' });
  } catch (error) {
    res.status(500).send({ message: 'Error during logout', error: error.message });
  }
};

module.exports = { logout };
