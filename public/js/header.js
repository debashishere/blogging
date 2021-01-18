
window.addEventListener('DOMContentLoaded', function () {
    console.log("header")
    const navigation = document.querySelector('.navigation');
    const overlay = document.querySelector('.overlay');
    const menuToggle = document.querySelector('.menuToggle');
    const closeBtn = document.querySelector('.close-btn');

    menuToggle.onclick = function () {
        navigation.classList.add('active');
        overlay.classList.add('active');
    }

    closeBtn.onclick = function () {
        navigation.classList.remove('active');
        overlay.classList.remove('active');
    }
})



