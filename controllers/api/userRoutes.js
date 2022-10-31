const { User } = require("../../models");
const router = require("../homeRoutes");

//Create a new User - add a user to the database
router.post('/', async (req, res) => {
    try {
        const userData = await User.create(req.body);

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.status(200).json(userData);
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

//User login - create a logged-in session
router.post('/login', async (req, res) => {
    try {
        const userData = await User.findOne({
            where: { username: req.body.username }
        });
        if (!userData) {
            res.status(400).json({ message: 'Incorrect username or password, please try again'});
            return;
        }
        const passwordCheck = await userData.checkPassword(req.body.password);

        if (!passwordCheck) {
            res.status(400).json({ message: 'Incorrect username or password, please try again'});
            return;
        }

        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;

            res.json({ user: userData, message: 'Logged in! Congrats!!!'});
        });
    } catch (err) {
        res.status(400).json(err);
    }
});



//User logout - end the session
router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});
