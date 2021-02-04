
const baseUrl = 'https://debashisblog.herokuapp.com'

const getPostData = async function (postId) {
    const url = baseUrl + `/api/article/data/${postId}`
    const data = await axios.get(url)
        .then(res => {
            if (res.data.status === 1) {
                return res.data;
            } else {
                //status is not ok render error
                return false;
            }
        })
        .catch(err => {
            console.log(err);
            return false;
        })
    return data;
}

//return true if authenticated
const checkAuthenticated = async function () {
    const url = baseUrl + `/auth/authenticated`
    const userId = await axios.get(url)
        .then(res => {
            if (res.data) {
                return res.data;
            } else {
                return false
            }
        })
    return userId
}

// POST comment Data
const postComment = async function (postId, data) {
    try {
        const url = baseUrl + `/api/comments/${postId}`
        const resData = await axios.post(url, data)
            .then(res => {
                if (res.data) {
                    return res.data;
                } else {
                    return false;
                }
            })
        return resData;
    }
    catch (err) {
        return false;
    }
}

//POST reply Data
const postReply = async function (postId, commentId, data) {
    try {
        const url = baseUrl + `/api/reply/${postId}/${commentId}`
        const resData = await axios.post(url, data)
            .then(res => {
                if (res.data) {
                    const data = {
                        reply: res.data.reply,
                        creator: res.data.creator
                    }
                    return data;
                }
            })
            .catch(err => {
                return false;
            })
        return resData;
    }
    catch (err) {
        return false;
    }
}

//POST comment Reaction
const postCommentReact = async function (commentId, data) {
    try {
        const url = baseUrl + `/api/comments/like/${commentId}`
        const status = await axios.post(url, data)
            .then(res => {
                if (res.data) {
                    return res.data;
                } else {
                    return false;
                }
            })
        return status;
    }
    catch (err) {
        return false;
    }
}

//POST Reply Reaction
const postReplyReact = async function (commentId, replyId, data) {
    try {
        const url = baseUrl + `/api/reply/like/${commentId}/${replyId}`
        const status = await axios.post(url, data)
            .then(res => {
                if (res.data) {
                    return res.data;
                } else {
                    return false;
                }
            })
        return status;
    }
    catch (err) {
        return false;
    }
}

//POST Article Reaction
const postPostReact = async function (postId, userId) {
    try {
        console.log(postId, userId)
        const url = baseUrl + `/api/article/like/${postId}/${userId}`
        const status = await axios.post(url)
            .then(res => {
                if (res.data) {
                    return res.data;
                } else {
                    return false;
                }
            })
        return status;
    }
    catch (err) {
        return false;
    }
}

