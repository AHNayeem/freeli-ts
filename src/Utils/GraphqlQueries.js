import { gql } from '@apollo/client';
export const GET_ME = gql`
  query me {
    me {
      id
      firstname
      lastname
      email
      company_id
      img
      fnln
      company_name
      phone
      role
      access
      timezone
      digest_email
      eod_report
      email_send_time
      sso
      short_id
    }
  }
`;
export const GET_ALL_USERS = gql`
  query users ($company_id: String!){
    users(company_id: $company_id) {
      id
      firstname
      lastname
      email
      company_id
      phone
      img
      fnln
      role
      access
      login_total
      is_delete
      is_active
      eod_report
      createdat
      created_by
    }
  }
`;

export const GET_LEFT_ROOMS = gql`
  query rooms($userId: String!) {
    rooms(user_id: $userId) {
      conversation_id
      title
      pin
      group
      archive
      has_mute
      mute
      created_by
      close_for
      friend_id
      system_conversation
      temp_user
      participants_name
      participants
      last_msg_time
      conv_img
      company_id
    }
    
  }
`;

export const FILE_SHARE_LINK = gql`
  query File_share_link_view($url: String!) {
    file_share_link_view(url: $url)
  }
`;

export const ACTIVE_DEVICE_LIST = gql`
  query Active_device_list {
    active_device_list{
        status
        message
        data
    }
  }
`;

export const roomSchema = `
  conversation_id
  title
  pin
  group
  mute
  has_mute
  company_id
  created_by
  close_for
  archive
  friend_id
  system_conversation
  temp_user
  participants
  participants_guest
  participants_admin
  b_unit_id
  b_unit_id_name
  team_id
  team_id_name
  tag_list
  conv_img
  conv_is_active
  last_msg_time
  short_id
`;

export const GET_SINGLE_ROOM = gql`
  query room($conversation_id: String!) {
    room(conversation_id: $conversation_id) {
      ${roomSchema}
    }
  }
`;
export const msgEmoji = `
{
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
`
export const msgSchema = `
{
  conversation_id
  msg_id
  msg_body
  edit_history
  msg_type
  is_secret
  cost_id
  file_group
  task_id
  img_url
  task_data {
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
  fnln
  is_reply_msg
  sender_is_active
  created_at
  forward_by
  has_emoji ${msgEmoji}
  has_reply_attach
  has_reply
  has_delete
  last_reply_name
  last_reply_time
  has_flagged
  senderimg
  sendername
  secret_user
  reply_for_msgid
  participants
  sender
  senderemail
  url_base_title
  url_title
  url_body
  link_data {
    url_id
    url
    title
    msg_id
    conversation_id
    user_id
  }
}
`
export const GET_ROOM_MESSAGES = gql`
  query messages($conversation_id: String!, $page:Int!) {
    messages(conversation_id: $conversation_id,page:$page) {
      msgs${msgSchema}
      pagination {
        page
        totalPages
        total
      }
    }
    
  }
`;
export const GET_FILTER_MESSAGES = gql`
  query filter($type: String!, $conversation_id:String!, $str:String, $page:Int!) {
    filter(type:$type,conversation_id: $conversation_id,str:$str,page:$page) {
      msgs${msgSchema}
      pagination {
        page
        totalPages
        total
      }
    }
    
  }
`;
export const GET_SINGLE_MSG = gql`
  query message($msg_id: String!) {
    message(msg_id: $msg_id) {
      msg${msgSchema}
    }
    
  }
`;
export const GET_TOTAL_UNREAD = gql`
  query Total_unread($conversation_id: String) {
      total_unread(conversation_id: $conversation_id) {
          total_unread_msg
          total_unread_reply
          all_flag_conversation
          taskunreadcount
          conversations {
              conversation_id
              urmsg
              urreply
              msgids {
                  msgid
                  unread
              }
          }
      }
  }
`;
export const GET_REPLY_MESSAGES = gql`
  query reply_messages($msg_id: String!, $page:Int!) {
    reply_messages(msg_id: $msg_id,page:$page) {
      msgs${msgSchema}
      pagination {
        page
        totalPages
        total
      }
    }
    
  }
`;

