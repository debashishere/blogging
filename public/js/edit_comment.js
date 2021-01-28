$(document).ready(function () {

    //api base url
    const baseUrl = `https://agile-lake-43990.herokuapp.com`

    //get id from url
    const getId = function () {
        const pageUrl = $(location).attr("href");
        const pageUrlParts = pageUrl.split('/');
        const commentId = pageUrlParts[pageUrlParts.length - 1]
        const postId = pageUrlParts[pageUrlParts.length - 2]

        return { postId, commentId };
    };

    $('.submit_btn').on("click", async function (event) {
        try {
            const { postId, commentId } = getId()
            const editedComment = $('.edit_input').val()
            const data = {
                text: editedComment
            }

            const url = baseUrl + `/api/comments/${postId}/${commentId}`
            const isUpdated = await axios.put(url, data);
            if (isUpdated.data) {
                //redirect to the article
                window.location.href = baseUrl + `/article/${postId}`

            } else {
                //reload
                window.location.href = window.location.href;
            }

        }
        catch (err) {
            console.log("error");
        }

    })


    //cancel btn 
    $('.cancel_btn').on("click", function (event) {
        event.preventDefault();
        const { postId } = getId()
        //redirect to article page
        window.location.href = baseUrl + `/article/${postId}`

    })
})
