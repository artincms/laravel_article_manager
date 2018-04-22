function style_check_password_strength(passed) {
    var color = "";
    var background = "";
    var strength = "";
    switch (passed) {
        case 0:
        case 1:
            strength = "ضعیف";
            color = "red";
            background = "#fbe2e2";
            break;
        case 2:
            strength = "متوسط";
            color = "#9C7454";
            background = "#ffc47d";
            break;
        case 3:
            strength = "خوب";
            color = "#076d93";
            background = "#b1f3ff";
            break;
        case 4:
            strength = "قوی";
            color = "green";
            background = "#a1daad";
            break;
        case 5:
            strength = "خیلی قوی";
            color = "darkgreen";
            background = "#48c36d";
            break;
    }
    return {'result': passed, 'strength': strength, 'color': color, 'background': background}
}
function checkPasswordStrength(password) {
    //Regular Expressions.
    var regex = new Array();
    regex.push("[A-Z]"); //Uppercase Alphabet.
    regex.push("[a-z]"); //Lowercase Alphabet.
    regex.push("[0-9]"); //Digit.
    regex.push("[$@$!%*#?&]"); //Special Character.

    var passed = 0;

    //Validate for each Regular Expression.
    for (var i = 0; i < regex.length; i++) {
        if (new RegExp(regex[i]).test(password)) {
            passed++;
        }
    }

    //Validate for length of Password.
    if (passed > 2 && password.length > 8) {
        passed++;
    }

    return style_check_password_strength(passed);
}

function init_bindCheckPasswordStrength(input_selector, message_selector) {
    $(document).on("keyup", input_selector, function () {
        message_selector = $(message_selector) || false;
        input_selector = $(input_selector) || false;
        password = input_selector.val();

        console.log(message_selector, input_selector, password);
        if (password.length == 0) {
            message_selector.fadeOut();
            return;
        }
        else {
            message_selector.fadeIn();
        }

        //Regular Expressions.
        var regex = new Array();
        regex.push("[A-Z]"); //Uppercase Alphabet.
        regex.push("[a-z]"); //Lowercase Alphabet.
        regex.push("[0-9]"); //Digit.
        regex.push("[$@$!%*#?&]"); //Special Character.

        var passed = 0;

        //Validate for each Regular Expression.
        for (var i = 0; i < regex.length; i++) {
            if (new RegExp(regex[i]).test(password)) {
                passed++;
            }
        }

        //Validate for length of Password.
        if (passed > 2 && password.length > 8) {
            passed++;
        }

        var style_res = style_check_password_strength(passed);

        if (message_selector == false) {
            return style_res;
        }
        else {
            message_selector.html(style_res.strength);
            message_selector.css({color: style_res.color});
            message_selector.css({background: style_res.background});
        }
    });
}