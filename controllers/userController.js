const { User, Thought } = require('../models');

module.exports = {
  // GET all users
  getUsers(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json(err));
  },
  // GET single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err)});
  },
  // Create new user - POST
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Update current user - PUT
  updateUser(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
    )
        .then((user) =>
          !user
            ? res.status(404).json({ message: "No user found with this ID!" })
            : res.json(user)
            )
            .catch((err) => res.status(500).json(err));
  },
  // Delete user and respective thoughts
  deleteUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: 'No user with that ID' })
          : Thought.deleteMany({ _id: { $in: user.thoughts } })
      )
      .then(() => res.json({ message: 'User and associated thoughts deleted!' }))
      .catch((err) => res.status(500).json(err));
  },
  // POST friend
  addFriend(req, res) {
    User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId }}, { new: true })
       .then(data => {
           if(!data) {
               res.status(404).json({ message: "No user found with given ID"})
           }
           res.status(200).json(data);
       })
       .catch(error => {
          console.log(error);
          res.status(500).json(error);
       })
    },
    // DELETE friend
    deleteFriend(req, res) {
        User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId }}, { new: true })
        .then(data => {
            if(!data) {
                res.status(404).json({ message: "No user found with given ID"})
            }
            res.status(200).json(data);
        })
        .catch(error => {
           console.log(error);
           res.status(500).json(error);
        })
    }
};