
/* eslint-disable react-hooks/exhaustive-deps */
// import firebase from 'firebase';
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import CryptoJS from "crypto-js";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getXmppToken, modifyMyMsg, scrollToBottom, getONLYUSERSDATA, logout, showVersionPopup } from './Common';
import { return_data } from '../config/config';
import { add_new_room, closeConversation, file_share_link_create, removeAttachment, removeMessage, sendOneMessage, setOneReplyData, set_online_users, set_callringpopup, setMuteDataOnProps, set_pin_unpin, updateArchiveConv, updateMessageStar, updateOneMsg, updateRoom, updateMsgCounter, updateFlagCounter, set_change_link_data, setMergeMsg, update_CountersData, set_kick_out_data, setBooleanState, set_conv_calling_data } from '../redux/message';
import { removeDiscussionAttachment, save_update_checklist, checklist_item_delete, set_deleted_task, set_new_task, update_active_discussion, updateDiscussionMsgStar, updateOneDiscussionMsg } from '../redux/taskSlice';
import { update_report_list } from '../redux/eodSlice';
import { actionTagThunk } from '../redux/actionThunk';
// import { setUpdateVersion } from '../redux/message';
import { useLazyQuery } from '@apollo/client';
import { XMPP_REGISTER_USER, FIREBASE_REGISTER_USER } from '../Utils/GraphqlQueries';
const { client, xml } = require("@xmpp/client");


const mykey = 'D1583ED51EEB8E58F2D3317F4839A';

var xmpp = {};
if (typeof window !== 'undefined') {
    window.xmpp_client = xmpp;
    window.db_unix = 0;
}
var mute_all_status = true;
// var prop_logindata = null;
let all_conversations = [];
// var xmpp_list = {};
const audio_tone = typeof Audio !== "undefined" ? new Audio('https://wfss001.freeli.io/common/short_tone.mp3') : null

var xmpp_domain = return_data.xmpp_domain;


if (typeof window !== 'undefined') {
    if (!localStorage.getItem("xmpp_resource")) {
        localStorage.setItem("xmpp_resource", String(Date.now()))
    }
    window.xmpp_resource = localStorage.getItem("xmpp_resource");
    localStorage.setItem('reload_time', String(Date.now()));
}


// var firebaseConfig = { // freeli
//     apiKey: "AIzaSyClXPwwypS8uip7-9iElpofT2yQv33NmRc",
//     authDomain: "workfreeli.firebaseapp.com",
//     projectId: "workfreeli",
//     storageBucket: "workfreeli.appspot.com",
//     messagingSenderId: "69957602774",
//     appId: "1:69957602774:web:72962b1df6fdeb995e2877",
//     measurementId: "G-KB9S5QSFL2"
// };

const firebaseConfig = {
    apiKey: "AIzaSyAP4WHf0JzOLE3yGbobxnrY6x4qA8qxhtQ",
    authDomain: "workfreeliv2.firebaseapp.com",
    projectId: "workfreeliv2",
    storageBucket: "workfreeliv2.appspot.com",
    messagingSenderId: "993552128631",
    appId: "1:993552128631:web:8e4f91effdd397851a8472",
    measurementId: "G-ZFZ9FD82JN"
};

var sw_registration;

function invokeServiceWorkerUpdateFlow(sw_registration = false) {
    if (sw_registration && sw_registration.waiting) {
        sw_registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
}

function soundNotification(props, res) {

    if (all_conversations.length === 0) return;
    let user_id = props.user.id;
    if (user_id !== res.sender && !mute_all_status) {
        let conversations = all_conversations.filter((i) => i.conversation_id === res.conversation_id);
        // let unpin_conv = prop_logindata.unpin_convs.filter((i) => i.conversation_id === res.conversation_id)

        if (conversations.length) {
            if (conversations[0].has_mute.indexOf(user_id) > -1) {
                return
            }
        }
        // if (unpin_conv.length) {
        //     if (unpin_conv[0].has_mute.indexOf(user_id) > -1) {
        //         return
        //     }
        // }
        // if(document.querySelector(`#conv_li_${res.conversation_id} .conv_list_mute`))  return;
        if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(function (rstream) {
                audio_tone.play();
                rstream.getTracks().forEach(function (track) { track.stop(); });
            });
        } else {
            audio_tone.play();
        }
    }
}



