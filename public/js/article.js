$(document).ready(function () {

    let isAuthenticated = false;
    let userId;
    (async function () {
        try {
            await checkAuthenticated()
                .then(user_id => {
                    if (user_id) {
                        console.log('ckecked', user_id)
                        isAuthenticated = true;
                        userId = user_id;
                    }
                })
        }
        catch (err) {
            // auth rerror
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
        //set new count
        element.text(count);
        return;
    }

    const togglePostReact = async function (event) {
        event.preventDefault();
        if (isAuthenticated) {
            try {
                const postId = getPostId();
                await postPostReact(postId, userId)
                    .then(res => {
                        if (res) {
                            const count = res.reactionCount;
                            manageReactCount(count);
                            // //turn logo red
                            $('.logo').toggleClass('active');
                        }
                    })
            }
            catch (err) {
            }
        } else {
            activeLoginPopup();
        }
    }

    //check if user is authenticated
    $('.reac-container').on("click", togglePostReact);


    //get data with post id
    (async function () {
        try {
            const postId = getPostId();
            const data = await getPostData(postId);
            if (data.status === 1) {
                //status is ok 
                initializeEditor(data.editorData);
            } else {
                //status is not ok render error
            }
        } catch (err) {
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
                    console.log('Editor.js is ready to work!')
                    /** Do anything you need after editor initialization */



                })
        }

        catch (reason) {
            console.log(`Editor.js initialization failed because of ${reason}`)
        }
    }


})