$(document).ready(function () {

    const baseUrl = `https://debashisblog.herokuapp.com`

    const getIds = function () {

        const pageUrl = $(location).attr("href");
        const pageUrlParts = pageUrl.split('/');
        const commentId = pageUrlParts[pageUrlParts.length - 1]
        const postId = pageUrlParts[pageUrlParts.length - 2]
        return { postId, commentId };

    };

    $('.submit_btn').on("click", async function (event) {

        try {
            const { postId, commentId } = getIds()
            const editedComment = $('.edit_input').val()
            const data = {
                text: editedComment
            }
            const url = baseUrl + `/api/comments/${commentId}`
            const res = await axios.put(url, data);
            if (res.status == 200) {
                window.location.href = baseUrl + `/article/${postId}/#discussion`
            } else {
                //render error
                window.location.href = window.location.href;
            }
        }

        catch (err) {
            window.location.href = window.location.href;
        }

    })


    //cancel btn 
    $('.cancel_btn').on("click", function (event) {
        event.preventDefault();
        const { postId } = getIds()
        //redirect to article page
        window.location.href = baseUrl + `/article/${postId}`

    })
})
