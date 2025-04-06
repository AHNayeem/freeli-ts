import { gql } from '@apollo/client';
import { msgEmoji, msgSchema, roomSchema } from './GraphqlQueries';
// Define mutation

const tag_schema = `
{
    title
    tag_id
    tagged_by
    company_id
    type
    tag_type
    tag_color
    conversation_ids
    connected_user_ids
    #my_use_count
    #user_use_count
    updated_by
    created_by_name
    created_at
    updated_at
    i_connected
    my_use_count_int
    use_count
    team_list
    team_list_name
    favourite
    disabled
}
`

export const loginMutation = gql`
mutation login($input: loginInput!) {
    login(input:$input) {
        token
        refresh_token
        message
        companies {
            company_id
            company_name
        }
    }
}
`;
export const sendMsgMutation = gql`
mutation send_msg($input: msgInput!) {
    send_msg(input:$input) {
        msg${msgSchema}
    }
}
`;
export const Add_New_Product_Mutation = gql`
mutation addProduct($input: addProductInput!) {
    addProduct(input:$input) {
        _id
        product_name
        price
    }
}
`;

export const Flagged_UnFlagged_Mutation = gql`
mutation flag_unflag($input: flagUnflagInput!) {
    flag_unflag(input:$input) {
        status
    }
}
`;

export const Emoji_Mutation = gql`
mutation emoji($input: emojiInput!) {
    emoji(input:$input) {
        status
        has_emoji ${msgEmoji}
    }
}
`;

export const EDIT_MESSAGE_MUTATION = gql`
mutation edit_msg($input: editInput!) {
    edit_msg(input:$input) {
        status
        msg ${msgSchema}
    }
}
`;

export const CREATE_ROOM_MUTATION = gql`
mutation create_room($input: newRoomData!) {
    create_room(input:$input) {
        data {
            ${roomSchema}
        }
        status
        message
    }
}
`;

export const UPDATE_ROOM_MUTATION = gql`
mutation update_room($input: UpdateRoomData!) {
    update_room(input:$input) {
        data {
            ${roomSchema}
        }
        status
        message
    }
}
`;
export const TEAMMATE_INVITE_RESEND = gql`
mutation teammate_invite_resend($input: teammateInviteResendInput!) {
    teammate_invite_resend(input:$input) {
        status
        message
    }
}
`;

export const FORWARD_MSG_MUTATION = gql`
mutation forward($input: forwardInput!) {
    forward(input:$input) {
        status
        data
        message
    }
}
`;
export const FORWARD_FILE_MSG_MUTATION = gql`
mutation file_forward($input: forwardFileInput!) {
    file_forward(input:$input) 
}
`;

export const DELETE_MSG_MUTATION = gql`
mutation delete_msg($input: deleteInput!) {
    delete_msg(input:$input) {
        status
        data
        message
    }
}
`;

export const DELETE_FILE_MUTATION = gql`
mutation File_delete($input: fileInput!) {
    file_delete(input:$input) {
        status
        message
        data
    }
}
`;

export const PIN_UNPIN_MUTATION = gql`
mutation pin_unpin($input: roomModifyData!) {
    pin_unpin(input:$input) {
        status
        data
        message
    }
}
`;

export const READ_ALL_MUTATION = gql`
mutation read_all($input: readallConversationData!) {
    read_all(input:$input) {
        status
        data
        message
    }
}
`;

export const ARCHIVE_MUTATION = gql`
mutation room_archive($input: roomModifyData!) {
    room_archive(input:$input) {
        status
        data
        message
    }
}
`;
export const SET_NEW_PASSWORD = gql`
mutation set_new_password($input: newPasswordInput!) {
    set_new_password(input:$input) {
        status
        data
        message
    }
}
`;
export const TEAMMATE_INVITE = gql`
mutation teammate_invite($input: teammateInviteInput!) {
    teammate_invite(input:$input) {
        status
        data{
            id
            firstname
            lastname
            email
            phone
            company_id
            img
            fnln
            role
            login_total
            is_delete
            is_active
            createdat
            created_by
        }
        message
    }
}
`;

