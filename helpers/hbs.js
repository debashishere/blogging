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
    }
}