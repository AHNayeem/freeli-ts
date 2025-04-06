/* eslint-disable no-fallthrough */
/* eslint-disable no-unreachable */
import axios from "axios";
import CryptoJS from "crypto-js";
import moment from "moment";
import { baseURL } from "../config/config";
import { setUpdateVersion } from '../redux/message';

var base64regex = /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/;

let voip_channel = new BroadcastChannel('voip_channel');

// function IsJsonString(str) {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// }

const IsJsonString = (str) => {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
};

// function linkify(m, inputText) {
//   console.log("🚀 ~ linkify ~ inputText:", inputText)
//   var regex = /(<p>|<\/p>)/ig
//   inputText = inputText.replace(regex, "");
//   var text = inputText;
//   var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(?![^<>]*>|[^<>]*<\/a>)/gi;
//   // var mailpattern = /(([a-zA-Z0-9-_]?)+@[a-zA-Z_]+?(\.[a-zA-Z]{2,6})+)/gim;
//   var mailpattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
//   text = text.replace(mailpattern, '<a href="mailto:$1">$1</a>');
//   text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
//   console.log("🚀 ~ linkify ~ text:", text)
//   return text;
// }
function linkify(m, inputText) {
  // Remove <p> and </p> tags
  var regex = /(<p>|<\/p>)/ig;
  inputText = inputText.replace(regex, "");

  var text = inputText;

  // Regex for matching URLs with http:// or https://
  var exp = /\b(https?:\/\/(?:www\.)?[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(?![^<>]*>|[^<>]*<\/a>)/gi;

  // Regex for matching URLs starting with "www." (without http/https)
  var wwwExp = /\b(www\.[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?![^<>]*>|[^<>]*<\/a>)/gi;

  // Regex for matching email addresses
  var mailpattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;

  // Convert emails to mailto links
  text = text.replace(mailpattern, '<a href="mailto:$1">$1</a>');

  // Convert URLs with http:// or https:// to clickable links
  text = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");

  // Convert "www." URLs to clickable links by prepending "https://"
  text = text.replace(wwwExp, "<a href='http://$1' target='_blank'>$1</a>");
  return text;
}



const mykey = 'D1583ED51EEB8E58F2D3317F4839A';
const { return_data } = require('../config/config');
// return the user data from the session storage
export const getUser = () => {

  const userStr = localStorage.getItem('user');
  if (userStr) {
    var userJson = JSON.parse(userStr);
    if (userJson.img) {
      userJson.img = userJson.img.replace(/^(https?:\/\/)?[^/]+(:\d+)?/, return_data.FILE_SERVER.replace(/\/$/, ""))
    }

    return userJson;
  }
  else return null;
}
// return the user login data from the session storage
export const getSessionLoginData = () => {
  const loginData = localStorage.getItem('logindata');
  if (loginData) return JSON.parse(loginData);
  else return null;
}

export const setCurrentPagination = (pagidata) => {
  localStorage.setItem('current_pagination', JSON.stringify(pagidata));
}

export const getCurrentPagination = () => {
  const pagi = localStorage.getItem('current_pagination');
  if (pagi) return JSON.parse(pagi);
  else return null;
}

// return the token from the session storage
export const getToken = () => {
  return localStorage.getItem('token') || null;
}

export const setOnlyTokenUser = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', user);
}

// remove the token and user from the session storage
export const removeUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('logindata');
  localStorage.removeItem('active_freeli_conv');

  let remember = localStorage.getItem('remember_me');
  let emailRe = localStorage.getItem('remember_email');
  let passwordRe = localStorage.getItem('remember_password');
  // localStorage.clear();
  if (remember) {
    localStorage.setItem('remember_me', true)
    localStorage.setItem('remember_email', emailRe)
    localStorage.setItem('remember_password', passwordRe)
  }

}

// set the token and user from the session storage
export const setUserSession = (token, user, logindata) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('total_login', JSON.stringify(user.login_total));
  localStorage.setItem('logindata', JSON.stringify(logindata));
  // console.log(110, logindata)
}

