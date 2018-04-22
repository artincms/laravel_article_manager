window.number_with_separator_inputs = [];
function init_autoNumeric(selector, variable_name, Options) {
    variable_name = variable_name || 'v';
    remove_old_init_autoNumeric(variable_name);
    //remove_all_old_init_autoNumeric();

    selector = selector || '.number_with_separator';
    Options = Options || {
            modifyValueOnWheel: false,
            maximumValue: '9999999999999.99999',
            leadingZero: 'deny',
            decimalPlaces: '0',
            digitGroupSeparator: ',',
            decimalCharacter: '.',
            decimalCharacterAlternative: ',',
            //currencySymbol: 'ريال',
            unformatOnSubmit: true,
            currencySymbolPlacement: AutoNumeric.options.currencySymbolPlacement.suffix,
            roundingMethod: 'U'
        };
    $(selector).addClass('text-left ltr');
    $(function () {
        window['number_with_separator_inputs'][variable_name] = new AutoNumeric.multiple(selector, Options);
        //console.log(window.number_with_separator_inputs);
    });
}
//https://github.com/autoNumeric/autoNumeric#perform-actions-globally-on-a-shared-list-of-autonumeric-elements
//init_autoNumeric('.d',{});
function remove_old_init_autoNumeric(variable_name) {
    variable_name = variable_name || 'v';
    variable_name_inputs = window['number_with_separator_inputs'][variable_name];
    for (element_key in variable_name_inputs) {
        element = variable_name_inputs[element_key];
        element.remove();
        //console.log(element_key);
    }
}

function remove_all_old_init_autoNumeric() {
    var all_inputs = window['number_with_separator_inputs'];
    for (variable_name in all_inputs) {
        variable_value = all_inputs[variable_name];
        for (element_key in variable_value) {
            element = variable_value[element_key];
            element.remove();
            // console.log(element);
        }
    }
}

function reformat_inited_element_autoNumeric(variable_name) {
    variable_name = variable_name || 'v';
    try {
        for (element_key in variable_value) {
            element = variable_value[element_key];
            element.global.reformat();
            element.reformat();
        }
    } catch (err) {
        console.log(err);
    }
}

function unformat_inited_element_autoNumeric(variable_name) {
    variable_name = variable_name || 'v';
    variable_value = window['number_with_separator_inputs'][variable_name];
    try {
        for (element_key in variable_value) {
            element = variable_value[element_key];
            element.global.unformat();
            element.unformat();
        }
    } catch (err) {
        console.log(err);
    }
}

function reformat_all_elements_autoNumeric() {
    try {
        var all_inputs = window['number_with_separator_inputs'];
        for (variable_name in all_inputs) {
            variable_value = all_inputs[variable_name];
            for (element_key in variable_value) {
                element = variable_value[element_key];
                element.global.reformat();
                element.reformat();
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function unformat_all_elements_autoNumeric() {
    try {
        var all_inputs = window['number_with_separator_inputs'];
        for (variable_name in all_inputs) {
            variable_value = all_inputs[variable_name];
            for (element_key in variable_value) {
                element = variable_value[element_key];
                element.global.unformat();
                element.unformat();
            }
        }
    } catch (err) {
        console.log(err);
    }
}

function set_value_to_inited_element_autoNumeric(variable_name,value) {
    value = value || 0;
    variable_name = variable_name || 'v';
    variable_value = window['number_with_separator_inputs'][variable_name];
    try {
        for (element_key in variable_value) {
            element = variable_value[element_key];
            element.set(value);
        }
    } catch (err) {
        console.log(err);
    }
}