export const CLOSE_MUTATION = gql`
mutation close_room($input: roomModifyData!) {
    close_room(input:$input) {
        status
        data
        message
    }
}
`;

export const MUTE_CONVERSATION_MUTATION = gql`
mutation mute_conversation($input: muteConversationData!) {
    mute_conversation(input:$input) {
        status
        data
        message
    }
}
`;

export const CREATE_UPDATE_TAG = gql`
mutation Create_update_tag($input: createNewInput!) {
    create_update_tag(input: $input) {
        status
        message
        tag ${tag_schema}
    }
}
`;

export const TAG_DELETE = gql`
mutation Tag_delete($input: tagDeleteInput!) {
    tag_delete(input: $input) {
        status
        message        
    }
}`

export const TAG_INTO_FILE = gql`
    mutation Add_remove_tag_into_file($input: addRemoveTagIntoFile!) {
        add_remove_tag_into_file(input: $input) {
            status
            message
            data
        }
    }
`;

export const ATTACHMENT_STAR_MUTATION = gql`
    mutation File_star($input: starFileInput!) {
        file_star(input:$input) {
            file_id
            star
            conversation_id
            msg_id
            file_bucket
            file_key
            is_reply_msg
        }
    }
`;

export const FILE_SHARE_LINK_CREATE = gql`
    mutation file_share_link_create($input: fileInput!) {
        file_share_link_create(input:$input) 
    }
`;

export const FILE_SHARE_LINK_REMOVE = gql`
    mutation file_share_link_remove($input: fileInput!) {
        file_share_link_remove(input:$input) 
    }
`;
export const SWITCH_ACCOUNT_MUTATION = gql`
    mutation switch_account($input:switchInput!){
        switch_account(input:$input) {
            token
            refresh_token
            message
            status_code
        }
    }
`
export const MERGE_COMPANY = gql`
    mutation merge_company($company_id: String){
        merge_company(company_id: $company_id) {
            status
            message
            data
        }
    }
`
export const ROLLBACK_COMPANY = gql`
    mutation merge_roleback($company_id: String){
        merge_roleback(company_id: $company_id) {
            status
            message
            data
        }
    }
`
export const MODULE_ADD = gql`
    mutation Module_add($company_id: String, $module_title: String, $is_sub_module: Boolean, $module_id: String, $req_type: String) {
        module_add(
            company_id: $company_id
            module_title: $module_title
            is_sub_module: $is_sub_module
            module_id: $module_id
            req_type: $req_type
        ) {
            status
            message
            data
        }
    }    
`
export const MODULE_DELETE = gql`
    mutation Module_delete($company_id: String, $module_title: String, $is_sub_module: Boolean, $module_id: String) {
        module_delete(
            company_id: $company_id
            module_id: $module_id
            module_title: $module_title
            req_type: "delete"
            is_sub_module: $is_sub_module
        ) {
            status
            message
            data
        }
    }    
`
export const ROLE_ADD = gql`
    mutation Role_add($company_id: String, $role_title: String, $role_id: String) {
        role_add(
            company_id: $company_id
            role_title: $role_title
            role_id: $role_id
        ) {
            status
            message
            data
        }
    }    
`
export const ROLE_ACCESS = gql`
    mutation Role_access_update($company_id: String, $role_access: [String!], $role_id: String, $req_type: String) {
        role_access_update(
            company_id: $company_id
            role_access: $role_access
            role_id: $role_id
            req_type: $req_type
        ) {
            status
            message
            data
        }
    }    
`
export const USER_ROLE_ACCESS = gql`
    mutation Update_user_access($id: String!, $role: String!, $access: [String!]) {
        update_user_access(id: $id, role: $role, access: $access) {
            status
            message
            data
        }
    }
`
export const UPDATE_USER_MUTATION = gql`
    mutation update_user($input:updateUserInput!){
        update_user(input:$input) {
            status
            message
            data
        }
    }
`;
export const DELETE_USER_MUTATION = gql`
    mutation delete_user($input:deleteUserInput!){
        delete_user(input:$input) {
            status
            message
            data
        }
    }
`;
export const EDIT_PARTICIPANTS_UPDATE = gql`
    mutation edit_private_participants($input:editPrivateInput!){
        edit_private_participants(input:$input) {
            status
            message
            data
        }
    }
`;

