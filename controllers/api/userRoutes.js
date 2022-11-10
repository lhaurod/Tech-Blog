const router = require(`express`).Router();
const withAuth = require(`../../utils/auth`);
const { Comment, Post, User } = require(`../../models`)

router.post(`/login`, async (req, res) => {
  console.log(`/api/login ROUTE SLAPPED`)
  console.log(req.body)
  try {
    const userData = await User.findOne({ where: { user_name: req.body.user_name } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    };

    const userDataFormatted = userData.get({ plain: true });
    // let userInterests = userInterestsData.map((userInterest) => userInterest.get({ plain: true }));

    console.log(userDataFormatted);

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }
    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.user_name = userData.user_name;
      req.session.logged_in = true;

      res.json({ message: `Login attempt successful!` })
    })

  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

router.post('/createaccount', async (req, res) => {
  console.log('/api/createaccount ROUTE SLAPPED');
  console.log(req.body);
  try {
    const usernameTaken = await User.findOne({ where: { user_name: req.body.user_name } })
    if (usernameTaken) {
      res
        .status(409)
        .json({ message: 'The requested Username is already in use. Please enter a different username.' });
      return;
    }
    console.log(`USERNAME NOT TAKEN`)
    const newUser = await User.create(req.body);
    console.log(newUser)
    const newUserFormatted = await newUser.get({ plain: true })

    req.session.save(() => {
      req.session.user_id = newUserFormatted.id;
      req.session.user_name = newUserFormatted.user_name;
      req.session.logged_in = true;

      res.status(201).json({ message: `Account Creation successful!` });
    })

  } catch (err) {
    res.status(500).json({ message: `Something went wrong.` });
  }
});

router.get(`/logout`, withAuth, (req, res) => {
  try {
    req.session.destroy(() => {
      res.render(`logOutRedirect`)
    });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
})

module.exports = router;