import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import AuthService from '../services/signup.services';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
const dsteem = require('dsteem');

const Welcome = (props) => {
  let opts = {};
  //connect to production server
  opts.addressPrefix = 'WTH';
  opts.chainId =
    'd909c4dfab0369c4ae4f4acaf2229cc1e49b3bba0dffb36a37b6174a6f391e2e';
  const client = new dsteem.Client('https://api.wortheum.news');

  //component states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [privatekey, setprivatekey] = useState('');
  const [privateKeys, setprivateKeys] = useState('');
  const [priv, setPriv] = useState(false);
  if (props.match.path === '/confirm/:confirmationCode') {
    AuthService.verifyUser(props.match.params.confirmationCode).then(
      (response) => {
        if (response.message.status === 'Active') {
          setUsername(response.message.username);
          setPassword(response.message.userPassword);
          setprivatekey(response.message.userPassword);
          Swal.fire('Email confirmed!', '', 'success');
          submitTx(username, password);
        }
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

  //create with STEEM function
  const submitTx = async (username, password) => {
    const ownerKey = dsteem.PrivateKey.fromLogin(username, password, 'owner');
    const activeKey = dsteem.PrivateKey.fromLogin(username, password, 'active');
    const postingKey = dsteem.PrivateKey.fromLogin(
      username,
      password,
      'posting'
    );
    const memoKey = dsteem.PrivateKey.fromLogin(
      username,
      password,
      'memo'
    ).createPublic(opts.addressPrefix);
    const ownerAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[ownerKey.createPublic(opts.addressPrefix), 1]],
    };
    const activeAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[activeKey.createPublic(opts.addressPrefix), 1]],
    };
    const postingAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[postingKey.createPublic(opts.addressPrefix), 1]],
    };
    const privateKey = dsteem.PrivateKey.fromString(
      process.env.REACT_APP_ACTIVE_KEY
    );
    const op = [
      'account_create',
      {
        fee: '1.000 WORTH',
        creator: process.env.REACT_APP_USER_CREATOR,
        new_account_name: username,
        owner: ownerAuth,
        active: activeAuth,
        posting: postingAuth,
        memo_key: memoKey,
        json_metadata: '',
      },
    ];
    await client.broadcast.sendOperations([op], privateKey).then(
      function (result) {
        let res = `Included in block: ${result.block_num}`;
        Swal.fire('Good job!', res, 'success');
        setPriv(true);
      },
      function (error) {
        // Swal.fire({
        //   icon: 'error',
        //   title: 'Oops...',
        //   text: error,
        // });
        setPriv(true);
        console.error(error);
      }
    );
  };

  // Generates Aall Private Keys from username and password
  const getPrivateKeys = () => {
    let roles = ['owner', 'active', 'posting', 'memo'];
    const privKeys = {};
    roles.forEach((role) => {
      privKeys[role] = dsteem.PrivateKey.fromLogin(
        username,
        password,
        role
      ).toString();
      privKeys[`${role}Pubkey`] = dsteem.PrivateKey.from(privKeys[role])
        .createPublic()
        .toString();
    });
    setprivateKeys(privKeys);
    return privKeys;
  };
  useEffect(() => {
    getPrivateKeys();
  }, [priv]);
  return (
    <div className="container">
      <div className="company-brand">
        <img src={logo} alt="logo" />
      </div>
      <div className="title">Your Account has been successfully confirmed</div>
      <div className="content">
        <p>
          Your account has been succes created. Please make sure tha you have
          saved the following secret keys somewhere very secure and save
        </p>
        <form>
          <div className="user-details">
            <div className="confirm-box">
              <span className="details">
                <strong>Your Private key:</strong>
              </span>
              <p> {privatekey}</p>
            </div>
            <div className="confirm-box">
              <span className="details">
                <strong>Your Owner key:</strong>
              </span>
              <p>{privateKeys.owner}</p>
            </div>
            <div className="confirm-box">
              <span className="details">
                <strong>Your Active key:</strong>
              </span>
              <p>{privateKeys.active}</p>
            </div>
            <div className="confirm-box">
              <span className="details">
                <strong>Your Memo key:</strong>
              </span>
              <p>{privateKeys.memo}</p>
            </div>
            <div className="confirm-box">
              <span className="details">
                <strong>Your Posting key:</strong>
              </span>
              <p>{privateKeys.posting}</p>
            </div>
          </div>
          <p>
            <strong>Note:&nbsp;&nbsp;</strong>Click on login button below to
            access your account.
          </p>
          <br />
          <p>Regards, Team Wortheum.</p>
          <div className="button">
            <input type="button" value="CLICK HERE TO LOGIN" />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