export const TAG_SCHEMA = `
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
`

export const GET_TAGS = gql`
query tags( 
  $company_id: String!, 
  $conversation_id: String,
  $conversation_ids:[String!], 
  $user_ids: [String!], 
  $admin_setting: String, 
  $from: String, 
  $to: String, 
  $team_list: [String!], 
  $tag_type: String,
  $upload_type: String
 ) {
  tags(
    company_id: $company_id,
    conversation_id: $conversation_id, 
    user_ids: $user_ids, 
    admin_setting: $admin_setting,
    conversation_ids: $conversation_ids, 
    from: $from, 
    to: $to, 
    team_list: $team_list, 
    tag_type: $tag_type,
    upload_type: $upload_type
  ) {
    private {
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
    public {
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
    ticket_tag {
        tag_id
        tagged_by
        title
        company_id
        type
        tag_color
        created_at
        updated_at
        updated_by
        team_list
        tag_type
    }
    task_tag {
        tag_id
        tagged_by
        title
        company_id
        type
        tag_color
        created_at
        updated_at
        updated_by
        team_list
        tag_type
    }
  }
}

`
export const GET_PRODUCTS = gql`
query products{
  products {
    _id
    product_name
    price
  }
}`
export const GET_PRODUCTS_MAIN = gql`
query products_main{
  products_main {
    _id
    product_name
    original_price
    price
  }
}`
export const GET_PRODUCT = gql`
query product($product_name:String!){
  product(product_name:$product_name){
    _id
    product_name
    price
  }
}`
export const GET_TEAMS = gql`
query Teams ($user_id: String){
  teams (user_id:$user_id){
    team_id
    team_title
    participants
  }
}`

export const GET_CATEGORIES = gql`
query categories{
  categories{
    unit_id
    unit_name
    company_id
  }
}`


export const HUB_ALL_LINKS = gql`
query Hub_all_link_msgs(
        $conversation_ids: [String!],
        $from: String,
        $to: String,
        $url: String,
        $user_ids: [String!],
        $sort_by: String
        $sort_style: String,
        $page: Int
    ) {
    hub_all_link_msgs(
        conversation_ids: $conversation_ids,
        from: $from,
        to: $to,
        url: $url,
        user_ids: $user_ids,
        sort_by: $sort_by,
        sort_style: $sort_style,
        page: $page
    ) {
        conversation_id_in_link
        uploaded_by_in_link
        pagination {
            page
            totalPages
            total
        }
        links {
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
}`;

export const HUB_ALL_FILES = gql`
query Get_file_gallery(
        $conversation_id: String,
        $conversation_ids: [String!],
        $uploaded_by: String,
        $file_type: String,
        $file_sub_type: String,
        $tag_id: [String!],
        $tag_operator: String,
        $file_name: String,
        $from: String,
        $to: String,
        $page: Int,
        $tab: String,
        $selectedFilters: String

    ) {
    get_file_gallery(
        conversation_id: $conversation_id,
        conversation_ids: $conversation_ids,
        uploaded_by: $uploaded_by,
        file_type: $file_type,
        file_sub_type: $file_sub_type,
        tag_id: $tag_id,
        tag_operator: $tag_operator,
        file_name: $file_name,
        from: $from,
        to: $to,
        page: $page,
        tab: $tab,
        selectedFilters: $selectedFilters
    ) {
        files {
            id
            conversation_id
            conversation_title
            uploaded_by
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
            tag_list_details {
              tag_id
              tag_type
              tagged_by
              title
              tag_color
            }
            is_delete
            is_secret
            created_at
            has_delete
            tag_list
            tag_list_with_user {
              tag_id
              created_by
            }
            mention_user
            secret_user
            participants
            star
        }
        summary {
            total
            image
            audio
            video
            other
            voice
            share
        }
        pagination {
            page
            totalPages
            total
        }
        tags{
          ${TAG_SCHEMA}
        }
    }
}
`;