export const setOnlyLoginData = (logindata) => {
  localStorage.setItem('logindata', JSON.stringify(logindata));
}

export const aesEncrypt = (data) => {
  const cipher = CryptoJS.AES.encrypt(JSON.stringify(data), mykey).toString();
  return cipher.toString();
}

export const decryptedData = (data) => {
  const cipher = CryptoJS.AES.decrypt(data, mykey);
  return JSON.parse(cipher.toString(CryptoJS.enc.Utf8));
}

export const mongoObjectId = function () {
  var timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, function () {
    return (Math.random() * 16 | 0).toString(16);
  }).toLowerCase();
};

export const fileExtension = (name, file_category = null) => {
  let ext = name.split('.');
  ext = ext[ext.length - 1];
  ext = ext.toLowerCase();
  let reext = '';

  switch (ext) {
    case 'apk':
      if (file_category === 'voice') {
        reext = 'voice';
        break;
      }
    case 'ai':
    case 'mp3':
    case 'ogg':
    case 'doc':
    case 'DOC':
    case 'docx':
    case 'DOCX':
    case 'exe':
    case 'indd':
    case 'js':
    case 'sql':
    case 'pdf':
    case 'Pdf':
    case 'PDF':
    case 'ppt':
    case 'pptx':
    case 'psd':
    case 'xls':
    case 'Xls':
    case 'XLS':
    case 'xlsx':
    case 'Xlsx':
    case 'XLSX':
    case 'zip':
    case 'rar':
      reext = ext;
      break;
    case '3gp':
    case 'avi':
    case 'flv':
    case 'm4v':
    case 'mov':
    case 'mpg':
    case 'mp4':
    case 'mkv':
    case 'wmv':
    case 'webm':
      reext = ext;
      break;
    case 'jpg':
    case 'JPG':
    case 'jpeg':
    case 'JPEG':
    case 'gif':
    case 'png':
    case 'PNG':
    case 'svg':
      reext = ext;
      break;
    default:
      reext = 'other';
  }
  return reext;
}

export const getThumImage = (l) => {
  let ar = l.split('/');
  let n = 'thumb-' + ar[ar.length - 1];
  ar[ar.length - 1] = n;
  return ar.join('/');
}

