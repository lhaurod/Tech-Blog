const router = require(`express`).Router();
const withAuth = require(`../../utils/auth`);
const { Comment, Post, User } = require(`../../models`)

// ROUTES GO HERE
router.get('/dashboard', async (req, res) => {
  res.json({ "msg": "/dashboard route response" })
});

router.post(`/submit`, withAuth, async (req, res) => {
  console.log(`api/post/submit ROUTE SLAPPED`)
  console.log(req.body)
  console.log(req.session)
  try {
    const postTitleTaken = await Post.findOne({ where: { post_title: req.body.post_title } });

    if (postTitleTaken) {
      res
        .status(409)
        .json({ message: 'The post title entered is already in use. Please enter a different title for your post.' });
      return;
    }

    const newPost = await Post.create({
      creator_id: req.session.user_id,
      post_title: req.body.post_title,
      post_body: req.body.post_body,
    });

    console.log(newPost);
    const newPostFormatted = await newPost.get({ plain: true });
    console.log(newPostFormatted);
    res.status(201).json({ message: `Post successfully saved!` })

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `An error occured. Please contact support.` })
  }
});

router.put(`/update`, async (req, res) => {
  console.log(`/api/post/update ROUTE SLAPPED`);
  console.log(req.body);

  try {

    let updatePost = await Post.update({
      post_title: req.body.post_title,
      post_body: req.body.post_body,
    },
      {
        where: { id: req.body.id }
      }
    );

    console.log(updatePost);

    res.status(200).json();

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `An error occured. Please contact support.` })
  }
});

router.delete(`/delete`, async (req, res) => {
  console.log(`api/post/delete ROUTE SLAPPED`);
  console.log(req.body)
  try {
    let response = await Post.destroy({ where: { id: req.body.post_id } });

    if (response > 0) {
      res.status(200).json();
      return;
    }
    res.status(404).json();
    return;

  } catch (err) {

  }

})

module.exports = router;