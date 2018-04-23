'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _response = require('../helpers/response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Create API Users Router
const router = (0, _express.Router)();

const { EMAIL_PASS } = _dotenv2.default.config().parsed;

/*
******HELP ROUTES******
*/

// Accepts a help contact request. Returns a confirmation message.
router.post('/', (req, res) => {
  const servername = req.headers.origin;

  const { firstName, lastName, email, message, subject } = req.body;
  const name = firstName !== undefined ? `${firstName} ${lastName}` : req.body.name;
  const transporter = _nodemailer2.default.createTransport({
    service: 'Gmail',
    port: 465,
    secure: true,
    auth: {
      user: 'ssmith@wombatweb.us',
      pass: EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const emailNum = emailAddr => {
    const alpha = 'abcdefghijklmnopqrstuvwxyz@.ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!#$%&\'*+-/=?^_`{|}~"(),:;<>@[\\]'.split('');
    let num = '';
    const emailArr = emailAddr.split('');

    for (let i = 0; i < emailArr.length; i += 1) {
      if (emailArr.indexOf('@') > i) {
        num += alpha.indexOf(emailArr[i]).toString();
      } else {
        return num;
      }
    }
    return num;
  };

  const supportId = `${emailNum(email)}${new Date().valueOf()}`;

  const helpRequestMessage = {
    from: [email],
    to: 'ssmith@wombatweb.us',
    subject: servername.includes('designbright') ? `Help Request #${supportId} - ${subject}` : subject,
    text: servername.includes('designbright') ? `
A support request for www.designbright.org has been submitted.

Name: ${name}
Email: ${email}

Message:
${message}

Thank you,
Design Bright Support
    ` : `
Hello Simeon,

My name is ${name} and my email is ${email}.

${message}

Thank you,
${name}
  `
  };

  transporter.sendMail(helpRequestMessage, (requestMsgErr, requestMsgInfo) => {
    if (requestMsgErr) {
      return (0, _response2.default)(requestMsgErr.responseCode, requestMsgErr, 'There was an error sending your support request. Please send an email to help@designbright.org', res);
    } else if (requestMsgInfo) {
      const helpConfirmMessage = {
        from: servername.includes('designbright') ? 'help@designbright.org' : 'ssmith@wombatweb.us',
        to: [email],
        subject: servername.includes('designbright') ? `Help Request #${supportId} - ${subject}` : `Thank you for contact me. - ${subject}`,
        text: servername.includes('designbright') ? `
Hello ${name},

We have received the request below for help. We look forward to helping you. Please allow 24-48 hours for a response. 

Help Request:
${message}

Thank you,
Design Bright Support
          ` : `
Hello ${name},

Thank you for reaching out to me. I will get back to you within 24 hours.

Thank you,
Simeon Smith
ssmith@wombatweb.us

Original Message:
Name: ${name}
Email: ${email}
Subject: ${subject}
Message:
${message}
          `
      };

      return transporter.sendMail(helpConfirmMessage, (confirmMsgErr, confirmMsgInfo) => {
        if (confirmMsgErr) {
          return (0, _response2.default)(confirmMsgErr.responseCode, confirmMsgErr, 'Your support request failed. Please email help@designbright.org', res);
        } else if (confirmMsgInfo) {
          return (0, _response2.default)(200, confirmMsgInfo, 'You support request was successfully sent.', res);
        }
        return (0, _response2.default)(404, {}, 'Your support request failed. Please email help@designbright.org', res);
      });
    }
    return (0, _response2.default)(404, {}, 'Your support request failed. Please email help@designbright.org', res);
  });
});

// Exporting router as default.
exports.default = router;
//# sourceMappingURL=help.js.map