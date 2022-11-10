const sequelize = require(`../config/connection`);
const { User, Post, Comment } = require(`../models`);

const userData = require(`./userData.json`);
const postData = require(`./postData.json`);
const commentData = require(`./commentData.json`);

const seedUsers = () => User.bulkCreate(userData, {
  individualHooks: true,
  returning: true
})
const seedPosts = () => Post.bulkCreate(postData);
const seedComments = () => Comment.bulkCreate(commentData);

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('\n----- DATABASE SYNCED -----\n');

    await seedUsers();
    console.log('\n----- USERS SEEDED -----\n');

    await seedPosts();
    console.log('\n----- POSTS SEEDED -----\n');

    await seedComments();
    console.log('\n----- COMMENTS SEEDED -----\n');

    process.exit(0);
  } catch (err) {
    console.log(err);
  }
}

seedDatabase();