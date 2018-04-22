function button_loader_init(selector, type, old_icon_class, new_icon_class) {
    type = type || false;
    if (type) {
        $(selector).children('i').removeClass(old_icon_class);
        $(selector).children('i').addClass(new_icon_class);
        $(selector).children('i').prop("disabled", true);
        $(selector).css('cursor', 'wait');
        $(selector).children('i').addClass('spinner');
    }
    else {
        $(selector).children('i').removeClass(new_icon_class);
        $(selector).children('i').addClass(old_icon_class);
        $(selector).children('i').prop("disabled", false);
        $(selector).css('cursor', 'pointer');
        $(selector).children('i').removeClass('spinner');
    }

}