$(document).ready(function () {

    //api base url
    const baseUrl = `http://localhost:3000`

    //Globals
    let user_id = null;
    let isAuthenticated = false;

    //check if user is authenticated
    (async function () {
        try {
            await checkAuthenticated()
                .then(userId => {
                    if (userId) {
                        user_id = userId;
                        isAuthenticated = true;
                        console.log("user is authenticated", userId)
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        catch (err) {

        }
        console.log('executed')
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
            console.log("in if", isAuthenticated);
            try {
                const postId = getPostId();
                await postPostReact(postId, user_id)
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
            console.log("in else");
            activeLoginPopup();
        }
    }

    //check if user is authenticated
    $('.reac-container').on("click", togglePostReact);


    //get data with post id
    (async function () {
        const postId = getPostId();
        const url = baseUrl + `/api/article/data/${postId}`
        await axios.get(url)
            .then(res => {
                if (res.data.status === 1) {
                    //status is ok 
                    initializeEditor(res.data.editorData);
                } else {
                    //status is not ok render error
                }

            })
            .catch(err => {
                console.log(err)
            })
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