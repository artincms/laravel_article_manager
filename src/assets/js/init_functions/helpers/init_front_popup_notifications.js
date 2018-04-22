function pm_notify(type, title, message) {
    var opts = {
        addclass: "stack-bottomleft"
    };
    switch (type) {
        case 'error':
            opts.title = title;
            opts.text = message;
            opts.type = type;
            break;
        case 'info':
            opts.title = title;
            opts.text = message;
            opts.type = type;
            break;
        case 'success':
            opts.title = title;
            opts.text = message;
            opts.type = type;
            break;
    }
    new PNotify(opts);
}