export const HUB_TAG_FILES = gql`
query Get_file_gallery(
        $conversation_id: String,
        $conversation_ids: [String!],
        $uploaded_by: String,
        $file_type: String,
        $file_sub_type: String,
        $tag_id: [String!],
        $tag_operator: String,
        $file_name: String,
        $from: String,
        $to: String,
        $page: Int,
        $tab: String,
        $selectedFilters: String

    ) {
    get_file_gallery(
        conversation_id: $conversation_id,
        conversation_ids: $conversation_ids,
        uploaded_by: $uploaded_by,
        file_type: $file_type,
        file_sub_type: $file_sub_type,
        tag_id: $tag_id,
        tag_operator: $tag_operator,
        file_name: $file_name,
        from: $from,
        to: $to,
        page: $page,
        tab: $tab,
        selectedFilters: $selectedFilters
    ) {
        files {
            id
            conversation_id
            conversation_title
            uploaded_by
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
            tag_list_details {
              tag_id
              tag_type
              tagged_by
              title
              tag_color
            }
            is_delete
            is_secret
            created_at
            has_delete
            tag_list
            tag_list_with_user {
              tag_id
              created_by
            }
            mention_user
            secret_user
            participants
            star
        }
        
    }
}
`;

export const OTHERS_TAG_Details = gql`
query Others_tag_details($tag_id:String!, $conversation_id:String) {
  others_tag_details(tag_id: $tag_id, conversation_id: $conversation_id) {
      title
      tag_id
      tag_type
      tag_color
  }
}
`

export const GET_ALL_COMPANIES = gql`
  query companies($email: String!){
    companies(email: $email){
      company_name
      company_img
      company_id
      role
    }
  }
`
export const FIND_OWNED_COMPANY = gql`
  query Find_owned_company{
    find_owned_company{
      status
      message
      data
    }
  }
`
export const FIND_MODULES = gql`
  query Modules($company_id: String!, $module_id: String){
    modules(company_id: $company_id, module_id: $module_id){
      status
      message
      data
    }
  }
`
export const FIND_ROLES = gql`
  query Roles($company_id: String!, $role_id: String){
    roles(company_id: $company_id, role_id: $role_id){
      status
      message
      data
    }
  }
`
export const ROLLBACK_LIST = gql`
  query Roleback_list{
    roleback_list{
      status
      message
      data
    }
  }
`
export const GET_ALL_TEAMS = gql`
  query Teams {
    teams {
      team_id
      team_title
      company_id
      created_by
      updated_by
      team_system_conversation_active
      team_system_conversation_off_sms
      participants
      admin
      created_at
      updated_at
    }
  }
`
export const GET_TEAM_DATA = gql`
  query Team($team_id:String!) {
    team(team_id: $team_id) {
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
`
export const CATEGORIES = gql`
query Categories {
  categories {
    unit_id
    unit_name
    company_id
    user_id
    created_by
    created_by_name
    total_use
    updated_at
    created_at
  }
}`


export const All_archive = gql`
query All_archive {
  all_archive {
      status
      message
      data {
          conversation_id
          created_by
          title
          group
          team_id
          privacy
          archive
          status
          conv_img
          topic_type
          b_unit_id
          room_id
          is_busy
          company_id
          last_msg
          sender_id
          conference_id
          root_conv_id
          reset_id
          system_conversation
          system_conversation_active
          short_id
          close_for
          friend_id
          conv_is_active
          participants
          participants_name
          participants_admin
          participants_guest
          is_active
          is_pinned_users
          tag_list
          team_id_name
          b_unit_id_name
          system_conversatio_is_active
          system_conversatio_send_sms
          pin
          has_mute
          mute
          temp_user
          created_at
          last_msg_time
      }
  }
}
`


