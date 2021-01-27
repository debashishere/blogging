$(document).ready(function () {

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
        const url = `http://localhost:3000/auth/authenticated`
        const status = await axios.get(url)
        return status.data;
    }

    //create a single comment in db
    const createComment = async function (event) {
        event.preventDefault();
        try {
            const isAuthenticated = await checkAuthenticated();

            if (isAuthenticated) {
                const data = getCommentData();
                const url = `http://localhost:3000/api/comments/${getPostId()}`
                await axios.post(url, data)
                    .then(res => {
                        if (res.data) {
                            console.log('res data', res.data)
                            addComment(res.data.comment, res.data.creator)
                        } else {
                            // alert error while commenting
                        }
                    })
            } else {
                activePopup()
            }
        } catch (err) {
            activePopup()
        }
    }


    //get comment data from dom
    const getCommentData = function () {
        const inputText = $('.dis_textarea').val();
        $('.dis_textarea').val('');
        const data = {
            comment: inputText
        }
        return data;
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
                    <a href="" class="like"><span><i class="far fa-heart"></i></span>Like</a>
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
    const toggleCommentManage = async function (event) {
        try {
            const isAuthenticated = await checkAuthenticated();
            if (isAuthenticated) {
                target = $(event.target).parent();
                options = target.find('.action_options')
                console.log('option', options)

                target.toggleClass('active');
                options.toggleClass('active')
            } else {
                activePopup()
            }
        }
        catch (err) {
            activePopup()
        }
    }

    // add reaction to a comment
    const addReactComment = async function (event) {
        event.preventDefault();
        try {
            const isAuthenticated = await checkAuthenticated();
            if (isAuthenticated) {
                console.log('like comment')
            } else {
                activePopup()
            }
        }
        catch (err) {
            activePopup()
        }
    }

    //event listeners
    //create a new comment 
    $('.submit_btn').click(createComment);

    //manage Comment btn event listeners
    $('.dis_card_wrapper').delegate('div.action', "click", toggleCommentManage);
    $('.dis_card_wrapper').delegate('a.like', "click", addReactComment);


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
    const addReplyInput = async function (event) {
        event.preventDefault();
        try {
            const isAuthenticated = await checkAuthenticated();

            if (isAuthenticated) {
                const reac_link = $(event.target).parent().closest('div');
                const children = $('.dis_card_wrapper').find('.reac_reply_input').length

                //check if reply input not added
                if (!children) {
                    const inputTextArea = getReplyInputElement();
                    $(inputTextArea).insertAfter(reac_link);

                    //add event listener to dismiss btn and submit btn
                    $('.dismis_btn').click(removeReplayInput);

                    // replay submit btn event listner
                    $('.reply_submit_btn').click(function (event) {
                        event.preventDefault();
                        getReplyData(event, reac_link);
                    })
                }

            } else {
                activePopup()
            }
        }
        catch (err) {
            activePopup()
        }
    }


    //get replay data
    const getReplyData = function (event, refElement) {

        //get comment id 
        const reac_btn_container = $(event.target).parent()
        const reac_reply_input = reac_btn_container.parent().closest('div');
        const reac_wrapper = reac_reply_input.parent().closest('div');
        const comment_id = reac_wrapper.data().comment_id

        //get input element
        const input = reac_reply_input.children()[0]
        // createReply
        createReply(input, comment_id, refElement)
    }


    //get new Reply element
    const getMewReplyElement = function (reply, creator,) {
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
            <a href="" data-replyId="{{this.id}}">
                <div class="reply_reac_content">
                    <div class="reply_reac_logo">
                        <p><i class="far fa-heart"></i></i></p>
                    </div>
                    <div class="reply_reac_text" data-replyId =${replyId}>
                        <p>Like</p>
                    </div>

                </div>
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

            const url = `http://localhost:3000/article/reply/${postId}/${comment_id}`
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

    }

    //react to a reply
    const addReactReply = async function (event) {
        event.preventDefault();
        try {
            const isAuthenticated = await checkAuthenticated();
            if (isAuthenticated) {
                console.log('like reply')
            } else {
                activePopup()
            }
        }
        catch (err) {
            activePopup()
        }
    }

    //event listeners
    // create a new reply
    $('.dis_card_wrapper').delegate('a.reply', "click", addReplyInput);
    $('.dis_card_wrapper').delegate('a.reply_like', "click", addReactReply);
})