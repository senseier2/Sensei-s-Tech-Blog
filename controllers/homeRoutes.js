const router = require('express').Router();
const { Comment, Post, User } = require('../models');
const withAuth = require('../utils/auth');


// Get all Posts and userdata
router.get('/', async (req, res) => {
    try {
        const postData = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const posts = postData.map((post) => post.get({ plain: true }));

        res.render('homee', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get a post with comments and user
router.get('/post/:id', async (req, res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                { model: User, attributes: ['username'] },
                { model: Comment, include: [User] }
            ],
        });
        const post = postData.get({ plain: true });
        res.render('post', {
            ...post, 
            logged_in: req.session.logged_in 
        });
    } catch (err) {
        res.status(500).json(err);
    }
})


//Get Dashboard Data
router.get('/dashboard', withAuth, async (req, res) => {
    try {
       const userData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ['password'] },
        include: [{ model: Post }],
       });

       const user = userData.get({ plain: true });

       res.render('dashboard', {
        ...user,
        logged_in: true
       });
    } catch (err) {
        res.status(500).json(err);
    }
});


// Get login page
router.get('login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard'); //Goes to dashboard if logged in
        return;
    }
    res.render('login'); // Else return to Login
});

// Get Sign in page

router.get('signup', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard'); //Goes to dashboard if logged in
        return;
    }
    res.render('signup'); // Else return to Signup
});



module.exports = router;