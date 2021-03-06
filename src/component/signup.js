import React, { useState } from "react";
import Swal from "sweetalert2";
import SuggestPassword from "../services/GenerateKey";
import AuthService from "../services/signup.services";
import logo from "../images/logo.png";
const dsteem = require("dsteem");

const Signup = () => {
  const client = new dsteem.Client("https://api.wortheum.news");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [password, setPassword] = useState(SuggestPassword);
  const [confirmPswd, setconfirmPswd] = useState("");
  const [userError, setuserError] = useState("");
  const [emailError, setemailError] = useState("");
  const [phonneError, setphoneError] = useState("");
  const [pswdError, setpswdError] = useState("");
  const [iseChecked, setiseChecked] = useState(false);
  const [keyError, setkeyError] = useState("");
  const [userValidate, setuserValidate] = useState(false);
  const [isUserVerify, setisUserVerify] = useState(false);
  const [referUsername, setreferUsername] = useState("");
  const [referalError, setreferalError] = useState("");
  const onChangeUsername = (e) => {
    const username = e.target.value.toLowerCase();
    setUsername(username);
    setuserError("");
  };
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setemailError("");
  };
  const onChangePhone = (e) => {
    const phone = e.target.value;
    setphoneNo(phone);
    setphoneError("");
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };
  const onChangeReferal = (e) => {
    const referal = e.target.value;
    setreferUsername(referal);
    setreferalError("");
  };

  const onChangeConfirmPswd = (e) => {
    const confirmPswd = e.target.value;
    setconfirmPswd(confirmPswd);
    setpswdError("");
  };
  const onChangekeyConfirmed = () => {
    if (iseChecked) {
      setiseChecked(false);
    } else {
      setiseChecked(true);
      setkeyError("");
    }
  };

  function ValidateUser(user) {
    var len = void 0;
    var reWhiteSpace = new RegExp("\\s+");
    let startwithNum = user.match(new RegExp(/^\d/));
    // setuserError('Account is not available to register');
    // let infocolor = 'red';
    var ref = user.split(".");
    for (var i = 0, len = ref.length; i < len; i++) {
      var label = ref[i];
      if (!/^[a-z]/.test(label)) {
        return {
          valid: false,
          error: "Username should start with a letter.",
        };
      }
      if (!/^[a-z0-9-]*$/.test(label)) {
        return {
          valid: false,
          error: "Username should have only letters, digits, or dashes.",
        };
      }
      if (/--/.test(label)) {
        return {
          valid: false,
          error: "Username should have only one dash in a row.",
        };
      }
      if (!/[a-z0-9]$/.test(label)) {
        return {
          valid: false,
          error: "Username should end with a letter or digit.",
        };
      }
    }
    if (user.length < 3) {
      return {
        valid: false,
        error: "Username should be atleast 2 characters",
      };
    }
    if (user.length > 15) {
      return {
        valid: false,
        error: "Username must smaller than 15 characters",
      };
    }
    return {
      valid: true,
      error: "Username is valid",
    };
  }
  // function validateUser() {
  //   var suffix = "";
  //   var reWhiteSpace = new RegExp("\\s+");
  //   let startwithNum = username.match(new RegExp(/^\d/));
  //   // setuserError('Account is not available to register');
  //   // let infocolor = 'red';
  //   if (username.length < 3) {
  //     setuserError("Username should be atleast 2 characters");
  //     setuserValidate(false);
  //   }
  //   if (username.length > 15) {
  //     setuserError("Username must smaller than 15 characters");
  //     setuserValidate(false);
  //   }
  //   if (startwithNum) {
  //     setuserError("First name must be alphabets");
  //     setuserValidate(false);
  //   }

  //   if (username === "") {
  //     setuserError("* Required field");
  //     setuserValidate(false);
  //   }
  //   if (reWhiteSpace.test(username)) {
  //     setuserError("Space are not allowed in username");
  //     setuserValidate(false);
  //   }
  //   if (username != "" && !reWhiteSpace.test(username) && !startwithNum) {
  //     setuserValidate(true);
  //   }
  //   if (/\./.test(username)) {
  //     suffix = "Each account segment should ";
  //   }
  //   var ref = username.split(".");
  //   for (var i = 0, len = ref.length; i < len; i++) {
  //     var label = ref[i];
  //     if (!/^[a-z]/.test(label)) {
  //       setuserError("Username should start with a letter.");
  //       setuserValidate(false);
  //     }
  //     if (!/^[a-z0-9-]*$/.test(label)) {
  //       setuserError("Username should have only letters, digits, or dashes.");
  //       setuserValidate(false);
  //     }
  //     if (/--/.test(label)) {
  //       setuserError("Username should have only one dash in a row.");
  //       setuserValidate(false);
  //     }
  //     if (!/[a-z0-9]$/.test(label)) {
  //       setuserError("Username should end with a letter or digit.");
  //       setuserValidate(false);
  //     }
  //   }
  // }
  function validatedata() {
    if (!username) {
      ValidateUser(username);
    }

    if (email === "") {
      setemailError("* Required Field");
      setuserValidate(false);
    }
    if (phoneNo === "") {
      setphoneError("* Required field");
      setuserValidate(false);
    }
    if (password !== confirmPswd) {
      setpswdError("Password did not match");
      setuserValidate(false);
    }
    if (confirmPswd === "") {
      setpswdError("* Required Field");
      setuserValidate(false);
    }
    if (!iseChecked) {
      setkeyError("Please confirm the above line to continue");
      setuserValidate(false);
    }
    if (
      username &&
      email &&
      phoneNo &&
      confirmPswd &&
      iseChecked &&
      password === confirmPswd
    ) {
      setuserValidate(true);
    }
  }
  const AccSearch = async () => {
    const res = ValidateUser(username);
    if (!res.valid) {
      setuserError(res.error);
      document.getElementById("accInfo").style.color = "red";
      return false;
    } else {
      if (username.length > 2) {
        const _account = await client.database.call("get_accounts", [
          [username],
        ]);
        // console.log(`_account:`, _account, username.length);
        if (_account.length === 0) {
          setuserError(" Account is available to register");
          setisUserVerify(true);
          document.getElementById("accInfo").style.color = "#06d6a9";
        } else {
          setuserError(" User cannot be registered/already taken");
          setisUserVerify(false);
        }
      }
    }
  };
  const SubmitUser = async () => {
    if (!isUserVerify) {
      Swal.fire({
        icon: "error",
        title: "User is not Verified",
        text: "Please verify user by clicking on check availability button",
      });
      return false;
    }
    validatedata();
    if (username.length > 2 && userValidate && isUserVerify) {
      await AuthService.register(
        username,
        email,
        phoneNo,
        password,
        referUsername
      ).then(
        (response) => {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: response.data.message,
          });
          setUsername("");
          setEmail("");
          setphoneError("");
          setPassword(SuggestPassword);
          setconfirmPswd("");
          setreferUsername("");
          setisUserVerify(false);
          setuserValidate(false);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: resMessage,
          });
          setUsername("");
          setuserError("");
          setisUserVerify(false);
          setuserValidate(false);
        }
      );
    }
  };
  return (
    <div className="container">
      <div className="company-brand">
        <img src={logo} alt="logo" />
      </div>
      <div className="title">Registration</div>
      <div className="content">
        <form>
          <div className="user-details">
            <div className="user-flex">
              <div className="input-box">
                <span className="details">Username *</span>
                <input
                  type="text"
                  value={username}
                  placeholder="Enter your username in lowercase"
                  id="username"
                  onChange={onChangeUsername}
                />
                {userError && (
                  <div className="user-msg">
                    <span id="accInfo">{userError}</span>
                  </div>
                )}
              </div>

              <div
                style={{ marginTop: "30px" }}
                className="input-box button"
                onClick={AccSearch}
              >
                <input
                  id="verify-btn"
                  type="button"
                  value="Check Availability"
                />
              </div>
            </div>

            <div className="input-box">
              <span className="details">Email *</span>
              <input
                type="text"
                placeholder="Enter your email"
                id="email"
                value={email}
                onChange={onChangeEmail}
              />
              {emailError && (
                <div className="result-msg">
                  <span id="email-error">{emailError}</span>
                </div>
              )}
            </div>
            <div className="input-box">
              <span className="details">Phone Number *</span>
              <input
                type="number"
                placeholder="Enter your number"
                id="phoneNo"
                value={phoneNo}
                onChange={onChangePhone}
              />
              {phonneError && (
                <div className="result-msg">
                  <span id="phone-error">{phonneError}</span>
                </div>
              )}
            </div>
            <div className="pswd-flex">
              <div className="input-box pswd-input">
                <span className="details">Password *</span>
                <input
                  type="text"
                  placeholder="Enter your password"
                  id="password"
                  value={password}
                  onChange={onChangePassword}
                  readOnly
                />
              </div>
              <div className="input-box pswd-input">
                <span className="details">Confirm Password *</span>
                <input
                  type="text"
                  placeholder="Confirm your password"
                  id="confirmPswd"
                  value={confirmPswd}
                  onChange={onChangeConfirmPswd}
                />
                {pswdError && (
                  <div className="pswd-msg">
                    <span id="pswd-error">{pswdError}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="pswd-flex">
              <div className="input-box pswd-input">
                <span className="details">Referal User (optional)</span>
                <input
                  type="text"
                  placeholder="Enter your referal username"
                  id="confirmPswd"
                  value={referUsername}
                  onChange={onChangeReferal}
                  onBlur={(e) => {
                    const res = ValidateUser(e.target.value);
                    if (!res.valid) {
                      setreferalError(res.error);
                      return false;
                    } else {
                      if (e.target.value.length > 2) {
                        client.database
                          .call("get_accounts", [[e.target.value]])
                          .then(
                            function (result) {
                              if (result.length === 0) {
                                setreferalError("Wrong Username...!!");
                              } else {
                                setreferalError("User is available!");
                              }
                              // console.log("res", result);
                            },
                            function (error) {
                              console.error(error);
                            }
                          );
                      }
                    }
                  }}
                />
                {referalError && (
                  <div className="pswd-msg">
                    <p id="referal-error">{referalError}</p>
                  </div>
                )}
              </div>
            </div>
            <br />
            <div className="confirm-box">
              <input
                type="checkbox"
                id="key-checker"
                name="confirm"
                checked={iseChecked}
                onChange={onChangekeyConfirmed}
              />
              &nbsp;&nbsp;
              <label htmlFor="confirm">
                Did you write your password and saved it somewhere very safe and
                securely.
              </label>
              {keyError && (
                <div className="result-msg">
                  <p id="ischecked" style={{ color: "#06d6a9" }}>
                    {keyError}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="button" onClick={SubmitUser}>
            <input type="button" value="Create Account" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