export const niceBytes = (x) => {
  const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let l = 0, n = parseInt(x, 10) || 0;
  while (n >= 1024 && ++l) {
    n = n / 1024;
  }
  return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

export const openFile = (file) => {
  localStorage.setItem('file_view', JSON.stringify(file))
  window.open('/file', "_blank")
};

export const openFilePOP = (v, props) => {
  props.set_popup_video(v.location);
  props.setPopup({ type: 'playerPopup', data: true })
};

export const get_user_details_by_id = (id) => {
  let logindata = localStorage.getItem('logindata');
  logindata = JSON.parse(logindata);
  let data = false
  for (let u of logindata.all_users) {
    // console.log(361,u)
    if (id === u.id) {
      data = {
        fullname: `${u.firstname} ${u.lastname}`
      }
    }
  }

  if (data) {
    return data;
  } else {
    return {
      fullname: `Inactive User`
    }
  }
}

// export const modifyMyMsg = (msgs, callback) => {
//   return new Promise((resolve, reject) => {
//     let dmsgs = [];
//     let messages = JSON.parse(JSON.stringify(msgs));
//     // console.log("🚀 ~ returnnewPromise ~ messages:", messages)
//     messages.forEach(m => {
//       try {
//         if (m.edit_history !== '' && m.edit_history !== null) {
//           let historyArray = m.edit_history.split('@_$cUsJs');
//           m.edit_history = [];
//           for (let h of historyArray) {
//             let jsondata = JSON.parse(h);
//             // let a = moment("2021-08-10T10:36:45.025Z");let b = moment(jsondata.update_at);let diff = b.diff(a, 'days');
//             // if(diff > 2){
//             if (base64regex.test(jsondata.msg_body) && jsondata.msg_body !== '') {
//               let decryptedData = CryptoJS.AES.decrypt(jsondata.msg_body, mykey).toString(CryptoJS.enc.Utf8);
//               if (IsJsonString(decryptedData)) {
//                 let d = JSON.parse(decryptedData);
//                 jsondata.msg_body = d;
//               } else {
//                 if (decryptedData.indexOf('"') === 0)
//                   jsondata.msg_body = decryptedData.substring(1, decryptedData.length - 1);
//                 else
//                   jsondata.msg_body = decryptedData;
//               }
//             }
//             // }
//             // console.log("Crypto 179")
//             m.edit_history.push(jsondata)
//           }
//           m.edit_history.reverse()

//         }
//         if (m.has_flagged === null) {
//           m.has_flagged = [];
//         }
//         if (m.msg_type === 'task' && m.tasks === null) {
//           m.msg_type = 'text';
//         } else if (m.msg_type === 'task') {
//           m.tasks = JSON.parse(m.tasks);
//         }
//         // let a = moment("2021-08-10T10:36:45.025Z");let b = moment(m.created_at);let diff = b.diff(a, 'days');
//         // if(diff > 2){
//         // console.log("code ", m.msg_body);
//         if (base64regex.test(m.msg_body) && m.msg_body !== '') {
//           // console.log("regex true");
//           let decryptedData = CryptoJS.AES.decrypt(m.msg_body, mykey).toString(CryptoJS.enc.Utf8);
//           // console.log("decryptedData ", decryptedData);
//           if (IsJsonString(decryptedData)) {
//             // console.log("isjson true")
//             let d = JSON.parse(decryptedData);
//             m.msg_body = d;
//           } else {
//             // console.log("isjson false")
//             if (decryptedData.indexOf('"') === 0) {
//               // console.log("start with cote ")
//               m.msg_body = decryptedData.substring(1, decryptedData.length - 1);
//             } else {
//               // console.log("no change ")
//               m.msg_body = decryptedData;
//             }
//           }
//         }

//         m.msg_body = m.msg_body.toString();
//         // if(m.msg_body.indexOf('<a') === -1){  

//         m.msg_body = linkify(m, m.msg_body);
//         // }
//         if (m.url_title === null) {
//           m.url_title = ''
//         }
//         m.msg_body = m.msg_body.replace(/href/g, 'target="_blank" href');
//         m.is_read = false;
//         dmsgs.push(m)
//       } catch (error) {
//         console.log(error)
//       }
//     });
//     resolve(dmsgs);
//   })
// }

export const modifyMyMsg = (msgs, callback) => {
  return new Promise((resolve, reject) => {
    let dmsgs = [];
    let messages = JSON.parse(JSON.stringify(msgs)); // Deep copy

    messages.forEach(m => {
      try {
        // Process edit history
        if (m.edit_history && m.edit_history !== '') {
          let historyArray = m.edit_history.split('@_$cUsJs');
          m.edit_history = [];
          for (let h of historyArray) {
            if (h && IsJsonString(h)) {
              let jsondata = JSON.parse(h);
              if (base64regex.test(jsondata.msg_body) && jsondata.msg_body) {
                let decryptedData = CryptoJS.AES.decrypt(jsondata.msg_body, mykey).toString(CryptoJS.enc.Utf8);
                if (IsJsonString(decryptedData)) {
                  jsondata.msg_body = JSON.parse(decryptedData);
                } else {
                  jsondata.msg_body = decryptedData.trim();
                }
              }
              m.edit_history.push(jsondata);
            }
          }
          m.edit_history.reverse();
        }

        // Process flagged status
        if (m.has_flagged === null) {
          m.has_flagged = [];
        }

        // Process tasks safely
        if (m.msg_type === 'task') {
          if (m.tasks && IsJsonString(m.tasks)) {
            m.tasks = JSON.parse(m.tasks);
          } else {
            console.warn("Skipping invalid tasks:", m.tasks);
            m.tasks = []; // Default to empty array if invalid
          }
        } else if (m.msg_type === 'task' && m.tasks === null) {
          m.msg_type = 'text';
        }

        // Process message body
        if (base64regex.test(m.msg_body) && m.msg_body) {
          let decryptedData = CryptoJS.AES.decrypt(m.msg_body, mykey).toString(CryptoJS.enc.Utf8);
          if (IsJsonString(decryptedData)) {
            m.msg_body = JSON.parse(decryptedData);
          } else {
            m.msg_body = decryptedData.trim();
          }
        }

        m.msg_body = m.msg_body.toString();
        m.msg_body = linkify(m, m.msg_body);
        if (m.url_title === null) {
          m.url_title = '';
        }

        if (!m.msg_body.includes('#mention_')) {
          m.msg_body = m.msg_body.replace(/href/g, 'target="_blank" href');
        }
        m.is_read = false;

        dmsgs.push(m);
      } catch (error) {
        console.error("Error processing message:", error, m);
      }
    });
    resolve(dmsgs);
  });
};


export const getRefreshToken = () => {
  return new Promise((resolve, reject) => {
    const refresh_token = localStorage.getItem('refresh_token');
    let instance = axios.create({
      baseURL: baseURL,
      // timeout: 5000,
      // headers: { 'Authorization': getToken() }
    });
    instance.post('/v1/refreshToken', { refresh_token: `${refresh_token}` },)
      .then(function (response) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('refresh_token', response.data.refresh_token)
        // handle success
        resolve(response.data);
      })
      .catch(function (error) {
        // handle error
        reject({ status: false, type: 'error', ...error });
      })

  })
}