export const URL_TITLE_UPDATE = gql`
    mutation Url_title_update($input:urlTitleInput!) {
        url_title_update(input: $input) {
            status
            messages
            data {
                conversation_id
                msg_id
                sender
                senderemail
                senderimg
                fnln
                sendername
                msg_body
                unread_reply
                call_duration
                call_msg
                call_type
                call_status
                call_sender_ip
                call_sender_device
                call_receiver_ip
                call_receiver_device
                call_server_addr
                msg_type
                reply_for_msgid
                last_reply_name
                is_reply_msg
                root_msg_id
                activity_id
                url_favicon
                url_base_title
                url_title
                url_body
                url_image
                has_timer
                edit_status
                last_update_user
                conference_id
                forward_by
                msg_text
                img_url
                edit_history
                root_conv_id
                user_tag_string
                company_id
                task_id
                referenceId
                reference_type
                file_group
                cost_id
                sender_is_active
                task_start_date
                task_due_date
                updatedmsgid
                old_created_time
                has_delivered
                has_reply
                has_reply_attach
                call_running
                call_server_switch
                is_secret
                participants
                call_participants
                has_flagged
                msg_status
                attch_imgfile
                attch_audiofile
                attch_videofile
                attch_otherfile
                edit_seen
                has_delete
                has_hide
                has_tag_text
                tag_list
                issue_accept_user
                secret_user
                mention_user
                has_star
                assign_to
                task_observers
                created_at
                last_reply_time
                last_update_time
                forward_at
                link_data {
                    url_id
                    title
                    url
                    msg_id
                    conversation_id
                    user_id
                }
                has_emoji {
                    grinning
                    joy
                    open_mouth
                    disappointed_relieved
                    rage
                    thumbsup
                    heart
                    folded_hands
                    check_mark
                }
                all_attachment {
                    id
                    conversation_id
                    conversation_title
                    user_id
                    msg_id
                    bucket
                    file_type
                    key
                    location
                    originalname
                    file_size
                    has_tag
                    root_conv_id
                    url_short_id
                    file_category
                    main_msg_id
                    company_id
                    referenceId
                    reference_type
                    uploaded_by
                    cost_id
                    is_delete
                    is_secret
                    created_at
                    has_delete
                    tag_list
                    mention_user
                    secret_user
                    participants
                    star
                }
            }
        }
    }
`;

export const DELETE_LINK = gql`
mutation Delete_link($input:deleteLinkInput!) {
    delete_link(input: $input) {
        status
        message
        return_data {
            url_id
            created_at
            msg_id
            conversation_id
            company_id
            user_id
            url
            title
            has_hide
            has_delete
            root_conv_id
            is_delete
            secret_user
            other_user
            participants
            conversation_title
            uploaded_by
        }
    }
}
`
export const FAVOURITE_UNFAVOURITE = gql`
mutation Favourite_unfavourite($input :favoDataInput!) {
    favourite_unfavourite(input: $input) {
        status
        message
        data
    }
}`


export const CREATE_UPDATE_TEAM = gql`
mutation Create_update_team($input:createTeamInput) {
    create_update_team(input: $input) {
        message
        status
        return_data {
            team_id
            team_title
            company_id
            created_by
            updated_by
            participants
            admin
            created_at
            updated_at
        }
    }
}
`;
export const UPDATE_SYSTEM_ROOM = gql`
mutation Update_system_room($input: systemConversationData!) {
    update_system_room(input: $input ) {
        status
        message
        data
    }
}`;

export const DELETE_TEAM = gql`
mutation Delete_team($input: deleteTeamInput) {
    delete_team(input: $input) {
        status
        message
        data
    }
}`;

export const CREATE_UPDATE_CATEGORY = gql`
mutation Create_update_Category($input: create_update_CategoryInput) {
    create_update_Category(input: $input) {
        status
        message
        data
    }
}`

