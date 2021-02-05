$(document).ready(function () {
    const baseUrl = `http://localhost:3000`

    $(".search").on('keyup', function (e) {
        if (e.key === 'Enter' || e.keyCode === 13) {

            (async function () {
                try {
                    const searchTerm = $(".search").val();
                    const url = baseUrl + '/search'
                    await axios.get(url, {
                        params: {
                            term: searchTerm
                        }
                    })
                        .then(res => {
                            console.log('data', res.data)
                            if (res.data) {
                                const id = res.data.id
                                window.location = baseUrl + `/search/${id}`
                            }
                        })
                }
                catch (err) {
                    console.log(err);
                }
            })();
        }
    })

    const navigation = $('.navigation');
    const overlay = $('.overlay');

    $('.menuToggle').on("click", function () {
        navigation.addClass('active');
        overlay.addClass('active');
    })

    $('.close-btn').on("click", function () {
        navigation.removeClass('active');
        overlay.removeClass('active');
    })
})