// export const upload_obj = (params, config, callback) => {
//   return new Promise((resolve, reject) => {
//     const token = localStorage.getItem('token');
//     let instance = axios.create({
//       baseURL: baseURL,
//       headers: { 'Authorization': `Bearer ${token}` }
//     });
//     instance.post('/v1/upload_obj', params,)
//       .then(function (response) {
//         console.log(348, response.data)
//         callback(response.data)
//       })
//       .catch(function (error) {
//         // handle error
//         console.log(error);
//         callback(error)
//       })

//   })
// }

export const upload_obj = (params, config, callback) => {
  let isAI = false;
  for (let [key, value] of params.entries()) {
    if (key === "ai_reply" && value === 'true') {
      isAI = true;
    }
  }
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    const instance = axios.create({
      baseURL: baseURL,
      headers: { Authorization: `Bearer ${token}` },
    });

    instance.post('/v1/upload_obj', params, config)
      .then((response) => {
        if (typeof callback === 'function') {
          callback(response.data); // Call the callback with the response data
        }
        if (isAI) {
          params.key = response.data.file_info[0].key;
          instance.post('/v1/upload_loc', params, config)
            .then((res) => {
              // console.log(466, res.data);
              response.data.file_info[0] = { ...response.data.file_info[0], localFile: res.data.file_info }
              resolve(response.data);
            })
            .catch((e) => {
              console.error(e);
            });
        }
        else
          resolve(response.data); // Resolve the promise with the data
      })
      .catch((error) => {
        console.error(error);
        if (typeof callback === 'function') {
          callback(error); // Call the callback with the error
        }
        reject(error); // Reject the promise with the error
      });
  });
};


