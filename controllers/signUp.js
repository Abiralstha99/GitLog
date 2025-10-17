import bcrypt from "bcrypt";
import prisma from "../prisma/prismaClient.js";

async function getSignUp(req, res) {
  res.render("signup");
}

async function signUp(req, res) {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      req.flash("error", "Username and password are required.");
      return res.redirect("/signup");
    }

    const uname = username.trim();

    const existing = await prisma.users.findFirst({
      where: {
        username: {
          equals: uname,
          mode: "insensitive",
        },
      },
    });

    if (existing) {
      req.flash("error", "Username already taken. Please choose another.");
      return res.redirect("/signup");
    }

    const hash = await bcrypt.hash(password, 10);
    await prisma.users.create({
      data: {
        username: uname,
        password: hash,
      },
    });

    req.flash("success", "Signup successful! Please log in.");
    res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);

    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      req.flash("error", "Username already taken. Please choose another.");
      return res.redirect("/signup");
    }

    req.flash("error", "Signup failed. Please try again.");
    res.redirect("/signup");
  }
}

export { getSignUp, signUp };
