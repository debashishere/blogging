$(document).ready(function () {

    //get id from url
    const getPostId = function () {
        const pageUrl = $(location).attr("href");
        const pageUrlParts = pageUrl.split('/');
        const postId = pageUrlParts[pageUrlParts.length - 1]
        return postId;
    };

    // initialize editorjs with required tools
    const initializeEditor = async function () {

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
        });

        try {
            await editor.isReady
                .then(() => {
                    // console.log('Editor.js is ready to work!')
                    /** Do anything you need after editor initialization */

                    //upload cover image once selected
                    $("#cover-image-Input").change(async function () {
                        //ToDO: validate file
                        // craete Formdata object
                        const formData = new FormData();
                        //append file 
                        formData.append("cover_image", this.files[0])

                        //send to backend
                        const url = `http://localhost:3000/upload/new/cover/${getPostId()}`
                        await axios.post(url, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        })
                            .then(res => {
                                if (res.data.status === 1) {
                                    // show cover image
                                    $('#cover-imageBx').css({ "height": "300px", "width": "100%" })
                                    $('#cover_image').attr('src', res.data.path).css({ "object-fit": "cover" });

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
                                    // send data to backend
                                    await axios.post('http://localhost:3000/api/article/new', data)
                                        .then(res => {
                                            console.log(res.data.status);
                                            //chcek status ( 1 -> post created)
                                            if (res.data.status === 1) {

                                                //redirect to dashbord
                                                window.location.href = "http://localhost:3000/dashboard"
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

        } catch (reason) {
            console.log(`Editor.js initialization failed because of ${reason}`)
        }
    }

    initializeEditor();

    //text area auto resize
    $('#post_title').on('input', function () {
        this.style.height = 'auto';

        this.style.height =
            (this.scrollHeight) + 'px';
    });

    // close button event handler


})