function SocketClient(props) {
    const user = props.user;
    const all_users = props.users;
    all_conversations = useSelector(state => state.message.conversations)
    // const active_conversation = useSelector(state => state.message.active_conversation)
    // prop_logindata = props.logindata;
    const dispatch = useDispatch();
    // const filter = useSelector(state => state.root.filter)
    const [xmppRegisterUser] = useLazyQuery(XMPP_REGISTER_USER);
    const [firebaseRegisterUser] = useLazyQuery(FIREBASE_REGISTER_USER);

    const xmpp_register = async (user_id, user_fullname) => {
        if (xmpp[user_id]) {
            await xmpp[user_id].stop();
            delete xmpp[user_id];
        }
        // debugger;

        let xmpp_res = await xmppRegisterUser({
            variables: {
                user_id: user_id,
                token: getXmppToken()
            },
            fetchPolicy: 'network-only', // Ensures it fetches fresh data from the server
        });

        let response = xmpp_res?.data?.xmpp_register_user;
        console.log('xmpp:api', response);
        if (response.status) {
            dispatch(set_online_users(response.online_user_lists));
            xmpp[user_id] = client({
                service: "wss://" + xmpp_domain + ":5443/ws",
                domain: xmpp_domain,
                // resource: getXmppToken(),
                username: response.xmpp_user,
                password: "a123456",
            });
            xmpp[user_id].on('stanza', async stanza => {
                if (stanza.is('message')) {
                    if (!stanza.getChild("body")) return;
                    var data = JSON.parse(stanza.getChild("body").text());
                    // console.log("xmpp_origin:", window.location.hostname, data.CLIENT_BASE_URL);

                    // if (data.xmpp_type !== 'online_user_lists' && data.xmpp_type !== 'xmpp_reconnect_client') {
                    console.log(`xmpp:recv:${data.xmpp_type}`, data);
                    // }

                    if (data.xmpp_type === 'update_client_version' || data.xmpp_type.includes('jitsi')) {
                        // if(data.origin && data.origin !== '*') {
                        if (window.location.hostname !== data.CLIENT_BASE_URL) {
                            // console.log('xmpp:reject_origin',data.xmpp_type, data.origin );
                            return;
                        }
                        // }
                    }



                    switch (data.xmpp_type) {
                        case 'new_message':
                            if (data.sender !== user.id || data.msg_type === 'call' || data.msg_type?.includes('task_msg') || data.msg_type?.includes('log_notify')) {
                                let res_msg = await modifyMyMsg([data])
                                dispatch(sendOneMessage(res_msg[0]))
                                soundNotification(props, res_msg[0]);
                                setTimeout(() => {
                                    scrollToBottom('main_msg_scroll_div')
                                }, 100);
                            }

                            break;
                        case 'new_discussion':

                            let res_msg = await modifyMyMsg([data])
                            // console.log("🚀 ~ xmpp_register_user ~ res_msg:", res_msg)
                            dispatch(update_active_discussion(res_msg[0]))
                            soundNotification(props, res_msg[0]);

                            break;
                        case 'logout_from_all':
                            // console.log('logout_from_all', data);
                            logout();
                            break;
                        case 'edit_message': {
                            let res_msg = await modifyMyMsg([data])
                            dispatch(updateOneMsg({ field: 'edit_history', call_duration: data.call_duration, msg_id: data.msg_id, conversation_id: data.conversation_id, is_reply_msg: data.is_reply_msg, edit_history: res_msg[0].edit_history, msg_body: res_msg[0].msg_body, msg: res_msg[0], url_base_title: res_msg[0].url_base_title }));
                        }
                            break;
                        case 'file_url_title':
                            dispatch(set_change_link_data(data))
                            break;
                        case 'merge_msg':
                            dispatch(setMergeMsg(data))
                            break;
                        case 'flag_counter':
                            dispatch(updateFlagCounter(data))
                            break;
                        case 'new_reply_message': {
                            let res_msg = await modifyMyMsg([data])
                            dispatch(setOneReplyData(res_msg[0]));
                            soundNotification(props, res_msg[0]);
                            setTimeout(() => {
                                scrollToBottom('replyMsgFullContainer')
                            }, 100);
                        }
                            break;
                        case 'room_archive':
                            dispatch(updateArchiveConv(data));
                            break;
                        case 'close_room':
                            dispatch(closeConversation(data));
                            break;
                        case 'edit_reply_message': {
                            let res_msg = await modifyMyMsg([data])
                            dispatch(updateOneMsg({ field: 'edit_history', msg_id: data.msg_id, conversation_id: data.conversation_id, is_reply_msg: data.is_reply_msg, msg_body: res_msg[0].msg_body, edit_history: res_msg[0].edit_history, msg: res_msg[0] }));
                        }
                            break;
                        case 'delete_msg':
                            const messagesToDelete = data.other_msg?.length ? [...data.other_msg, { msg_id: data.msg_id }] : [{ msg_id: data.msg_id }];

                            messagesToDelete.forEach((msg) => {
                                dispatch(updateOneDiscussionMsg({
                                    field: msg.msg_id === data.msg_id ? 'full_delete' : 'has_delete',
                                    msg_id: msg.msg_id,
                                    conversation_id: data.conversation_id,
                                    is_reply_msg: data.is_reply_msg,
                                    delete_type: data.delete_type,
                                    user_id: data.user_id,
                                    reply_for_msgid: data.reply_for_msgid,
                                }));
                                dispatch(updateOneMsg({
                                    field: msg.msg_id === data.msg_id ? 'full_delete' : 'has_delete',
                                    msg_id: msg.msg_id,
                                    conversation_id: data.conversation_id,
                                    is_reply_msg: data.is_reply_msg,
                                    delete_type: data.delete_type,
                                    user_id: data.user_id,
                                    reply_for_msgid: data.reply_for_msgid,
                                    task_id: data.task_id,
                                }));
                            });

                            if (data.file_id) {
                                dispatch(removeAttachment(data));
                            }
                            break;
                        case 'edit_private_participants':
                            // {
                            await modifyMyMsg([data]);

                            if (data.secret_user.includes(user_id) || data.sender === user_id) {
                                const fieldsToUpdate = [
                                    { field: 'secret_user_name', value: getONLYUSERSDATA(all_users, data.secret_user, 'all') },
                                    { field: 'secret_user_details', value: getONLYUSERSDATA(all_users, data.secret_user, 'all') },
                                    { field: 'secret_user', value: data.secret_user },
                                    { field: 'is_secret', value: data.is_secret },
                                ];

                                fieldsToUpdate.forEach(({ field, value }) => {
                                    dispatch(updateOneMsg({
                                        field,
                                        data,
                                        msg_id: data.msg_id,
                                        conversation_id: data.conversation_id,
                                        is_reply_msg: data.is_reply_msg,
                                        [field]: value,
                                    }));
                                });
                            } else {
                                dispatch(removeMessage({ msg_id: data.msg_id }));
                            }
                            dispatch(set_kick_out_data(null));
                            // }
                            break
                        case 'kick_out':
                            if (data.kickOut_type !== 'conversation') {
                                dispatch(removeMessage({ msg_id: data.msg_id }));
                            }
                            dispatch(set_kick_out_data(data));
                            break;
                        case 'add_reac_emoji':
                            dispatch(updateOneMsg({ field: 'has_emoji', msg_id: data.msg_id, conversation_id: data.conversation_id, is_reply_msg: data.is_reply_msg, has_emoji: data.result.has_emoji }));
                            break;
                        case 'flag_unflag':
                            // dispatch(updateOneMsg({ field: 'has_flagged', msg_id: data.data.msg_id, conversation_id: data.data.conversation_id, is_reply_msg: 'no', has_flagged: data.data.is_add }));
                            break;
                        case 'new_room':
                            dispatch(add_new_room(data))
                            break;
                        case 'update_room':
                            dispatch(updateRoom(data));
                            break;
                        //     case 'kick_out':
                        //         // props.kickOutRoom(data);
                        //         break;
                        //     case 'someone_typing':

                        //         if (window.location.pathname !== '/connect') {

                        //             // props.setTypeIndicator(data);
                        //         }
                        //         break;
                        //     case "read_status_notification":
                        //         // props.updateUnreadNoficationCounter(data.read)
                        //         break;
                        case "read_status_msg":
                            dispatch(updateMsgCounter(data))
                            break;
                        //     case "msg_task":
                        //         if (window.location.pathname !== '/connect') {

                        //             // modifyMyMsg(data.msg, function (res) {
                        //             //     props.convertToTask(res)
                        //             // })
                        //         }
                        //         break;
                        //     case 'new_notification':
                        //         // if (props.path.indexOf('notification') > -1) {
                        //         //     props.addNewNotificaiton(data)
                        //         // } else {
                        //         //     props.notificationCounterSet(data)
                        //         // }

                        //         break;
                        case 'pin_unpin':
                            dispatch(set_pin_unpin(data))
                            break;
                        case 'mute_conversation':
                            if (data.type === 'add' || data.type === 'update') {
                                dispatch(setMuteDataOnProps({ type: data.type, data: data.mute_data, conversation_id: data.conversation_id, active: 'yes' }))
                            } else {
                                dispatch(setMuteDataOnProps({ type: data.type, conversation_id: data.conversation_id, active: 'yes' }))
                            }
                            break;
                        //     case 'delete_room':
                        //         // if (props.logindata.active_conv.details.conversation_id === data.conversation_id) {
                        //         //     props.setRedirectConv(props.logindata.user.id);
                        //         // }
                        //         // props.deleteRoom(data.conversation_id);

                        //         break;
                        case 'add_remove_tag_into_msg':
                            // dispatch(updateMsgTag(data))
                            dispatch(actionTagThunk(data))
                            break;
                        case 'star_file':
                            dispatch(updateMessageStar(data))
                            dispatch(updateDiscussionMsgStar(data))

                            break;
                        case 'delete_link':
                            // props.deleteMessageLink(data)
                            break;
                        case 'delete_one_file':
                            dispatch(removeDiscussionAttachment(data))
                            dispatch(removeAttachment(data));
                            break;
                        case 'file_share_link_create':
                            dispatch(file_share_link_create(data));

                            break;
                        case 'file_share_link_remove':
                            dispatch(file_share_link_create(data));

                            break;
                        //     case 'update_my_profile':
                        //         // props.updateMyProfile(data)

                        //         break;
                        //     case 'remove_profile_img':
                        //         // props.updateMyProfile(data)

                        //         break;
                        case 'online_user_lists':
                            dispatch(set_online_users(data.list))
                            break;
                        case 'new_task':
                            dispatch(set_new_task(data))
                            break;
                        case 'task_delete':
                            dispatch(set_deleted_task(data))
                            break;
                        case 'total_task_counter':
                            dispatch(update_CountersData(data))
                            break;
                        case 'save_update_checklist':
                            dispatch(save_update_checklist(data))
                            break;
                        case 'checklist_item_delete':
                            dispatch(checklist_item_delete(data))
                            break;
                        case 'generating_image':
                            if (props.user.id === data.sender) {
                                dispatch(setBooleanState({ data: true, key: 'generating_image' }))
                            }
                            break;
                        case 'jitsi_ring_send':
                            // if (Date.now() > parseInt(data.xmpp_unix) + 60000) return;

                            dispatch(set_callringpopup({
                                status: true,
                                user_id: user_id,
                                user_fullname: user_fullname,
                                caller_id: data.user_id, // caller 
                                caller_name: data.user_fullname,
                                caller_img: data.user_img,
                                conversation_id: data.conversation_id,
                                ring_index: data.ring_index,
                                user_busy: data.user_busy,
                                call_merge: data.call_merge,
                                jwt_token: data.jwt_token


                            }));
                            break;

                        case 'jitsi_send_hangup':
                            dispatch(set_callringpopup({ status: false }));
                            // dispatch({ type: 'set_callringpopup', payload: { status: false } });
                            // dispatch({ type: 'busy_call_msg', payload: false });
                            // props.setPopup({ type: 'voipHoldMute', data: false });
                            // props.setPopup({ type: 'mergeconvpopup', data: false });
                            // debugger
                            if (window.win_voip && !window.win_voip.closed) {
                                const winUrl = window.win_voip.location.href;
                                if (winUrl.includes(data.conversation_id)) {
                                    window.win_voip.close();
                                    window.win_voip = null; // Clear reference
                                }

                                // window.win_voip.postMessage({ type: "CALL_REJECTED", data }, "*");

                            }
                            if (window.timer1) {
                                clearTimeout(window.timer1);
                            }
                            break;

                        case "eod_report_submit":
                            // debugger
                            dispatch(update_report_list(data))

                            // if (data.status !== "REOPEN") {
                            //     props.set_report_total_update(true);
                            // }
                            break;
                        //     case 'jitsi_send_popup':

                        //         // dispatch({
                        //         //     type: 'set_call_status_popup',
                        //         //     payload: {
                        //         //         status: true,
                        //         //         msg_body: data.msg_body,
                        //         //         conversation_id: data.conversation_id,
                        //         //         company_id: data.company_id,
                        //         //         participants: data.participants

                        //         //     }
                        //         // });

                        //         break;

                        //     case 'jitsi_open_hold':
                        //         // openCallWindow(data.conversation_id, 'calling_' + data.conversation_id)
                        //         break;

                        //     case 'jitsi_send_accept':

                        //         // clearTimeout(window.timer1); //console.log('call:timer:clear:',window.timer1);
                        //         // dispatch({ type: 'set_callringpopup', payload: { status: false } });
                        //         // dispatch({ type: 'busy_call_msg', payload: false });
                        //         // props.setPopup({ type: 'voipHoldMute', data: false });
                        //         // props.setPopup({ type: 'mergeconvpopup', data: false });
                        //         break;

                        //     case 'jitsi_user_accept': // connecting user
                        //         console.log('voip:jitsi_user_accept', data);
                        //         break;

                        //     case 'jitsi_ring_status': // ring status
                        //         break;

                        //     case 'jitsi_conv_start': // join icon

                        //         // if (document.querySelector(`#conv_li_${data.conversation_id}`)) document.querySelector(`#conv_li_${data.conversation_id}`).classList.add("join_call");
                        //         break;

                        //     case 'jitsi_conv_end': // remove join + show duration

                        //         // if (document.querySelector(`#conv_li_${data.conversation_id}`)) document.querySelector(`#conv_li_${data.conversation_id}`).classList.remove("join_call");
                        //         break;

                        case 'jitsi_busy_status': // profile call icon
                            if (data.voip_busy_conv) dispatch(set_conv_calling_data(data.voip_busy_conv));
                            break;
                        case 'update_client_version': // profile call icon
                            showVersionPopup(data.restart_time, dispatch);
                            break;
                        default:
                            // console.log("strange");
                            break;
                    }
                }
            });
            xmpp[user_id].on('error', err => {
                console.error(err);
            });
            xmpp[user_id].on('online', async address => {
                // debugger;
                await xmpp[user_id].send(xml('presence'));
                // await xmpp[user_id].send(xml('presence', { to: 'admin@bdquecdn01.freeli.io' }));

                // props.setPopup({ type: 'xmpp_online', data: true });
            });
            xmpp[user_id].on("status", (status) => {
                // console.log('xmpp:status', status);
                // if (status === 'open') {
                //     props.setPopup({ type: 'xmpp_online', data: true });
                // } else {
                //     props.setPopup({ type: 'xmpp_online', data: false });
                // }
                // if (status === 'disconnecting' || status === 'closing') {
                //     // voip_send_msg('xmpp_close_user',{user_id: user_id});

                // }
            });
            xmpp[user_id].on('offline', () => {
                // console.log('xmpp:offline')
            });
            xmpp[user_id].start().catch(console.error)
        } else {
            // setTimeout(()=>{
            xmpp_register(user_id, user_fullname)
            // }, 10000);

        }
    }

    async function updateServiceWorker(user_id, user_fullname, user_email) {

        if ('serviceWorker' in navigator) {
            sw_registration = await navigator.serviceWorker.register(`/service_worker.js?reload_time=${localStorage.getItem('reload_time')}`, { scope: "/" });
            invokeServiceWorkerUpdateFlow(sw_registration);
            sw_registration.addEventListener('updatefound', () => {
                // console.log('sw:updating1.......');
                if (sw_registration.installing) {
                    sw_registration.installing.addEventListener('statechange', () => {
                        if (sw_registration.waiting) {
                            if (navigator.serviceWorker.controller) {
                                invokeServiceWorkerUpdateFlow(sw_registration);
                            } else { // otherwise it's the first install, claim clients
                                invokeServiceWorkerUpdateFlow(sw_registration);
                            }
                        }
                    });
                    navigator.serviceWorker.addEventListener('controllerchange', () => {
                        invokeServiceWorkerUpdateFlow(sw_registration)
                    });
                }
            });

            const app = initializeApp(firebaseConfig);
            const messaging = getMessaging(app);

            try {
                // ✅ Request Notification Permission using Browser API (not Firebase)
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    throw new Error("Notification permission denied");
                }
                console.log("Firebase: Notification permission granted.");

                // ✅ Get Firebase Token (with service worker)
                const firebase_token = await getToken(messaging, { serviceWorkerRegistration: sw_registration });

                console.log("Firebase Token:", firebase_token);
                window.firebase_token = firebase_token;
                localStorage.setItem("firebase_token", firebase_token);

                firebaseRegisterUser({
                    variables: {
                        user_id: user_id,
                        firebase_token: firebase_token,
                        device: 'web'
                    },
                    fetchPolicy: 'network-only', // Ensures it fetches fresh data from the server
                });

                onMessage(messaging, (payload) => {
                    console.log('firebase:foreground:', payload);
                    if (payload.data.fcm_type === "jitsi_ring_send") {
                        // if (Date.now() > parseInt(payload.data.xmpp_unix) + 60000) return;
                        // Push.Permission.request();
                        let notificationTitle = payload.data.user_fullname + " is calling you...";
                        let notificationOptions = {
                            // body: '',
                            body: 'Click to receive the call',
                            // icon: file_server+'profile-pic/Photos/'+payload.data.user_img,
                            data: {
                                conversation_id: payload.data.conversation_id,
                                receiver_id: payload.data.receiver_id,
                                ring_index: payload.data.ring_index,
                                BASE_URL: payload.data.BASE_URL,
                                origin: payload.data.origin
                            }
                            // requireInteraction: true,

                        };
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(notificationTitle, notificationOptions);
                        });


                    } else if (payload.data.fcm_type === "new_message") {

                        if (payload.data.msg_type === 'call') return;
                        let notificationTitle = payload.data.msg_title;
                        payload.data.msg_body = CryptoJS.AES.decrypt(payload.data.msg_body_str, mykey).toString(CryptoJS.enc.Utf8).replace(/"/g, '');
                        let notificationOptions = {
                            // body: '',
                            body: payload.data.msg_body,
                            icon: payload.data.file_server + 'profile-pic/Photos/' + payload.data.sender_img,
                            data: {
                                origin: payload.data.origin
                            }
                            // requireInteraction: true,
                        };
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(notificationTitle, notificationOptions);
                        });
                    } else if (payload.data.fcm_type === "edit_message") {
                        if (payload.data.msg_type === 'call') return;
                        let notificationTitle = payload.data.msg_title;
                        payload.data.msg_body = CryptoJS.AES.decrypt(payload.data.msg_body_str, mykey).toString(CryptoJS.enc.Utf8).replace(/"/g, '');
                        let notificationOptions = {
                            // body: '',
                            body: payload.data.msg_body,
                            icon: payload.data.file_server + 'profile-pic/Photos/' + payload.data.sender_img,
                            data: {
                                origin: payload.data.origin
                            }
                            // requireInteraction: true,
                        };
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(notificationTitle, notificationOptions);
                        });
                    } else if (payload.data.fcm_type === "delete_msg") {
                        if (payload.data.msg_type === 'call') return;
                        var notificationTitle = payload.data.sendername + " has deleted a message.";
                        payload.data.msg_body = CryptoJS.AES.decrypt(payload.data.msg_body_str !== undefined ? payload.data.msg_body_str : '', mykey).toString(CryptoJS.enc.Utf8).replace(/"/g, '');
                        var notificationOptions = {
                            body: payload.data.msg_body,
                            icon: payload.data.file_server + 'profile-pic/Photos/' + payload.data.sender_img,
                            data: {
                                origin: payload.data.origin,
                                fcm_type: payload.data.fcm_type
                            }
                        };
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(notificationTitle, notificationOptions);
                        });
                    } else if (payload.data.fcm_type === "new_reply_message") {
                        let notificationTitle = payload.data.msg_title;
                        payload.data.msg_body = CryptoJS.AES.decrypt(payload.data.msg_body_str, mykey).toString(CryptoJS.enc.Utf8).replace(/"/g, '');
                        let notificationOptions = {
                            // body: '',
                            body: payload.data.msg_body,
                            icon: payload.data.file_server + 'profile-pic/Photos/' + payload.data.sender_img,
                            data: {
                                origin: payload.data.origin
                            }
                            // requireInteraction: true,

                        };
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(notificationTitle, notificationOptions);
                        });
                    } else if (payload.data.fcm_type === "edit_reply_message") {
                        let notificationTitle = payload.data.sendername + " has edited a reply message:";
                        payload.data.msg_body = CryptoJS.AES.decrypt(payload.data.msg_body_str, mykey).toString(CryptoJS.enc.Utf8).replace(/"/g, '');
                        let notificationOptions = {
                            // body: '',
                            body: payload.data.msg_body,
                            icon: payload.data.file_server + 'profile-pic/Photos/' + payload.data.sender_img,
                            data: {
                                origin: payload.data.origin
                            }
                            // requireInteraction: true,

                        };
                        navigator.serviceWorker.ready.then(registration => {
                            registration.showNotification(notificationTitle, notificationOptions);
                        });
                    }
                })

            } catch (error) {
                console.error("Error getting Firebase token:", error);
            }







        } else {
            // console.log('sw:Service workers are not supported.');
        }
    }
    useEffect(() => {
        if (user) {
            var user_id = user.id;
            var user_fullname = `${user.firstname} ${user.lastname}`;
            var user_email = user.email;
            xmpp_register(user_id, user_fullname);

            updateServiceWorker(user_id, user_fullname, user_email); // 1
        }

        if (window.location.protocol === 'https:' || window.location.hostname === 'localhost') {
            if (navigator?.mediaDevices) {
                navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                    .then(function (stream) {
                        // console.log('Accessed media devices successfully.');
                        stream.getTracks().forEach(track => track.stop()); // Stop tracks
                    })
                    .catch(function (error) {
                        // Handle specific error cases
                        if (error.name === 'NotFoundError') {
                            console.error('No media devices found.');
                        } else if (error.name === 'NotAllowedError') {
                            console.error('Permission denied to access media devices.');
                        } else {
                            console.error('Error accessing media devices:', error);
                        }
                    });
            } else {
                console.error('MediaDevices API not supported.');
            }
        }


        window.addEventListener('beforeunload', async (event) => {

            if (window.server_ts) {
                localStorage.setItem('app_ts', String(window.server_ts));
                // console.log(`xmpp:ver_update:updated`, localStorage.getItem('app_ts'));
            }

            for (let user_id in xmpp) {
                if (xmpp[user_id]) await xmpp[user_id].stop();
            }

        });

        window.addEventListener('online', function (e) {
            // alert('online');
            // voip_send_msg('xmpp_online_user', { user_id: user_id, token: getXmppToken(), device: 'web' });
        });

        // window.voip_channel = new BroadcastChannel('voip_channel');
        // window.voip_channel.onmessage = event => {
        //     if (event.data.type === 'jitsi_call_accept') {
        //         closeRingWindow(event.data.ring_index, dispatch, props);
        //     }
        // }

        localStorage.setItem('reload_time', String(Date.now()));

        return async () => {
            for (let user_id in xmpp) {
                if (xmpp[user_id]) await xmpp[user_id].stop();
            }
            // if (xmpp) xmpp.stop();
            // console.log('unmount commponent')
        }

    }, []);

    useEffect(() => {
        mute_all_status = user?.mute_all;
    }, [user?.mute_all]);

    // useEffect(() => {
    //     window.deferredPrompt = null;
    //     // navigator.getInstalledRelatedApps().then((relatedApps)=>{
    //     //     console.log('getInstalledRelatedApps',relatedApps);
    //     //     // if(relatedApps.length == 0){
    //     //     //     props.setPopup({type:'athScreen', data:true});
    //     //     // }
    //     // });

    //     // window.dispatchEvent(new Event('beforeinstallprompt'))

    //     window.addEventListener('beforeinstallprompt', (e) => {
    //         e.preventDefault()
    //         // console.log('beforeinstallprompt',e);
    //         window.deferredPrompt = e;

    //         props.setPopup({ type: 'athScreen', data: true });

    //     });

    //     window.addEventListener('appinstalled', (e) => {
    //         props.setPopup({ type: 'athScreen', data: false });
    //     });



    //     if (window.matchMedia('(display-mode: standalone)').matches) {
    //         console.log('display-mode is standalone');
    //     }

    //     // const interval = setInterval(() => {
    //     //     props.setTypeIndicator(null);
    //     // }, 3000);

    //     // return () => {
    //     //     clearInterval(interval);
    //     // }
    // }, []);

    // useEffect(() => {
    //     prop_logindata = props.logindata;
    // }, [props.logindata])

    return ('')
}

export default SocketClient