const sequelize = require('../config/connection');
const { User, Comment, Post } = require('../models');

const postData = require('./postSeed.json');
const commentData = require('./commentSeed.json');
const userData = require('./userSeed.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true
    });

    for (const post of postData) {
        await Post.create({
            ...post,
            user_id: user[Math.floor(Math.random() * user.length)].id,
        });
    }

    const comments = await Comment.bulkCreate(commentData, {
        returning: true,
    });
    process.exit(0);
};

seedDatabase();
