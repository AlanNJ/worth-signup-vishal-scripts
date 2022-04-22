const config = require("../config/auth.config");
const nodemailer = require("../config/nodemailer.config");

const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const token = jwt.sign({ email: req.body.email }, config.secret);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    userPassword: req.body.password,
    referalUser: req.body.referalUser,
    confirmationCode: token,
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({
              message:
                "Thank you! Your account creation request is submitted.A verification mail has been sent on e-mail provided by you. Kindly verify your e-mail to confirm. Best regards,Team Wortheum",
            });
            nodemailer.sendConfirmationEmail(
              user.username,
              user.email,
              user.confirmationCode
            );
            res.redirect("/");
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          res.send({
            message:
              "Thank you! Your account creation request is submitted.A verification mail has been sent on e-mail provided by you. Kindly verify your e-mail to confirm. Best regards,Team Wortheum",
          });

          nodemailer.sendConfirmationEmail(
            user.username,
            user.email,
            user.confirmationCode
          );
        });
      });
    }
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      // var passwordIsValid = bcrypt.compareSync(
      //   req.body.password,
      //   user.password
      // );

      // if (!passwordIsValid) {
      //   return res.status(401).send({
      //     accessToken: null,
      //     message: 'Invalid Password!',
      //   });
      // }

      if (user.status != "Active") {
        return res.status(401).send({
          message: "Pending Account. Please Verify Your Email!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        status: user.status,
      });
    });
};

exports.verifyUser = (req, res, next) => {
  User.findOne({
    confirmationCode: req.params.confirmationCode,
  })
    .then((user) => {
      console.log(user);
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      user.status = "Active";
      res.send({ message: user });
      user.save((err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
      });
    })
    .catch((e) => console.log("error", e));
};