export const DELETE_CATEGORY = gql`
mutation DeleteCategory($input: deleteCategoryInput) {
    deleteCategory(input: $input) {
        status
        message
        data
    }
}`

//All Task Mutation

export const CREATE_QUICK_TASK = gql`
    mutation create_quick_tasks($input:[createTaskInput!]!){
        create_quick_tasks(input:$input){
          _id
          project_id
          project_title
          project_img
          conversation_id
          conversation_name
          conversation_img
          msg_id
          task_title
          start_date
          end_date
          due_time
          progress
          status
          notes
          description
          description_by
          description_at
          assign_to
          observers
          forecasted_cost
          actual_cost
          cost_variance
          forecasted_hours
          actual_hours
          hours_variance
          repeat_task
          repeat_until
          priority
          is_archive
          review
          created_by
          created_at
          last_updated_at
          company_id
          participants
          key_words
          view_status
          view_cost
          view_hour
          view_description
          view_note
          view_checklist
          view_update
          review_status
          flag
          has_delete
          owned_by
          owned_status
          owned_at
        }
    }
`
export const UPDATE_SINGLE_TASK = gql`
    mutation update_single_task($input:updateTaskInput!){
        update_single_task(input:$input){
            _id
            project_id
            project_title
            project_img
            conversation_id
            conversation_name
            conversation_img
            key_words
            msg_id
            task_title
            start_date
            end_date
            due_time
            progress
            status
            notes
            description
            description_by
            description_at
            assign_to
            assign_at
            observers
            forecasted_cost
            actual_cost
            cost_variance
            forecasted_hours
            actual_hours
            hours_variance
            repeat_task
            repeat_until
            priority
            is_archive
            review
            created_by
            created_at
            last_updated_at
            company_id
            participants
            view_status
            view_cost
            view_hour
            view_description
            view_note
            view_checklist
            view_update
            review_status
            flag
            has_delete
            owned_by
            owned_status
            owned_at
            notification {
                _id
                type
                title
                body
                created_by_id
                created_by_name
                created_by_img
                receiver_id
                company_id
                task_id
                tab
                created_at
                fnln
                created_by_email
            }
            hour_breakdown {
                _id
                fdate
                tdate
                forecasted_hours
                actual_hour
                note
                status
            }
            cost_breakdown {
                _id
                cost_title
                forecasted_cost
                actual_cost
            }
            checklists {
                _id
                status
                item_title
                task_id
                created_by
                company_id
                created_at
                last_updated_at
            }
            discussion {
                conversation_id
                msg_id
                sender
                senderemail
                senderimg
                fnln
                sendername
                msg_body
                unread_reply
                call_duration
                call_msg
                call_type
                call_status
                call_sender_ip
                call_sender_device
                call_receiver_ip
                call_receiver_device
                call_server_addr
                msg_type
                reply_for_msgid
                last_reply_name
                is_reply_msg
                root_msg_id
                activity_id
                url_favicon
                url_base_title
                url_title
                url_body
                url_image
                has_timer
                edit_status
                last_update_user
                conference_id
                forward_by
                msg_text
                edit_history
                root_conv_id
                user_tag_string
                company_id
                task_id
                referenceId
                reference_type
                file_group
                cost_id
                sender_is_active
                task_start_date
                task_due_date
                updatedmsgid
                old_created_time
                has_delivered
                has_reply
                has_reply_attach
                call_running
                call_server_switch
                is_secret
                participants
                call_participants
                has_flagged
                msg_status
                attch_imgfile
                attch_audiofile
                attch_videofile
                attch_otherfile
                edit_seen
                has_delete
                has_hide
                has_tag_text
                tag_list
                issue_accept_user
                secret_user
                mention_user
                has_star
                assign_to
                task_observers
                created_at
                last_reply_time
                last_update_time
                forward_at
                all_attachment {
                    id
                    conversation_id
                    conversation_title
                    user_id
                    msg_id
                    bucket
                    file_type
                    key
                    location
                    originalname
                    file_size
                    has_tag
                    root_conv_id
                    url_short_id
                    file_category
                    main_msg_id
                    company_id
                    referenceId
                    reference_type
                    uploaded_by
                    cost_id
                    is_delete
                    is_secret
                    created_at
                    has_delete
                    tag_list
                    mention_user
                    secret_user
                    participants
                    star
                    tag_list_with_user {
                        tag_id
                        created_by
                    }
                    tag_list_details {
                        tag_id
                        tagged_by
                        title
                        company_id
                        type
                        shared_tag
                        visibility
                        tag_type
                        tag_color
                        team_list
                        created_at
                        update_at
                    }
                }
                has_emoji {
                    grinning
                    joy
                    open_mouth
                    disappointed_relieved
                    rage
                    thumbsup
                    heart
                    folded_hands
                    check_mark
                }
            }
            files {
                id
                conversation_id
                conversation_title
                user_id
                msg_id
                bucket
                file_type
                key
                location
                originalname
                file_size
                has_tag
                root_conv_id
                url_short_id
                file_category
                main_msg_id
                company_id
                referenceId
                reference_type
                uploaded_by
                cost_id
                is_delete
                is_secret
                created_at
                has_delete
                tag_list
                mention_user
                secret_user
                participants
                star
                tag_list_with_user {
                    tag_id
                    created_by
                }
                tag_list_details {
                    tag_id
                    tagged_by
                    title
                    company_id
                    type
                    shared_tag
                    visibility
                    tag_type
                    tag_color
                    team_list
                    created_at
                    update_at
                }
            }
        }
    }
`
export const CREATE_NEW_KEY_WORD = gql`
mutation Create_new_key_word($input:[TaskKeyWordInput!]!) {
    create_new_key_word(input:$input) {
        status
        message
        data {
            _id
            keywords_title
            description
            task_id
            created_by
            created_at
            last_updated_at
            company_id
            team_id
        }
    }
}`


