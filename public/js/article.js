$(document).ready(function () {

    // get post id from url 
    const getPostId = function () {
        const pageUrl = $(location).attr("href");
        const pageUrlParts = pageUrl.split('/');
        const postId = pageUrlParts[pageUrlParts.length - 1]
        return postId;
    }

    const postId = getPostId();
    const url = `http://localhost:3000/article/data/${postId}`

    axios.get(url)
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