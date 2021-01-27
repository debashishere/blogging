$(document).ready(function () {
    console.log("header")
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