export const voip_send_msg = async (emit, data, save = true) => {
  // console.log('API:send:',emit,data)
  data.CLIENT_BASE_URL = window.location.hostname;
  data.xmpp_type = emit;
  // if(data.newtag_tag_data) delete data.newtag_tag_data;
  // if (data.xmpp_type === 'send_message' || data.xmpp_type === 'send_reply_msg') {
  //     if (data.msg_id && save === true) {
  //         await idb.collection('messages').add(data);
  //         await IDB_insert('message', data);
  //         for(let i of data.all_attachment){
  //             await IDB_insert('file', i);
  //         }
  //         // var msgs = await IDB_get('message',{conversation_id: data.conversation_id});
  //         // console.log(msgs);

  //     }
  // }
  const token = localStorage.getItem('token');
  let instance = axios.create({
    baseURL: baseURL,
    // timeout: 5000,
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return new Promise((resolve, reject) => {
    instance.post('/v1/' + emit, data).then(async function (response) {
      // console.log('API:recv:',emit,response);
      // if (data.xmpp_type === 'send_message' || data.xmpp_type === 'send_reply_msg') {
      //     try {
      //         await idb.collection('messages').doc({ msg_id: response.data.data.msg_id }).delete();
      //     } catch (err) {
      //         await idb.collection('messages').delete();
      //         console.log(err);
      //     }


      // }
      resolve(response.data);
    })
      .catch(function (error) {
        console.log('xmpp:api:err:', emit, error);
        // if(props) props.setPopup({type:'xmpp_no_connection', data: true});
        // handle error
        // handleError(error, reject);
      })
  })
}

export const openCallWindow = async (conversation_id, jwt_token, get_me) => {
  console.log("openCallWindow", get_me)
  var ww = window.screen.availWidth * 0.8;
  var hh = window.screen.availHeight * 0.8;
  var left = (window.screen.width / 2) - (ww / 2);
  var top = (window.screen.height / 2) - (hh / 2);

  window.win_voip = window.open("", 'calling_' + conversation_id, "width=" + ww + ",height=" + hh + ', top=' + top + ', left=' + left);
  // Listen for the "ready" event from the child
  voip_channel.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'ready') {
      console.log("Child window is ready, sending token...");
      voip_channel.postMessage({
        type: 'jitsi_token_pass',
        jwt_token,
        get_me
      });
    }
  });
  // console.log('win_voip', win_voip.location.href)
  if (conversation_id && window.win_voip && window.win_voip.location) {
    if (window.win_voip.location.href === 'about:blank') window.win_voip.location.href = '/call/' + conversation_id;
    return window.win_voip;
  }
  // clean_timer_user();
}


export const xmpp_register_user = (params) => {
  // console.log("🚀 ~ params:", params)
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    let instance = axios.create({
      baseURL: baseURL,
      // timeout: 5000,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    instance.post('/v1/xmpp_register_user', params)
      .then(function (response) {
        console.log("xmpp:api:", response.data)
        resolve(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        reject(error)
      })

  })
}
export const silverware_pos = (params) => {
  // console.log("🚀 ~ params:", params)
  // debugger;
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem('token');
    let instance = axios.create({
      baseURL: baseURL,
      // timeout: 5000,
      headers: { 'Authorization': `Bearer ${token}` }
    });
    instance.post('/v1/silverware', params)
      .then(function (response) {
        console.log("xmpp:api:", response.data)
        resolve(response.data)
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        reject(error)
      })

  })
}

export function getXmppToken() {
  
  let xmpp_token = localStorage.getItem("xmpp_tokenid");
  return xmpp_token;
}

