$(document).ready(function () {
    const baseUrl = `https://debashisblog.herokuapp.com`

    const getWeeeklyPost = async function (event) {
        try {
            event.preventDefault();
            $('.feed').removeClass('btn_active');
            $('.monthly').removeClass('btn_active');
            $(event.target).addClass('btn_active');
            const url = baseUrl + `/api/weekly`
            await axios.get(url)
                .then(res => {
                    if (res.data) {
                        renderArticles(res.data);
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
        catch {

        }
    };

    const getMonthlyPost = async function (event) {
        try {
            event.preventDefault();
            $('.feed').removeClass('btn_active');
            $('.weekly').removeClass('btn_active');
            $(event.target).addClass('btn_active');
            const url = baseUrl + `/api/monthly`
            await axios.get(url)
                .then(res => {
                    if (res.data) {
                        renderArticles(res.data);
                    }
                })
                .catch(err => {
                    //render error
                })
        }
        catch {
            //render error
        }
    };

    const renderCard = function (article, index) {
        const row = $(`<div class="row"></div>`);
        if (index === 0) {
            const imageDiv = $(`<div class="imgBx">
                                    <img class="card-img" src="/uploads/cover-images/${article.cover_image}"
                                    alt="Card image">
                                 </div>`)
            row.append(imageDiv)
        }
        const desc = $(
            `<div class="desc">
                <div class="user">
                    <div class="user-img">
                        <img src="${article.user.image}">
                    </div>
                    <div class="user-desc">
                        <a href="#" class="name">${article.user.displayName}</a>
                        <a href="#" class="date">${article.createdAt} (${article.relativeDate})</a>
                    </div>
                </div>
                <div class="card-content">
                    <h3><a href="/article/${article._id}">${article.title}</a></h3>
                    <div class="card-footer">
                        <a href="/article/${article._id}">
                            <span><i class="fas fa-heart"></i></span>
                            <span class="count">${article.reactionCount}</span>reactions
                        </a>
                        <a href="/article/${article._id}/#discussion">
                            <span><i class="far fa-comment-alt"></i></span><span
                            class="count">${article.commentCount}</span>comments
                        </a>
                    </div>
                </div>
            </div>
        `)
        row.append(desc);
        const card = $(`<div class="card"></div>`).append(row);
        $('.post-content').append(card);
    };

    //render each article and append to dom
    const renderArticles = function (articleList) {
        // console.log(articleList)
        $('.post-content').empty();
        articleList.forEach((article, index) => {
            renderCard(article, index);
        })
    };

    $('.weekly').on("click", getWeeeklyPost);
    $('.monthly').on("click", getMonthlyPost);
})