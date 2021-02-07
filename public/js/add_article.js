$(document).ready(function () {

    //api base url
    const baseUrl = `https://debashisblog`

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
            //upload cover image once selected
            $("#cover-image-Input").change(async function () {

                const formData = new FormData();
                formData.append("cover_image", this.files[0])
                //send to backend
                const url = baseUrl + `/api/upload/new/cover/${getPostId()}`
                const res = await axios.post(url, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                if (res.data) {
                    // show cover image
                    $('#cover-imageBx').css({ "height": "300px", "width": "100%" })
                    $('#cover_image').attr('src', res.data.path).css({ "object-fit": "contain" });

                } else {
                    //render error
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
                        //satus of the post 
                        const data = {
                            editorData: outputData,
                            title: title,
                            status: status
                        }
                        // send data to backend
                        const url = baseUrl + `/api/article/new`
                        const res = await axios.post(url, data)
                        if (res.status == 201) {
                            const redirectUrl = baseUrl + `/dashboard`
                            window.location.href = redirectUrl;
                        }
                    })

                    .catch((error) => {
                        console.log('Saving failed: ', error)
                    });
            })
        } catch (reason) {
            // console.log(`Editor.js initialization failed because of ${reason}`)
        }
    }

    initializeEditor();

    //text area auto resize
    $('#post_title').on('input', function () {

        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';

    });
})



