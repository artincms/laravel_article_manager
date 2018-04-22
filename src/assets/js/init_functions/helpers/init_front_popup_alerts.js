function confirmAlert(title, text, type, confirm_button_text, cancel_button_text, func, function_params, confirm_params, cancel_params) {

    var confirm_pars = confirm_params || false;
    var cancel_pars = cancel_params || false;
    $.confirm({
        title: title,
        content: text,
        type: type,
        cancelButton: 'cancel_button_text',
        typeAnimated: true,
        buttons: {
            tryAgain: {
                text: confirm_button_text,
                btnClass: 'btn-danger',
                action: function (confirm_pars) {
                    func(function_params);
                }
            },
            close: {
                text: cancel_button_text,
                action: function (cancel_pars) {
                }
            }
        }
    });
}