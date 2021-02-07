
const baseUrl = `http://localhost:3000`

//return true if authenticated
const checkAuthenticated = async function () {

    try {
        const url = baseUrl + `/auth/authenticated`
        const userId = await axios.get(url);
        return userId
    }

    catch (err) {
        // console.log('error occured', err);
        return false;
    }
}

//POST reply Data
const postReply = async function (postId, commentId, data) {

    try {
        const url = baseUrl + `/api/reply/${postId}/${commentId}`
        const res = await axios.post(url, data)
        console.log('res', res)
        const newReply = {
            reply: res.data.reply,
            creator: res.data.creator
        }
        return newReply;
    }

    catch (err) {
        return false;
    }
}

//POST comment Reaction
const postCommentReact = async function (commentId, data) {

    try {
        const url = baseUrl + `/api/comments/like/${commentId}`
        const res = await axios.post(url, data)
        return res.data
    }

    catch (err) {
        console.log(err)
        return false;
    }
}

//POST Reply Reaction
const postReplyReact = async function (commentId, replyId, data) {

    try {
        const url = baseUrl + `/api/reply/like/${commentId}/${replyId}`
        const res = await axios.post(url, data)
        return res.data;
    }

    catch (err) {
        return false;
    }

}

//POST Article Reaction
const postPostReact = async function (postId, userId) {

    try {
        const url = baseUrl + `/api/article/like/${postId}/${userId}`
        const res = await axios.post(url)
        return res.data;
    }

    catch (err) {
        return false;
    }

}

//get post data with id
const getPostById = async function (id) {

    try {
        const url = baseUrl + `/api/article/data/${id}`
        const res = await axios.get(url);
        return res.data;
    }

    catch (err) {
        console.log(err);
        return false;
    }
}

//create a single comment
const createCommentByArticle = async function (postId, data) {

    try {
        const url = baseUrl + `/api/comments/${postId}`
        const res = await axios.post(url, data)
        return res.data;
    }

    catch (err) {
        return false;
    }

}

const getEditPostDataById = async function (postId) {

    try {
        const url = baseUrl + `/api/article/edit/data/${postId}`
        const res = await axios.get(url)
        return res.data;
    }

    catch (err) {
        return err;
    }

}