export const Archive_count = gql`
query Archive_count {
  archive_count {
      status
      archive
  }
}
`

//All Tasks Queries

export const ProjectSchema = `
  _id
  project_title
  created_by
  created_at
  start_date
  end_date
  forecasted_cost
  actual_cost
  cost_variance
  forecasted_hours
  actual_hours
  hours_variance
  description
  status
  projecct_img
  company_id
  manager_id
  participants
  task_ids
  is_archive
  pin
`

export const GET_TASKS = gql`
  query tasks(
  $conversation_id: String, 
  $view_type:String!, 
  $page:Int!, 
  $flag:[String!]
  $task_title:String
  $limit:Int!, 
  $read_all:String, 
  $filter:[Any], 
  $status:[String!], 
  $project_ids:[String!], 
  ){
    tasks(
    conversation_id: $conversation_id,
    view_type:$view_type, 
    page:$page,
    flag:$flag,
    task_title:$task_title,
    limit:$limit,
    read_all:$read_all,
    filter:$filter,
    status:$status,
    project_ids:$project_ids,
    ){
        status
        message
        taskMemberFilter
        assign_to
        kanban_pagination {
            kb_row_name
            page
            total
            totalPages
        }
        data {
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
  }
`

// all_keywords {
//   _id
//   keywords_title
//   description
//   task_id
//   created_by
//   created_at
//   last_updated_at
//   company_id
//   team_id
// }

export const GET_SINGLE_TASK = gql`
query Task($_id: ID!) {
    task(_id: $_id) {
        status
        message
        data {
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
}
`

export const TaskNotification = gql`
query TaskNotification($page:String) {
    taskNotification(page: $page) {
        status
        message
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
    }
}

`

export const Projects = gql`
query Projects {
    projects {
        status
        message
        data
    }
}
`
export const Get_KeyWords = gql`
  query keywords {
  keywords{
      status
      message
      data{
       _id
       keywords_title
      }
  }
}
`
export const Get_notifications = gql`
query Get_notifications($read_status: String!, $page: String) {
  get_notifications(read_status: $read_status, page: $page) {
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
      pagination {
          page
          totalPages
          total
      }
  }
}

`
export const SET_CALLING_URL = gql`
query set_url_calling($user_id: String!, $conversation_id: String!, $company_id: String!, $type: String, $action: String) {
    set_url_calling(user_id: $user_id, conversation_id: $conversation_id, company_id: $company_id, type: $type, action: $action) {
      status
      short_id
    }
}
`;

export const GET_CALLING_URL = gql`
query get_url_calling($type: String, $short_id: String, $user_id: String, $token: String) {
    get_url_calling( type: $type, short_id: $short_id, user_id: $user_id, token: $token) {
      url
      participants
      conversation_id
      is_running
      conversation_type
      company_id
      jwt_token
    }
}
`;

export const GET_RING_CALLING = gql`
query jitsi_ring_calling($user_id: String!,$conversation_id: String!,$company_id: String!,$conversation_type: String,$arr_participants: [String],$participants_all: [String], $convname: String, $call_link: String, $call_option: String,$token: String,) {
  jitsi_ring_calling(user_id: $user_id, conversation_id: $conversation_id, company_id: $company_id, conversation_type: $conversation_type, arr_participants: $arr_participants, participants_all: $participants_all, convname: $convname, call_link: $call_link, call_option: $call_option, token: $token) {
        status
        msg
        merge_status
        busy_conv
        jwt_token
      
    }
}
`;

