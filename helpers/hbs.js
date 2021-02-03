const moment = require('moment');


module.exports = {
    select: function (selected, options) {
        return options
            .fn(this)
            .replace(
                new RegExp('>' + selected + '"'),
                ' $& selected="selected"'
            )
            .replace(
                new RegExp('>' + selected + '</option>'),
                ' selected="selected"$&'
            )
    },
    getFormatedDate: function (date) {
        const formatedDate = moment(date).format("MMM Do")
        return formatedDate;
    },
    getRelativeDate: function (date) {
        const fromNow = moment(date).fromNow();
        return fromNow;
    },
    isCreator: function (creatorId, userId, options) {
        if (creatorId.equals(userId)) {
            return options.fn(this);
        } else {
            return options.inverse(this);
        }
    },

}