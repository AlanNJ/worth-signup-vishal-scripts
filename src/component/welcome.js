import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { CopyToClipboard } from "react-copy-to-clipboard";
import AuthService from "../services/signup.services";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import pic1 from "../images/pic1.png";
import pic2 from "../images/pic2.png";
const dsteem = require("dsteem");

const Welcome = (props) => {
  let opts = {};
  //connect to production server
  opts.addressPrefix = "WTH";
  opts.chainId =
    "d909c4dfab0369c4ae4f4acaf2229cc1e49b3bba0dffb36a37b6174a6f391e2e";
  const client = new dsteem.Client("https://api.wortheum.news");
  const steemClient = new dsteem.Client("https://api.steemit.com");

  //component states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [privatekey, setprivatekey] = useState("");
  const [privateKeys, setprivateKeys] = useState("");
  const [sp, setsp] = useState(process.env.REACT_APP_SP);
  const [tx, setTx] = useState(false);
  const [copied, setcopied] = useState(false);
  const [accountSuccess, setaccountSuccess] = useState(false);
  const [referalUser, setreferalUser] = useState();
  console.log("referalUser", referalUser);
  useEffect(() => {
    if (props.match.path === "/confirm/:confirmationCode") {
      AuthService.verifyUser(props.match.params.confirmationCode).then(
        (response) => {
          if (response.message.status === "Active") {
            console.log("res0", response.message);
            setUsername(response.message.username);
            setPassword(response.message.userPassword);
            setprivatekey(response.message.userPassword);
            setreferalUser(response.message.referalUser);
            Swal.fire("Email confirmed!", "", "success");
            setTx(true);
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
            icon: "error",
            title: "Oops...",
            text: resMessage,
          });
          setTx(false);
        }
      );
    }
  }, []);
  useEffect(() => {
    //create with STEEM function
    const submitTx = async (username, password) => {
      const ownerKey = dsteem.PrivateKey.fromLogin(username, password, "owner");
      const activeKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        "active"
      );
      const postingKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        "posting"
      );
      const memoKey = dsteem.PrivateKey.fromLogin(
        username,
        password,
        "memo"
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
        "account_create",
        {
          fee: "1.000 WORTH",
          creator: process.env.REACT_APP_USER_CREATOR,
          new_account_name: username,
          owner: ownerAuth,
          active: activeAuth,
          posting: postingAuth,
          memo_key: memoKey,
          json_metadata: "",
        },
      ];
      await client.broadcast.sendOperations([op], privateKey).then(
        function (result) {
          let res = `Included in block: ${result.block_num}`;
          Swal.fire("Good job!", res, "success");
          setaccountSuccess(true);
        },
        function (error) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error,
          });
          setaccountSuccess(false);
          console.error(error);
        }
      );
    };

    const sendDelegation = async () => {
      const lib = dsteem;
      const client = steemClient;
      const ops = [];
      if (sp > 0) {
        // Converting SP to VESTS
        const delegation = lib
          .getVestingSharePrice(
            await client.database.getDynamicGlobalProperties()
          )
          .convert({ amount: sp, symbol: "WORTH" });

        const delegate_op = [
          "delegate_vesting_shares",
          {
            delegatee: username,
            delegator: process.env.REACT_APP_USER_CREATOR,
            vesting_shares: delegation,
          },
        ];

        ops.push(delegate_op);
        console.log("delegation", delegation);
      }
      if (process.env.REACT_APP_ACTIVE_KEY) {
        client.broadcast
          .sendOperations(
            ops,
            lib.PrivateKey.from(process.env.REACT_APP_ACTIVE_KEY)
          )
          .then((r) => {
            console.log(r);
            Swal.fire(
              "Congrats!",
              "Your bonus coin has been transferred to your account",
              "success"
            );
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: e.message,
            });
          });
      }
    };

    const sendWorthpower = async () => {
      const lib = dsteem;
      const client = steemClient;
      const ops = [];
      const powerup_op = [
        "transfer_to_vesting",
        {
          from: process.env.REACT_APP_USER_CREATOR,
          to: referalUser,
          amount: process.env.REACT_APP_DELEGATION,
        },
      ];

      ops.push(powerup_op);
      console.log("refferal", referalUser);
      if (process.env.REACT_APP_ACTIVE_KEY) {
        client.broadcast
          .sendOperations(
            ops,
            lib.PrivateKey.from(process.env.REACT_APP_ACTIVE_KEY)
          )
          .then((r) => {
            console.log(r);
            Swal.fire(
              "Congrats!",
              "100 Wortheum power has been transferred to your refferal account",
              "success"
            );
          })
          .catch((e) => {
            console.log(e);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: e.message,
            });
          });
      }
    };
    if (tx) {
      submitTx(username, password);
    }
    if (accountSuccess) {
      sendDelegation();
    }
    if (accountSuccess && referalUser) {
      sendWorthpower();
    }
  }, [tx]);
  // Generates Aall Private Keys from username and password
  useEffect(() => {
    const getPrivateKeys = () => {
      let roles = ["owner", "active", "posting", "memo"];
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
    getPrivateKeys();
  }, []);
  return (
    <div className="container">
      <div className="company-brand">
        <img src={logo} alt="logo" />
      </div>
      <div className="title">Your Account has been successfully confirmed</div>
      <br />
      <div className="content">
        <p>
          Your account is created successfully. Please login to wortheum.news
          with master password for downloading your keys for daily use
        </p>
        <form>
          <div className="user-details">
            <div className="confirm-box">
              <span className="details">
                <strong>Your Private key:</strong>
              </span>

              <input
                type="text"
                value="P5KCCkTEXyfaoN2F3wAerkD9vCtTSxBvbpvWrTxLNxHuFtVwLPVK"
                readOnly
                className="pswd-key-input"
              />
              <CopyToClipboard text={privatekey} onCopy={() => setcopied(true)}>
                <button
                  className="copy-btn"
                  onClick={(e) => e.preventDefault()}
                >
                  Copy to clipboard
                </button>
              </CopyToClipboard>
              {copied ? <span style={{ color: "red" }}>Copied.</span> : null}
            </div>
            <div className="box-image">
              <div className="image">
                <img src={pic2} />
              </div>
              <div className="image">
                <img src={pic1} />
              </div>

              <p>
                You can download your keys by look into the above instructions
                or visit wortheum wallet.com{" "}
              </p>
              <p>&gt; keys & permission</p>
              <p>&gt; Your keys directory</p>
              <p>
                If you have are facing any trouble to login, please join our
                telegram support group
              </p>
            </div>

            {/* <div className="confirm-box">
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
            </div> */}
          </div>
          <p>
            <strong>Note:&nbsp;&nbsp;</strong>Click on login button below to
            access your account.
          </p>
          <br />
          <p>Regards, Team Wortheum.</p>
          <div className="btn-flex">
            <div className="button">
              <a href="https://wortheum.news/" target="_blank">
                Login to Wortheum News
              </a>
            </div>
            <div className="button">
              <a href="https://wortheumwallet.com/login.html" target="_blank">
                Login to Wortheum Wallet
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Welcome;
