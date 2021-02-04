$(document).ready(function () {

    //api base url
    const baseUrl = `https://debashisblog.herokuapp.com`

    //get id from url
    const getPostId = function () {
        const pageUrl = $(location).attr("href");
        const pageUrlParts = pageUrl.split('/');
        const postId = pageUrlParts[pageUrlParts.length - 1]
        return postId;
    };

    //popup modal
    const activePopup = function () {
        $('.login_modal').addClass('active');
        $('.login_overlay').addClass('active');
    }

    const closePopup = function (event) {
        event.preventDefault();
        $('.login_modal').removeClass('active');
        $('.login_overlay').removeClass('active');
    }

    $('.close_btn').on("click", closePopup)

    //*******************************COMMENT***************************/

    //return true if authenticated
    const checkAuthenticated = async function () {
        const url = baseUrl + `/auth/authenticated`
        const status = await axios.get(url)
        return status.data;
    }

    //create a single comment in db
    const createComment = async function (event) {
        event.preventDefault();
        if (isAuthenticated) {
            try {
                const data = getCommentData();
                const url = baseUrl + `/api/comments/${getPostId()}`
                await axios.post(url, data)
                    .then(res => {
                        if (res.data) {
                            console.log('res data', res.data)
                            addComment(res.data.comment, res.data.creator)
                        } else {
                            // alert error while commenting
                        }
                    })
            }
            catch (err) {
                console.log(err)
            }
        }
        else {
            activePopup()
        }
    }

    //get comment data from dom
    const getCommentData = function () {
        const inputText = $('.dis_textarea').val();
        let data = {}
        if (inputText != '') {
            $('.dis_textarea').val('');
            data = {
                comment: inputText
            }
            return data;
        }
        return false;
    }

    //get new comment Element 
    const getNewCommentElement = function (comment, creator) {
        const articleId = getPostId();
        const inputText = comment.text;
        const createdAt = moment(comment.createdAt).format("MMM Do");
        const comment_id = comment._id

        //insert a new comment in dom
        const html = `<div class="dis_content">
        <div class="dis_card" >
            <div class="dis_wrapper">
                <div class="writer_imgBx">
                    <img src='${creator.image}' alt="user-image">
                </div>
                <div class="writer_content">
                    <div class="writer_head">
                        <div class="writer_title">
                            <h6>${creator.displayName}</h6>
                            <div class="seperator">
                                <p><i class="fas fa-circle"></i></p>
                            </div>
                            <p class="date"> </p><span> ${createdAt} </span>
                        </div>
                        <div class="action_container">
                                <div class="action">
                                    <span>...</span>
                                    <div class="action_options">
                                        <a class="comment_edit_btn" href="/comments/edit/${articleId}/${comment_id}">Edit</a>
                                        <form action="/api/comments/${comment_id}?_method=DELETE"
                                            method="POST">
                                            <button type="submit">Delete</button>
                                        </form>
                                    </div>
                                </div>
                        </div>
                    </div>
                    <p class="comment">${inputText}</p>
                </div>
            </div>
          
        </div>

        <div class="reac_container">
            <div class="reac_wrapper" data-comment_id=${comment_id}>
                <div class="reac_link">
                    <a href="" class="like"><span><i class="fas fa-heart"></i></span><span
                    class="count"></span>Like</a>
                    <a  class="reply" href=""><span ><i class="far fa-comment-alt"></i></span>Reply</a>
                </div>
               
            </div>   
        </div>
    </div>
`
        return html;
    }

    //add comment element to dom
    const addComment = function (comment, creator) {
        const NewCommentElement = getNewCommentElement(comment, creator)
        $('.dis_card_wrapper').prepend(NewCommentElement);
    }

    // manage comment options comment card
    const toggleCommentManage = function (event) {
        if (isAuthenticated) {
            target = $(event.target).parent();
            options = target.find('.action_options')

            target.toggleClass('active');
            options.toggleClass('active')
        } else {
            activePopup()
        }
    }

    //get commentId
    const getCommentId = function (event) {
        const reac_link = $(event.target).closest('div');
        const reac_wrapper = reac_link.parent().closest('div');
        const commentId = reac_wrapper.data().comment_id
        return commentId;
    }

    //get reaction html element
    const getReacElement = function (event) {
        const target = event.target
        const tag = target.tagName;
        let reacElement;

        if (tag == 'A') {
            reacElement = $(event.target)
        } else {
            reacElement = $(event.target).closest('a');
        }

        return reacElement;
    }

    //manage comment like count
    const manageCount = function (count, reacElement) {
        //set new count
        $(reacElement).find("span.count").text(count);
    }

    // add or remove reaction to a comment
    const toggleCommentReact = async function (event) {
        event.preventDefault();
        // chek if already liked ( active class present)
        if (isAuthenticated) {
            try {
                const commentId = getCommentId(event);
                let data;
                console.log('user', user_id)
                if (user_id) {
                    data = {
                        userId: user_id,
                    }
                } else {
                    return;
                }
                await postCommentReact(commentId, data)
                    .then(res => {
                        //like dislike in both case return true
                        if (res) {
                            const count = res.reactionCount;
                            const reacElement = getReacElement(event);
                            manageCount(count, reacElement);
                            reacElement.toggleClass('active');
                        } else {
                            // show error while reacting
                        }

                    })
            }
            catch (err) {
                activePopup()
            }
        }
        else {
            activePopup()
        }
    }


    //event listenersy 
    //create a new comment 
    $('.submit_btn').click(createComment);

    //manage Comment btn event listeners
    $('.dis_card_wrapper').delegate('div.action', "click", toggleCommentManage);
    $('.dis_card_wrapper').delegate('a.like', "click", toggleCommentReact);


    //***********************************Reply********************************/

    // remove new reply input textarea element
    const removeReplayInput = function (event) {
        event.preventDefault();
        $('.reac_reply_input').remove()
    }

    //get  reply input element
    const getReplyInputElement = function () {
        const element = ` <div class="reac_reply_input">
        <textarea class="reac_reply_textarea" placeholder="Reply..."></textarea>
        <div class="reac_btn_container">
            <a href=" " class="reply_submit_btn">Submit</a>
            <a href=" " class="dismis_btn">Dismis</a>
        </div>
        </div>`
        return element;
    }


    // add new reply input textarea element
    const addReplyInput = function (event) {
        event.preventDefault();
        if (isAuthenticated) {
            const reac_link = $(event.target).parent().closest('div');
            const children = $('.dis_card_wrapper').find('.reac_reply_input').length

            //check if reply input not added
            if (!children) {
                const inputTextArea = getReplyInputElement();
                $(inputTextArea).insertAfter(reac_link);

                //event listeners
                //add event listener to dismiss btn and submit btn
                $('.dismis_btn').click(removeReplayInput);
                // replay submit btn event listner
                $('.reply_submit_btn').click(function (event) {
                    event.preventDefault();
                    const [inputText, comment_id] = getReplyData(event, reac_link);
                    if (inputText != '') {
                        createReply(inputText, comment_id, reac_link)
                    } else {
                        // alert "please insert reply"
                    }
                    return;
                })
            }

        } else {
            activePopup()
        }
    }


    //get replay data
    const getReplyData = function (event) {
        //get comment id 
        const reac_btn_container = $(event.target).parent()
        const reac_reply_input = reac_btn_container.parent().closest('div');
        const reac_wrapper = reac_reply_input.parent().closest('div');
        const comment_id = reac_wrapper.data().comment_id
        //get input element
        const input = reac_reply_input.children()[0]
        const inputText = $(input).val()

        return [inputText, comment_id]
    }

    //create a new reply in db
    const createReply = async function (inputText, commentId, refElement) {
        try {
            const postId = getPostId()
            const data = {
                replyText: inputText
            }
            await postReply(postId, commentId, data)
                .then(data => {
                    if (data) {
                        addReply(data.reply, data.creator, refElement, commentId)
                    } else {
                        //error
                    }
                })
                .catch(err => {
                    //error
                })
        }
        catch (err) {
            console.log(err);
        }

    }

    //add reply element to DOM
    const addReply = function (reply, creator, refElement, commentId) {
        const newReplyElement = getNewReplyElement(reply, creator, commentId);
        //remove reply input
        $('.reac_reply_input').remove()
        //add new reply 
        $(newReplyElement).insertAfter(refElement)
    }

    //get new Reply element
    const getNewReplyElement = function (reply, creator, commentId) {
        const creatorName = creator.displayName;
        const creatorImage = creator.image;
        const replyText = reply.text;
        const replyCreatedAt = moment(reply.createdAt).format("MMM Do");;
        const replyId = reply.id;

        const html = ` <div class="reply_wrapper">
        <div class="reply_card">
            <div class="reply_writer_imgBx">
                <a href="">
                    <img src="${creatorImage}" alt="reply_user-image">
                </a>
            </div>
            <div class="reply_writer_content">
                <div class="reply_writer_head">
                    <div class="reply_writer_title">
                        <a href="">
                            <h6>${creatorName}</h6>
                        </a>
                        <div class="reply_seperator">
                            <p><i class="fas fa-circle"></i></p>
                        </div>
                        <p class="reply_date"> </p><span>${replyCreatedAt}</span>
                    </div>
                </div>
                <p class="reply_comment">${replyText}</p>
            </div>
        </div>
        <div class="reply_reac_container">
            <a href="" class="reply_like" data-comment_id="${commentId}"
             data-reply_id="${replyId}">
                    <span><i class="fas fa-heart"></i></span>
                    <span class="count">33</span>
                    Like
            </a>
        </div>
        </div>`
        return html;
    }

    //add reply element to DOM
    const addReply = function (reply, creator, refElement) {
        const newReplyElement = getMewReplyElement(reply, creator);
        //remove reply input
        $('.reac_reply_input').remove()
        //add new reply 
        $(newReplyElement).insertAfter(refElement)
    }

    //create a new reply in db
    const createReply = async function (input, comment_id, refElement) {
        try {
            const inputText = $(input).val()
            const postId = getPostId()
            const data = {
                replyText: inputText
            }

            const url = baseUrl + `/article/reply/${postId}/${comment_id}`
            await axios.post(url, data)
                .then(res => {
                    addReply(res.data.reply, res.data.creator, refElement)
                })
                .catch(err => {
                    console.log(err)
                })
        }
        catch (err) {
            console.log(err);
        }
        return { commentId, replyId }
    }

    //react to a reply

    const toggleReplyReact = async function (event) {
        event.preventDefault();
        if (isAuthenticated) {
            try {
                const { commentId, replyId } = getIds(event);
                let data;
                if (user_id) {
                    data = {
                        userId: user_id,
                    }
                } else {
                    return;
                }
                await postReplyReact(commentId, replyId, data)
                    .then(res => {
                        if (res) {
                            const count = res.reactionCount;
                            const reacElement = getReacElement(event);
                            manageCount(count, reacElement);
                            reacElement.toggleClass('active');
                        } else {
                            // show error while reacting
                        }
                    })

            } catch (err) {

            }
        }
        else {
            activePopup()
        }
    }


    //event listeners
    // create a new reply
    $('.dis_card_wrapper').delegate('a.reply', "click", addReplyInput);
    $('.dis_card_wrapper').delegate('a.reply_like', "click", toggleReplyReact);
})