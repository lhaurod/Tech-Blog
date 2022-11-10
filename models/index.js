const User = require(`./User.js`);
const Post = require(`./Post.js`);
const Comment = require(`./Comment.js`);

// define associations

// User-Post relationship
User.hasMany(Post, {
  foreignKey: 'creator_id',
  onDelete: 'CASCADE',
});
Post.belongsTo(User, {
  foreignKey: 'creator_id',
});

// User-Comment relationship
User.hasMany(Comment, {
  foreignKey: 'creator_id',
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, {
  foreignKey: 'creator_id',
});

// Post-Comment relationship
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  onDelete: 'CASCADE',
});
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
});

module.exports = {
  User,
  Post,
  Comment
}