async function getSignUp(req,res) {
    res.render('signup');
}


async function signUp(req,res) {
    const { email, password } = req.body;
    if (!email || !password) {
    req.flash('error', 'Email and password are required.');
    return res.redirect('/signup');
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hash]);
    req.flash('success', 'Signup successful! Please log in.');
    res.redirect('/login');
  } catch (error) {
    console.error('Signup error:', error);
    req.flash('error', 'Signup failed. Email may already be in use.');
    res.redirect('/signup');
  }
}


export {getSignUp, signUp}