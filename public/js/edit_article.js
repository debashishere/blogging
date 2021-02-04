$(document).ready(function () {

    const baseUrl = `http://localhost:3000`

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
            const url = baseUrl + `/api/article/edit/data/${getPostId()}`

            await axios.get(url)
                .then(res => {
                    console.log('edit data', res.data);
                    if (res.data.req_status === 1) {
                        //status is ok
                        //initialize editor with data 
                        initializeEditor(res.data.editorData);
                        //initialize other fields
                        initializeEdit(res.data.cover_image_path, res.data.title, res.data.status)
                    } else {
                        //status is not ok render error
                        console.log("error")
                    }

                })
                .catch(err => {
                    console.log(err)
                })
        }
        catch (error) {
            console.log(error)
        }
    })();

    // initialize field with post data
    const initializeEdit = function (cover_image_path, title, status) {
        console.log('status', status);
        //set cover image
        $('#cover-imageBx').css({ "height": "300px", "width": "100%" })
        console.log("cover img", cover_image_path)
        $('#cover_image').attr('src', cover_image_path).css({ "object-fit": "cover" });;

        //set title
        $('#post_title').val(title);
        //set select value
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
            //initialization data
            data: postData
        });

        try {
            await editor.isReady
                .then(() => {
                    console.log('Editor.js is ready to work!')
                    /** Do anything you need after editor initialization */

                    //update cover image once selected
                    $("#cover-image-Input").change(async function () {
                        //ToDO: validate file
                        // craete Formdata object
                        const formData = new FormData();
                        //append file 
                        formData.append("cover_image", this.files[0])

                        //set edit flag treu
                        formData.append("edit", true)

                        //send to backend
                        const url = baseUrl + `/upload/update/cover/${getPostId()}`
                        await axios.post(url, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(res => {
                                if (res.data.status === 1) {
                                    // show updated cover image
                                    $('#cover-imageBx').css({ "height": "300px", "width": "100%" })
                                    $('#cover_image').attr('src', res.data.path);

                                } else {
                                    //render error
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            })
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
                                    //satus of the post 
                                    const data = {
                                        editorData: outputData,
                                        title: title,
                                        status: status
                                    }

                                    const url = baseUrl + `/api/article/update/${getPostId()}`
                                    // send data to backend
                                    await axios.put(url, data)
                                        .then(res => {
                                            console.log(res.data.status);
                                            //chcek status ( 1 -> post created)
                                            if (res.data.status === 1) {

                                                //redirect to dashbord
                                                window.location.href = baseUrl + "/dashboard"
                                            } else {
                                                console.log("Err 1")
                                            }
                                        })
                                        .catch(err => {
                                            //post not created render Error
                                            console.log("Error ", err)
                                        })
                                }
                                catch (err) {

                                    //post not created render Error
                                    console.log("Error While creating the post", err)
                                }

                                console.log('Article data: ', outputData);

                            })
                            .catch((error) => {
                                console.log('Saving failed: ', error)
                            });
                    })

                })
                .catch(err => {
                })

        }
        catch (reason) {
            console.log(`Editor.js initialization failed because of ${reason}`)
        }

    }


})