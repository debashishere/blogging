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

    //get data with post id
    (async () => {

        try {
            const postId = getPostId();
            const data = await getEditPostDataById(postId)
            initializeEditor(data.editorData);
            initializeEdit(data.cover_image_path, data.title, data.status)
        }

        catch (err) {
            console.log(err);
            //render error
        }

    })();

    // initialize field with post data
    const initializeEdit = function (cover_image_path, title, status) {

        console.log('img path', cover_image_path)
        if (cover_image_path) {
            $('#cover-imageBx').css({ "height": "300px", "width": "100%" })
            $('#cover_image').attr('src', cover_image_path).css({ "object-fit": "contain" });;
        }
        $('#post_title').val(title);
        $("#status").val(status);
    };

    // initialize editorjs with required tools
    const initializeEditor = async function (postData) {

        var editor = new EditorJS({
            holder: 'editorjs',
            placeholder: 'Let`s write an awesome story!',
            tools: {
                header: {
                    class: Header,
                    config: {
                        placeholder: 'Enter a header',
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
            data: postData
        });

        try {
            await editor.isReady
            //update cover image once selected
            $("#cover-image-Input").change(async function () {

                try {
                    // craete Formdata object
                    const formData = new FormData();
                    formData.append("cover_image", this.files[0])
                    formData.append("edit", true)
                    //send to backend
                    const url = baseUrl + `/api/upload/update/cover/${getPostId()}`
                    const res = await axios.post(url, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    })
                    if (res.data) {
                        // show updated cover image
                        $('#cover-imageBx').css({ "height": "300px", "width": "100%" })
                        $('#cover_image').attr('src', res.data.path);
                    }
                }

                catch (err) {

                }
            });

            // click event handler for CREATE button
            $(".create-article").click(function () {
                // get satatus od the post
                const status = $('#status  option:selected').text();
                //get title of the post
                const title = $('#post_title').val();
                editor.save()
                    .then(async (outputData) => {
                        try {
                            const url = baseUrl + `/api/article/update/${getPostId()}`
                            //satus of the post 
                            const data = {
                                editorData: outputData,
                                title: title,
                                status: status
                            }
                            // send data to backend

                            const res = await axios.put(url, data)
                            if (res.status == 200) {
                                const redirectUrl = baseUrl + `/dashboard`
                                //redirect to dashbord
                                window.location.href = redirectUrl;
                            }
                        }

                        catch (err) {
                            //post not created render Error
                        }

                    })
                    .catch((error) => {
                        // console.log('Saving failed: ', error)
                    });
            })

            // })
        }
        catch (reason) {
            // console.log(`Editor.js initialization failed because of ${reason}`)
        }
    }
})