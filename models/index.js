//setup model relationships

const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// user has many posts
User.hasMany(Post, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE'
});

// posts belongs to many users
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

// comments belongs to many users
Comment.belongsTo(User, {
    foreignKey: 'user_id',
});

// posts has many comments
Post.hasMany(Comment, {
    foreignKey: 'user_id'
});



module.exports = { Post, Comment, User };

