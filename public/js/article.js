$(document).ready(function () {

    //api base url
    const baseUrl = `https://debashisblog.herokuapp.com`

    //Globals
    let user_id = null;
    let isAuthenticated = false;

    //check if user is authenticated
    (async function () {

        const res = await checkAuthenticated();
        if (res.data) {
            user_id = res.data;
            isAuthenticated = true;
        } else {
            return;
        }

    })();


    // get post id from url 
    const getPostId = function () {
        const pageUrl = $(location).attr("href");
        const pageUrlParts = pageUrl.split('/');
        const postId = pageUrlParts[pageUrlParts.length - 1]
        return postId;
    };

    //popup modal
    const activeLoginPopup = function () {
        $('.login_modal').addClass('active');
        $('.login_overlay').addClass('active');
    }

    //manage post's like count
    const manageReactCount = function (count) {
        const element = $('.reac_count')
        element.text(count);
        return;
    }

    // like unlike a post
    const togglePostReact = async function (event) {
        event.preventDefault();

        if (isAuthenticated) {
            const postId = getPostId();
            const resData = await postPostReact(postId, user_id);

            if (resData) {
                const count = resData.reactionCount;
                manageReactCount(count);
                // //turn logo red
                $('.logo').toggleClass('active');
            } else {
                // render error
            }
        }

        else {
            activeLoginPopup();
        }
    }

    //check if user is authenticated
    $('.reac-container').on("click", togglePostReact);


    //get data with post id
    (async function () {
        const postId = getPostId();
        const data = await getPostById(postId);
        if (data) {
            initializeEditor(data.editorData);
        }
        else {
            //render error
        }

    })();

    // initialize editorjs with tools and read only mode
    const initializeEditor = async function (postDate) {
        var editor = new EditorJS({

            holder: 'editorjs',
            tools: {
                header: {
                    class: Header,
                    config: {
                        levels: [1, 2, 3, 4],
                        defaultLevel: 3
                    }
                },
                list: {
                    class: List,
                    inlineToolbar: true,
                },
                embed: {
                    class: Embed,
                    config: {
                        services: {
                            youtube: true
                        }
                    }
                },
            },
            readOnly: true,
            data: postDate
        });

        try {
            await editor.isReady
                .then(() => {
                    // console.log('Editor.js is ready to work!')
                    /** Do anything you need after editor initialization */
                })
        }

        catch (reason) {
            // console.log(`Editor.js initialization failed because of ${reason}`)
        }
    }


})