export const CREATE_PROJECT = gql`
    mutation Create_project($input:projectInput!) {
        create_project(input:$input) {
            status
            message
            data
        }
    }
`

export const PROJECT_UPDATE = gql`
    mutation Project_update($input:projectUpdateInput! ) {
        project_update(input: $input) {
            status
            message
        }
    }
`
export const _DELETE_TASK = gql`
    mutation Delete_task($input: deleteTaskInput!) {
    delete_task(input: $input) {
        status
        message
    }
}
`
export const SAVE_UPDATE_CHECKLIST = gql`
mutation Save_update_checklist($input: ChecklistInput) {
    save_update_checklist(input: $input) {
        status
        is_new
        data {
            _id
            status
            item_title
            task_id
            created_by
            company_id
            created_at
            last_updated_at
        }
    }
}
`

export const DELETE_CHECKLIST = gql`
mutation Delete_checklist($input:ChecklistDeleteInput) {
    delete_checklist(input:$input) {
        status
        message
    }
}
`

export const UpdateCompany = gql`
mutation UpdateCompany($input: updateInput!) {
    updateCompany(input: $input) {
        status        
        company {
            company_id
            company_name
            created_by
            updated_by
            company_img
            role
            industry
            domain_name
            plan_name
            plan_user_limit
            plan_storage_limit
            is_deactivate
            plan_id
            subscription_id
            product_id
            price_id
            class
            campus
            section
            plan_access
            created_at
            updated_at
            createdAt
            updatedAt
        }
    }
}
`

// {
//     _id: null
//     user_id: null
//     image: null
//     ques: null
//     res: null
//     ans: null
//     like: null
//     dislike: null
//     root_id: null
//     created_at: null
//     childCount: null
//     share_link: null
// }

export const Save_workfreeliai = gql`
  mutation Save_workfreeliai($input: save_workfreeliaiInput) {
    save_workfreeliai(input: $input) {
        status
        message
    }
}
`
export const Send_ai_msg = gql`
  mutation Send_ai_msg($input: save_workfreeliaiInput) {
    send_ai_msg(input: $input) {
        status
        message
        data
    }
}
`