export const GET_RING_USER = gql`
query jitsi_ring_users($user_id: String, $conversation_id: String, $token: String) {
    jitsi_ring_users(user_id: $user_id, conversation_id: $conversation_id, token: $token) {
      status
      jwt_token
      participants_status {
        user_id
        status
      }
      voip_conv {
        participants_all
        participants_admin
        plan_name
        msgid
        company_id
        convname
        call_option
        conversation_type
        call_link
        init_id
        connected
      }
      online_user_lists
      users {
        id
        firstname
        lastname
        img
        email
        role
      }
      callee_avatar
      conv_history
      active_participants
      msg_db${msgSchema}
    }
}
`;

export const JITSI_GET_TOKEN = gql`
query jitsi_get_token($user_id: String, $conversation_id: String) {
  jitsi_get_token(user_id: $user_id, conversation_id: $conversation_id) {
      jwt_token
    }
}
`;

export const GET_RING_TIMER = gql`
query jitsi_ring_timer($conversation_id: String) {
  jitsi_ring_timer(conversation_id: $conversation_id) {
      status
      
      
    }
}
`;

export const GET_CALLING_ACCEPT = gql`
  query jitsi_call_accept($user_id: String, $conversation_id: String, $token: String, $type: String, $device_type: String) {
    jitsi_call_accept(user_id: $user_id, conversation_id: $conversation_id, token: $token, type: $type, device_type: $device_type) {
      status
      jwt_token
    }
  }
`;

export const GET_CALLING_REJECT = gql`
  query jitsi_call_hangup($user_id: String, $user_fullname: String, $conversation_id: String, $msg_code: Int, $token: String) {
    jitsi_call_hangup(user_id: $user_id, user_fullname: $user_fullname, conversation_id: $conversation_id, msg_code: $msg_code, token: $token) {
      status
      
    }
  }
`;

export const JITSI_ADD_MEMBER = gql`
  query jitsi_add_member($user_id: String, $sender_name: String, $user_img: String, $member_id: String, $conversation_id: String, $convname: String, $arr_participants: [String]) {
    jitsi_add_member(user_id: $user_id, sender_name: $sender_name, user_img: $user_img, member_id: $member_id, conversation_id: $conversation_id, convname: $convname, arr_participants: $arr_participants) {
      status
      type
      
    }
  }
`;

export const JITSI_CALL_MERGE = gql`
  query jitsi_call_merge($user_id: String, $conversation_id: String, $merge_id: String , $conv_id_old: String, $token: String) {
    jitsi_call_merge(user_id: $user_id, conversation_id: $conversation_id, merge_id: $merge_id, conv_id_old: $conv_id_old, token: $token) {
      status
      
    }
  }
`;

export const GET_RUNNING_STATUS = gql`
  query jitsi_running_status($conversation_id: String) {
    jitsi_running_status(conversation_id: $conversation_id) {
      status
      voip_busy_conv {
        conv_id
        msg_id
      }
      
    }
  }
`;

export const XMPP_REGISTER_USER = gql`
  query xmpp_register_user($user_id: String, $token: String) {
    xmpp_register_user(user_id: $user_id, token: $token) {
      status
      xmpp_user
      online_user_lists
    }
  }
`;

export const FIREBASE_REGISTER_USER = gql`
  query firebase_register_user($user_id: String, $firebase_token: String, $device: String) {
    firebase_register_user(user_id: $user_id, firebase_token: $firebase_token, device: $device) {
      status
      
    }
  }
`;

export const Get_workai = gql`
query Get_workai($root_id:String, $page:String) {
    get_workai(root_id: $root_id, page: $page) {
        status
        result {
            _id
            user_id
            ques
            res
            ans
            like
            dislike
            root_id
            img_url
            created_at
            childCount
        }
    }
}
`