export const setCookie = (cname, cvalue, exdays) => {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = (cname) => {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export const logout = () => {
  localStorage.clear();
  setCookie('device_id', "", 365);
  setCookie('incognito_device_id', "", 365);
  window.location.href = "/login";
}

export const Get_My_Counter = (data, type, conversation_id, msg_id) => {
  // console.log(366,type, conversation_id, msg_id)
  let counter = 0;
  if (data) {
    switch (type) {
      case 'scnu': //Single conversation normal unread
        // console.log(371,conversation_id)
        let c = data.conversations.filter(v => v.conversation_id === conversation_id);
        if (c.length > 0) {
          counter = c[0].urmsg;
        }

        break;
      case 'scru': //Single conversation Reply unread
        let c1 = data.conversations.filter(v => v.conversation_id === conversation_id);
        if (c1.length > 0) {
          counter = c1[0].urreply;
        }

        break;
      case 'smru': //Single message Reply unread
        let c2 = data.conversations.filter(v => v.conversation_id === conversation_id);
        // console.log(387, c2)
        if (c2.length > 0) {
          if (c2[0].msgids && c2[0].msgids.length > 0) {
            // console.log(388, c2[0].msgids)
            let m = c2[0].msgids.filter(v => v.msgid === msg_id);
            if (m.length > 0) {
              counter = m[0].unread;
            }
          }
        }

        break;
      case 'total_unread_msg':
        counter = data.total_unread_msg;

        break;
      case 'total_unread_reply':
        counter = data.total_unread_reply;

        break;
      default:
        break;
    }
  }
  if (counter > 0 || type === 'smru') {

    return counter
  } else {
    return ''
  }
}

export const getMessageWithSeparator = (messageDate) => {
  const today = moment().startOf('day');
  const yesterday = moment().subtract(1, 'day').startOf('day');
  let separator = '';
  if (isSameDay(messageDate, today)) {
    separator = 'Today';
  } else if (isSameDay(messageDate, yesterday)) {
    separator = 'Yesterday';
  } else {
    separator = formatDate(messageDate);
  }

  return separator;
}

function isSameDay(date1, date2) {
  return moment(date1).isSame(moment(date2), 'day');
}

function formatDate(date) {
  return moment(date).format('MMM DD, YYYY');
}

export const GET_SEPERATOR = (lstmsg, currentmsg) => {
  let thisMsgsep = ''
  if (lstmsg) {
    let s = getMessageWithSeparator(lstmsg.created_at);
    let l = getMessageWithSeparator(currentmsg.created_at);
    if (s !== l) {
      thisMsgsep = l
    }

  } else {
    thisMsgsep = getMessageWithSeparator(currentmsg.created_at);
  }
  return thisMsgsep;
}
export const IsGroupMsg = (lstmsg, currentmsg) => {
  let is_groupMsg = false
  if (lstmsg) {
    if ((lstmsg.sender === currentmsg.sender)) {
      let s = getMessageWithSeparator(lstmsg.created_at);
      let l = getMessageWithSeparator(currentmsg.created_at);
      if (s === l) {
        if ((lstmsg.is_secret || lstmsg.msg_type?.includes('task') || lstmsg.msg_type?.includes('aiReplyReq')) || (currentmsg.is_secret || currentmsg.msg_type?.includes('task') || currentmsg.msg_type?.includes('aiReplyReq'))) {
          is_groupMsg = false;
        } else {
          is_groupMsg = true;
        }
      }
    }
  }

  return is_groupMsg;

}

export const getONLYUSERSDATA = (users, id, get) => {
  if (Array.isArray(id)) {
    if (get === 'all') {
      return users.filter(fu => id.indexOf(fu.id) > -1).map(u => ({
        name: `${u.firstname} ${u.lastname}`,
        id: u.id,
        img: u.img,
        fnln: u.fnln
      }))
    } else {
      let u = users.filter(fu => id.indexOf(fu.id) > -1).map(u => ({
        name: `${u.firstname} ${u.lastname}`,
        id: u.id,
        img: u.img,
        fnln: u.fnln
      }))
      // console.log(489, u)
      return u.map(v => v[get]);
    }

  } else {
    if (get === 'all') {
      return users.filter(fu => id === fu.id).map(u => ({
        name: `${u.firstname} ${u.lastname}`,
        id: u.id,
        img: u.img,
        fnln: u.fnln
      }))[0]
    } else {
      let u = users.filter(fu => id === fu.id).map(u => ({
        name: `${u.firstname} ${u.lastname}`,
        id: u.id,
        img: u.img,
        fnln: u.fnln
      }))[0];
      // console.log("🚀 ~ u ~ u:", u, u?.[get])
      if (u?.[get]) {
        return u[get]
      } else {
        return 'System'
      }

    }
  }

}

export const scrollToBottom = (id) => {
  const messageContainer = document.getElementById(id);
  // console.log("🚀 ~ scrollToBottom ~ messageContainer:", messageContainer.scrollHeight)
  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight;
  }
};

export const ring_calling = async ({ get_me, user_id, company_id, conversation_id, conversation_type, convname, participants_all, arr_participants, call_link, call_option, set_callMembers, GroupPopupToggle, setGroupCallPopup, fetchCalling, getCallingAccept }) => {
  // debugger
  var ring_data = {
    user_id: user_id,
    conversation_id: conversation_id,
    company_id: company_id,
    conversation_type: conversation_type,
    arr_participants: arr_participants, // selected ( group call) , all ( personal call)
    participants_all: participants_all, // all members of conversation
    convname: convname,
    call_link: call_link,
    call_option: call_option,
    token: getXmppToken(),
  }

  let apires = await fetchCalling({
    variables: ring_data,
    fetchPolicy: 'network-only', // Ensures it fetches fresh data from the server
  });
  let cb_data = apires?.data?.jitsi_ring_calling;
  console.log("api:fetchCalling", cb_data);
  // let cb_data = await voip_send_msg('jitsi_ring_calling', ring_data);
  if (cb_data.status === true) {
    localStorage.setItem("jitsi_token", cb_data.jwt_token);
    openCallWindow(conversation_id, cb_data.jwt_token, get_me);

    if (cb_data.busy_conv) {
      let apires = await getCallingAccept({
        variables: {
          user_id: user_id,
          conversation_id: conversation_id,
          token: getXmppToken(),
          type: 'join',
          device_type: 'web'
        },
        fetchPolicy: 'network-only',
      });

      let cb_data = apires?.data?.jitsi_call_accept;
      if (cb_data.status === true) {
        localStorage.setItem("jitsi_token", cb_data.jwt_token);
      }

    }
  }
  else {
    // if (cb_data.msg === 'plan_upgrade') {
    //     if (props) { return props.setPopup({ type: 'upgradePlan', data: true }); }
    // } else 
    if (cb_data.msg === 'list') {
      setGroupCallPopup(true)
    }

    else {
      alert(cb_data.msg);

    }

  }
  return cb_data;
}

export const setCallingUrl = (data, setCallingURL) => {
  return new Promise(async (resolve, reject) => {
    let apires = await setCallingURL({
      variables: data,
      fetchPolicy: 'network-only', // Ensures it fetches fresh data from the server
    });
    let cb_data = apires?.data?.set_url_calling;
    // console.log("setCallingURL", cb_data);
    // let cb_data = await voip_send_msg('setCallingUrl', data);
    resolve({ data: cb_data });
  })
}
export const getCallingUrl = (data, getCallingURL) => {
  return new Promise(async (resolve, reject) => {
    let apires = await getCallingURL({
      variables: data,
      fetchPolicy: 'network-only', // Ensures it fetches fresh data from the server
    });
    let cb_data = apires?.data?.get_url_calling;
    // console.log("setCallingURL", cb_data);
    // let cb_data = await voip_send_msg('setCallingUrl', data);
    resolve({ data: cb_data });

    // const token = localStorage.getItem('token');
    // let instance = axios.create({
    //   baseURL: baseURL,
    //   // timeout: 5000,
    //   headers: { 'Authorization': `Bearer ${token}` }
    // });
    // instance.post('/v1/getCallingUrl', data, {
    // }).then(function (response) {
    //   console.log(22, response)
    //   resolve(response);
    // }).catch(function (error) {
    //     console.log(223, error)
    //     // handle error
    //     reject(error);
    //   })
  })
}

// Utility function for API calls
const apiCall = async (url, method, headers, body) => {
  try {
    const response = await fetch(url, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Call Error: ${error.message}`);
    throw error;
  }
};

// Generate Image using DALL-E
export const generateImage = async (qns) => {
  const url = "https://api.openai.com/v1/images/generations";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  };
  const body = {
    model: "dall-e-3",
    prompt: qns,
    n: 1,
    size: "1024x1024",
    // response_format: "b64_json",
  };

  const data = await apiCall(url, "POST", headers, body);
  // return `data:image/png;base64,${data.data[0].b64_json}`;

  // saveAIResInDB({ ...commonFields, ans: `<div class="genarated_img_wraper"><img src="${data.data[0].url}" class="genarated_img" /></div>` });
  return data.data[0].url;
};

// Generate Text using GPT
export const generateText = async (systemPrompt, userPrompt) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  };
  const body = {
    model: "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "You are a decision-making assistant. Determine if a question explicitly requires a visual representation, such as an image, chart, or diagram, to answer it effectively. If it does, respond with 'needs image'. If the question is only about text or concepts that do not require visualization, respond with 'does not need image'. Do not consider the mention of 'image' or similar words alone as a requirement for a visual representation."
      },
      {
        "role": "user",
        "content": "What is the capital of France?"
      },
      {
        "role": "assistant",
        "content": "does not need image"
      },
      {
        "role": "user",
        "content": "Draw a diagram of a solar system."
      },
      {
        "role": "assistant",
        "content": "needs image"
      },
      {
        "role": "user",
        "content": "Do you have the capability to draw an image?"
      },
      {
        "role": "assistant",
        "content": "does not need image"
      },
      {
        "role": "user",
        "content": userPrompt
      }
    ],
  };

  const data = await apiCall(url, "POST", headers, body);
  console.log(173, data)
  return data.choices[0].message.content;
};

export const generateTextStream = async (commonFields, qns, onStreamUpdate) => {
  const url = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
  };
  const body = {
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `- Respond **directly** to the user's query **without any introductions or unnecessary text**. Format all responses in clean and readable HTML using tags such as <p>, <div>, <ol>, <ul>, <li>, <strong>, and <i>. Wrap drafts, templates, or code snippets inside <pre><code> tags for clarity.`
      },
      { role: "user", content: qns },
    ],
    stream: true,
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let content = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((line) => line.trim() !== "");

    for (const line of lines) {
      if (line.startsWith("data:")) {
        const jsonData = line.replace("data: ", "");
        if (jsonData === "[DONE]") break;

        try {
          const parsed = JSON.parse(jsonData);
          const text = parsed.choices[0]?.delta?.content || "";
          content += text;

          if (onStreamUpdate) {
            onStreamUpdate(text, commonFields._id);
          }
        } catch (err) {
          console.error("Stream parsing error:", err);
        }
      }
    }
  }

  // saveAIResInDB({ ...commonFields, ans: content });
  return content;
};


export const isValidConvId = (conversationId) => {
  const uuidPattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidPattern.test(conversationId);
}

export const showVersionPopup = (restart_time, dispatch) => {
  //console.log('restart_time::',restart_time);
  // debugger;
  if (restart_time) window.server_ts = restart_time;
  else window.server_ts = 0;

  if (parseInt(localStorage.getItem('app_ts'))) {
    window.app_ts = parseInt(localStorage.getItem('app_ts'));
  } else {
    window.app_ts = new Date(localStorage.getItem('app_ts')).valueOf()
  }
  //

  if (window.app_ts === undefined || window.app_ts === null || window.app_ts === 'undefined' || window.app_ts === 'null') {
    localStorage.setItem('app_ts', window.server_ts);
    dispatch(setUpdateVersion('yes'));
    //console.log(`xmpp:ver_update:popup:${window.app_ts}`);
  } else {
    window.diff_ts = (parseInt(window.server_ts) - parseInt(window.app_ts));
    if (window.diff_ts > 0) {
      dispatch(setUpdateVersion('yes'));
      window.app_ts = window.server_ts;
      localStorage.setItem('app_ts', window.server_ts);
      //console.log('restart_time::up::',restart_time, window.diff_ts);
    }
  }
}