// { _id: null }
export const Delete_workfreeliai = gql`
mutation Delete_workfreeliai($input:delete_workfreeliaiInput) {
    delete_workfreeliai(input:$input) {
        status
        message
    }
}
`

export const CREATE_EOD_REPORT = gql`
    mutation create_eod_report($input: reportCreateInput!) {
        create_eod_report(input: $input) {
            status
            message
            result {
                _id
                company_id
                venue_id
                notes_for
                reporting_date
                created_at
                updated_at
                reporting_date_string
                real_time_data
                net_sales
                comps
                total
                fohHourly {
                    forecast
                    actual
                    total
                    discount
                }
                fohSalary {
                    forecast
                    actual
                    total
                    discount
                }
                bohHourly {
                    forecast
                    actual
                    total
                    discount
                }
                bohSalary {
                    forecast
                    actual
                    total
                    discount
                }
                sales_data{
                    sales
                    qty
                    grossAmount
                    refunds
                    discounts
                    amount
                }
                payment_data {
                    type
                    qty
                    amount
                }
                tax_data{
                    type
                    qty
                    amount
                }
                cash_data{
                    type
                    qty
                    amount
                }
                statistic_data{
                    AverageStay
                    AvgCheckGross
                    AvgCheckNet
                    AvgGuestGross
                    AvgGuestHour
                    AvgGuestNet
                    AvgHourGross
                    AvgHourNet
                    CheckCount
                    EntreeCount
                    GuestCount
                    TotalHours
                }
                forecasted_labour
                actual_labour
                total_percent
                total_discount
                operational_note
                briefing_note
                service_note
                kitchen_note
                created_by
                created_by_name
                updated_by
                updated_by_name
                status
                timezone
                device
            }
        }
    }
`;


export const DELETE_EOD_REPORT = gql`
    mutation delete_eod_report($input: reportDeleteInput) {
        delete_eod_report(input: $input) {
            status
        }
    }
`;

export const CREATE_VENUE = gql`
    mutation Create_update_venue($input:VenueCreateUpdateInput) {
        create_update_venue(input:$input) {
            status
            message
            result {
                _id
                venue_id
                venue_title
                team_id
                created_by
                created_by_name
                updated_by
                updated_by_name
                created_at
                updated_at
                company_id
                id
                is_deleted
                participants
                recipients
                admins
                submitters
                maintenance_contact_participants
                maintenance_participants
                maintenance_submitter
                maintenance_approver
                maintenance_observer
                maintenance_recipients
                maintenance_memail
                eod_contact_participants
                eod_participants
                eod_submitters
                eod_reopen
                eod_email
                eod_notifi
                endpointURL
                endpointToken
            }
    }
}`

export const Delete_venue = gql`
mutation Delete_venue($input: VenuedeleteInput) {
    delete_venue(input: $input) {
        status
        message
    }
}`

export const logoutFromAll = gql`
mutation Remove_all_device {
    remove_all_device {
        status
        message
        data
    }
}
`;

export const Forgot_password = gql`
    mutation Forgot_password($input: emailInput) {
        forgot_password(input: $input) {
            status
            message
            data
        }
    }
`
export const Email_otp_verify = gql`
    mutation Email_otp_verify ($input: emailOtpVerifyInput) {
    email_otp_verify(input: $input) {
        status
        message
        data
    }
}
`


export const Read_task_notification = gql`
mutation Read_task_notification($input: readTaskInput!) {
    read_task_notification(input: $input) {
        success
        message
    }
}
`

export const Remove_this_line = gql`
    mutation Remove_this_line($input: removeline!) {
        remove_this_line(input: $input) {
            status
            message
            data
        }
    }
`
export const Signup_otp_send = gql`
    mutation Signup_otp_send($input: emailFnLnPInput) {
        signup_otp_send(input: $input) {
            status
            message
            data
        }
    }
`

export const Signup = gql`
    mutation Signup($input: signupInput) {
        signup(input: $input){
            status
            message
            data
        }
    }
`

export const Signup_invitation = gql`
    mutation Signup_invitation($input: signupInvitationInput) {
    signup_invitation(input: $input) {
        status
        message
        data
    }
}

`


//End 