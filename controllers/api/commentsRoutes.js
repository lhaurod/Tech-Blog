const router = require(`express`).Router();
const withAuth = require(`../../utils/auth`);
const { Comment, Post, User } = require(`../../models`)

router.post(`/`, withAuth, async (req, res) => {
  console.log(`POST "api/comment/" ROUTE SLAPPED`);
  console.log(req.session);
  try {
    const newComment = await Comment.create({
      creator_id: req.session.user_id,
      post_id: req.body.post_id,
      comment_body: req.body.comment_body,
    });
    const newCommentFormatted = newComment.get({ plain: true })

    newCommentFormatted.user_name = req.session.user_name;

    res.status(201).json(newCommentFormatted);

  } catch (err) {
    console.log(err);
    res.render(`error`, { err });
  };
})

router.put(`/`, withAuth, async (req, res) => {
  console.log(`PUT "api/comment/" ROUTE SLAPPED`);
  console.log(req.body)
  try {
    let updatedComment = await Comment.update({
      comment_body: req.body.comment_body,
    },
      {
        where: { id: req.body.id }
      }
    );

    console.log(updatePost);

    res.status(200).json();

  } catch (err) {
    console.log(err);
    res.render(`error`, { err });
  }
});

router.delete(`/`, withAuth, async (req, res) => {
  console.log(`DELETE "api/comment/" ROUTE SLAPPED`);
  console.log(req.body)
  try {
    let deletedComment = await Comment.destroy(
      {
        where: { id: req.body.id }
      }
    );

    if (response > 0) {
      res.status(200).json();
      return;
    }
    res.status(404).json();
    return;

  } catch (err) {
    console.log(err);
    res.render(`error`, { err });
  }
});

module.exports = router;