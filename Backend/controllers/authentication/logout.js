const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false, // set true in production
      sameSite: "Lax",
    });

    res.status(200).send({ message: "Logout successful, token cleared." });
  } catch (error) {
    res.status(500).send({ message: "Error during logout", error: error.message });
  }
};

module.exports = { logout };
