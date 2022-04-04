import React, { useState } from 'react';
import Swal from 'sweetalert2';
import SuggestPassword from '../services/GenerateKey';
import AuthService from '../services/signup.services';
import logo from '../images/logo.png';
const dsteem = require('dsteem');

const Signup = () => {
  const client = new dsteem.Client('https://api.wortheum.news');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNo, setphoneNo] = useState('');
  const [password, setPassword] = useState(SuggestPassword);
  const [confirmPswd, setconfirmPswd] = useState('');
  const [userError, setuserError] = useState('');
  const [emailError, setemailError] = useState('');
  const [phonneError, setphoneError] = useState('');
  const [pswdError, setpswdError] = useState('');
  const [iseChecked, setiseChecked] = useState(false);
  const [keyError, setkeyError] = useState('');
  const [userValidate, setuserValidate] = useState(false);

  const onChangeUsername = (e) => {
    const username = e.target.value.toLowerCase();
    setUsername(username);
    setuserError('');
  };
  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
    setemailError('');
  };
  const onChangePhone = (e) => {
    const phone = e.target.value;
    setphoneNo(phone);
    setphoneError('');
  };
  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const onChangeConfirmPswd = (e) => {
    const confirmPswd = e.target.value;
    setconfirmPswd(confirmPswd);
    setpswdError('');
  };
  const onChangekeyConfirmed = () => {
    if (iseChecked) {
      setiseChecked(false);
    } else {
      setiseChecked(true);
      setkeyError('');
    }
  };
  function validateUser() {
    var reWhiteSpace = new RegExp('\\s+');
    // setuserError('Account is not available to register');
    // let infocolor = 'red';
    if (username.length < 2) {
      setuserError('Username should be atleast 2 characters');
      setuserValidate(false);
    }
    if (username.length > 18) {
      setuserError('Username must smaller than characters');
      setuserValidate(false);
    }
    if (username === '') {
      setuserError('* Required field');
      setuserValidate(false);
    }
    if (reWhiteSpace.test(username)) {
      setuserError('Space are not allowed in username');
      setuserValidate(false);
    }
    if (username && !reWhiteSpace.test(username)) {
      setuserValidate(true);
    }
  }
  function validatedata() {
    if (!username) {
      validateUser();
    }

    if (email === '') {
      setemailError('* Required Field');
      setuserValidate(false);
    }
    if (phoneNo === '') {
      setphoneError('* Required field');
      setuserValidate(false);
    }
    if (password !== confirmPswd) {
      setpswdError('Password did not match');
      setuserValidate(false);
    }
    if (confirmPswd === '') {
      setpswdError('* Required Field');
      setuserValidate(false);
    }
    if (!iseChecked) {
      setkeyError('Please confirm the above line to continue');
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
    validateUser();
    if (username.length > 2 && userValidate) {
      const _account = await client.database.call('get_accounts', [[username]]);
      // console.log(`_account:`, _account, username.length);
      if (_account.length === 0) {
        setuserError(' Account is available to register');
        setuserValidate(false);
        document.getElementById('accInfo').style.color = '#06d6a9';
      } else {
        setuserError(' User cannot be registered/already taken');
        setuserValidate(false);
      }
    }
  };
  const SubmitUser = async () => {
    validatedata();
    if (username.length > 2 && userValidate) {
      await AuthService.register(username, email, phoneNo, password).then(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: response.data.message,
          });
          // setUsername('');
          // setEmail('');
          // setphoneError('');
          // setPassword(SuggestPassword);
          // setconfirmPswd('');
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: resMessage,
          });
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
                <span className="details">Username</span>
                <input
                  type="text"
                  value={username}
                  placeholder="Enter your username in lowercase"
                  id="username"
                  onChange={onChangeUsername}
                />
              </div>
              <div className="input-box button" onClick={AccSearch}>
                <input id="verify-btn" type="button" value="Verify User" />
              </div>
            </div>
            {userError && (
              <div className="user-msg">
                <span id="accInfo">{userError}</span>
              </div>
            )}
            <div className="input-box">
              <span className="details">Email</span>
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
              <span className="details">Phone Number</span>
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
                <span className="details">Password</span>
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
                <span className="details">Confirm Password</span>
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
                secure.
              </label>
              {keyError && (
                <div className="result-msg">
                  <span id="ischecked" style={{ color: '#06d6a9' }}>
                    {keyError}
                  </span>
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