export const GET_EOD_LIST = gql`
query get_eod_list($timezone: String, $venue_id: String, $page: Int, $filter_list: [String], $filter_startdate: String, $filter_enddate: String) {
  get_eod_list(timezone: $timezone, venue_id: $venue_id, page: $page, filter_list: $filter_list, filter_startdate: $filter_startdate, filter_enddate: $filter_enddate) {
      status
      totalCount
      loaded
      result {
        _id
        company_id
        venue_id
        notes_for
        reporting_date
        reporting_date_string
        created_at
        updated_at
        real_time_data
        net_sales
        comps
        total
        forecasted_labour
        actual_labour
        total_percent
        total_discount
        status
        created_by
        created_by_name
        updated_by
        updated_by_name
        timezone
        device
        operational_note
        briefing_note
        service_note
        kitchen_note
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
        tax_data {
          type
          qty
          amount
        }
        cash_data {
          type
          qty
          amount
        }
      }
      totals{
        totalNetSales
        totalComps
        totalTotal
        totalForecastedLabour
        totalActualLabour
      }
    }
  }
`;

export const GET_EOD_DASHBOARD = gql`
query get_eod_dashboard($timezone: String, $week_day_from: String, $week_day_to: String, $day_from: String, $day_to: String, $venue_id: [String]) {
  get_eod_dashboard(timezone: $timezone, week_day_from: $week_day_from, week_day_to: $week_day_to, day_from: $day_from, day_to: $day_to, venue_id: $venue_id ) {
      status
      result {
        today
        yesterday
        thisWeek
        thisMonth
        thisYear
        dateRangeTotal{
          totalActualLabour
          totalNetSales
        }
        weekDayBreakdown {
          day
          totalActual
          totalEstimate
        }
        pia { # Include the pia field
          totalFohHourlyActual
          totalFohSalaryActual
          totalBohHourlyActual
          totalBohSalaryActual
          totalLabourNetSales
        }
        statistics{
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
        total_sales {
          TotalDiscountAmount
          TotalGrossAmount
          TotalNetAmount
          TotalQuantity
          TotalRefundAmount
          Items {
            Name
            Quantity
            GrossAmount
            RefundAmount
            DiscountAmount
            NetAmount
          }
        }
        taxes {
          Items {
            Name
            Amount
            Quantity
          }
        }
        payments{
          Items {
            Name
            Amount
            Quantity
          }

        }
        cash {
          type
          qty
          amount
        }
      }
    }
  }
`;

export const GET_EOD_ANALYSIS = gql`
query get_eod_analysis($type: String, $message: String, $timezone: String) {
  get_eod_analysis(type: $type, message: $message, timezone: $timezone) {
      status
      type
      data {
        venue
        sales {
          today
          yesterday
          averagePerDay
          monthToDate
          percentageChange
          topPerformingDay
          slowestDay
          averageLaborPercentage
        }
      }
      
      
    }
  }
`;

export const LIST_EOD_ANALYSIS = gql`
query list_eod_analysis {
  list_eod_analysis {
      status
      data{
        _id
        ques
      }
      
    }
  }
`;

export const GETVENULIST = gql`
query Get_venue_list {
  get_venue_list {
      status
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

export const Task_assign_to_member = gql`
  query Task_assign_to_member ($conversation_id: String) {
      task_assign_to_member(conversation_id: $conversation_id) {
          status
          taskMemberFilter
          assign_to
      }
  }

`

export const GET_STRIPE_CARD = gql`
  query stripeGetCard {
    stripeGetCard{
      status
      Stripe_Publishable_Key
      client_secret
      ephemeralKey
      cardObj {
        billingCardID
        billingCardNumber
        billingCardHolderName
        billingExpirationDate
        billingSecurityCode
        primaryCardCheckBox
        cardAddressCity
        cardAddressProvince
        cardAddressZip
        cardAddressStreet
      }
      setupIntents {
        id
        object
        application
        automatic_payment_methods
        cancellation_reason
        client_secret
        created
        customer
        description
        flow_directions
        last_setup_error
        latest_attempt
        livemode
        mandate
        next_action
        on_behalf_of
        payment_method
        payment_method_configuration_details
        single_use_mandate
        status
        usage

      }
     
    }
  }
`