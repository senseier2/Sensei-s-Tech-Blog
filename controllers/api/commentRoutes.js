const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Get all comments
router.get('/', (req, res) => {
    Comment.findAll({})
    .then(commentData => res.json(commentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err)
    });
});

// Get comment with request id
router.get('/:id', (req, res) => {
    Comment.findAll({
        where: {
            id: req.params.id
        }
    })
    .then(commentData => res.json(commentData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// Post a Comment
router.post('/', async (req, res) => {
    try {
        const postComment = await Comment.create({
            ...req.body,
            user_id: req.session.user_id,
        });
        res.json(postComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

//Delete Comment if it exists
router.delete('/:id', withAuth, async (req, res) => {
    try{
        const deleteComment = await Comment.destroy({
            where: {
                id: req.params.id,
                user_id: req.session.user_id
            }
        });
        if (!deleteComment) {
            res.status(404).json({ message: 'There is no comment with that ID!'});
            return;
        }
        res.status(200).json(deleteComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;