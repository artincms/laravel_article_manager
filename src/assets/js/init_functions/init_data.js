$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
var CommonDom_DataTables = '<"datatable-header"fl><"datatable-scroll"t><"datatable-footer"ip>';
var LangJson_DataTables = {
    "decimal": "",
    "emptyTable": "هیچ داده ای در جدول وجود ندارد",
    "info": "نمایش _START_ تا _END_ از _TOTAL_ رکورد",
    "infoEmpty": "نمایش 0 تا 0 از 0 رکورد",
    "infoFiltered": "(فیلتر شده از _MAX_ رکورد)",
    "infoPostFix": "",
    "thousands": ",",
    "lengthMenu": "نمایش _MENU_ رکورد",
    "loadingRecords": "در حال بارگزاری...",
    "processing": "در حال پردازش...",
    "search": "جستجو: ",
    "zeroRecords": "رکوردی با این مشخصات پیدا نشد",
    "paginate": {
        "first": "ابتدا",
        "last": "انتها",
        "next": "بعدی",
        "previous": "قبلی"
    },
    "aria": {
        "sortAscending": ": فعال سازی نمایش به صورت صعودی",
        "sortDescending": ": فعال سازی نمایش به صورت نزولی"
    }
};

$.extend($.fn.dataTable.defaults, {
    autoWidth: false,
    dom: CommonDom_DataTables,
    language: LangJson_DataTables,
    processing: true,
    serverSide: true,
    drawCallback: function () {
        $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
    },
    preDrawCallback: function () {
        $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
    }
});

function dataTablesGrid(selector, var_grid_name, url, columns, more_data, initComplete, scrollX, scrollY, scrollCollapse, orderBy, orderByDesc, row_select) {
    scrollX = scrollX || false;
    scrollY = scrollY || false;
    scrollCollapse = scrollCollapse || false;
    orderBy = orderBy || 0;
    orderByDesc = orderByDesc || "desc";
    more_data = more_data || {};
    row_select = row_select || false;
    var columnDefs = [];
    window[var_grid_name + '_rows_selected'] = [];
    if (row_select) {
        checkbox_column = {
            title: '<input name="select_all" value="1" type="checkbox"/>',
            searchable: false,
            orderable: false,
            width: '1%',
            className: 'dt-body-center',
            render: function (data, type, full, meta) {
                return '<input type="checkbox">';
            }
        };
        columns.unshift(checkbox_column);
    }

    var dataTableOptionObj =
        {
            initComplete: function () {
                if (initComplete == true) {
                    this.api().columns().every(function () {
                        var column = this;
                        var select = $('<select class="filter-select" data-placeholder="Filter"><option value=""></option></select>')
                            .appendTo($(column.footer()).not(':last-child').empty())
                            .on('change', function () {
                                var val = $.fn.dataTable.util.escapeRegex(
                                    $(this).val()
                                );
                                column.search(val ? '^' + val + '$' : '', true, false).draw();
                            });
                        column.data().unique().sort().each(function (d, j) {
                            select.append('<option value="' + d + '">' + d + '</option>')
                        });
                    });
                }
            },
            ajax: {
                url: url,
                type: 'POST',
                data: more_data
            },
            columns: columns,
            scrollX: scrollX,
            scrollY: scrollY,
            scrollCollapse: scrollCollapse,
            order: [[ orderBy, orderByDesc ]],
            rowCallback: function (row, data, dataIndex) {
                if (row_select) {
                    var rowId = data;
                    //console.log(data,'-----',window[var_grid_name + '_rows_selected']);
                    // If row ID is in the list of selected row IDs
                    //console.log('id',data['id'],window[var_grid_name + '_rows_selected']);
                    if (func_search_in_obj('id', data['id'], window[var_grid_name + '_rows_selected'])) {
                        $(row).find('input[type="checkbox"]').prop('checked', true);
                        $(row).addClass('selected');
                    }
                }
            },
            destroy: true
        };

    if(!scrollY)
    {
        delete  dataTableOptionObj.scrollY;
        delete  dataTableOptionObj.scrollCollapse;
    }

    window[var_grid_name] = $(selector).DataTable(dataTableOptionObj);

    if (row_select) {
        $(selector).on('click', 'input[type="checkbox"]', function (e) {
            var $row = $(this).closest('tr');
            // Get row data
            var data = window[var_grid_name].row($row).data();
            //console.log(data);
            // Get row ID
            //var rowId = data['id'];
            var rowId = data;
            // Determine whether row ID is in the list of selected row IDs
            var index = $.inArray(rowId, window[var_grid_name + '_rows_selected']);
            // If checkbox is checked and row ID is not in list of selected row IDs
            if (this.checked && index === -1) {
                window[var_grid_name + '_rows_selected'].push(rowId);
                // Otherwise, if checkbox is not checked and row ID is in list of selected row IDs
            } else if (!this.checked && index !== -1) {
                window[var_grid_name + '_rows_selected'].splice(index, 1);
            }
            if (this.checked) {
                $row.addClass('selected');
            } else {
                $row.removeClass('selected');
            }
            // Update state of "Select all" control
            updateDataTableSelectAllCtrl(window[var_grid_name]);
            // Prevent click event from propagating to parent
            e.stopPropagation();
        });

        // Handle click on table cells with checkboxes
        $(selector).on('click', 'tbody td, thead th:first-child', function (e) {
            $(this).parent().find('input[type="checkbox"]').trigger('click');
        });

        // Handle click on "Select all" control
        $('thead input[name="select_all"]', window[var_grid_name].table().container()).on('click', function (e) {
            if (this.checked) {
                $(selector + ' tbody input[type="checkbox"]:not(:checked)').trigger('click');
            } else {
                $(selector + ' tbody input[type="checkbox"]:checked').trigger('click');
            }

            // Prevent click event from propagating to parent
            e.stopPropagation();
        });

        // Handle table draw event
        window[var_grid_name].on('draw', function () {
            // Update state of "Select all" control
            updateDataTableSelectAllCtrl(window[var_grid_name]);
        });
    }
}

function updateDataTableSelectAllCtrl(table) {
    var $table = table.table().node();
    var $chkbox_all = $('tbody input[type="checkbox"]', $table);
    var $chkbox_checked = $('tbody input[type="checkbox"]:checked', $table);
    var chkbox_select_all = $('thead input[name="select_all"]', $table).get(0);

    // If none of the checkboxes are checked
    if ($chkbox_checked.length === 0) {
        chkbox_select_all.checked = false;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }
        // If all of the checkboxes are checked
    } else if ($chkbox_checked.length === $chkbox_all.length) {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = false;
        }
        // If some of the checkboxes are checked
    } else {
        chkbox_select_all.checked = true;
        if ('indeterminate' in chkbox_select_all) {
            chkbox_select_all.indeterminate = true;
        }
    }
}


/*function confirm_alert(title,text_message,type,function_name,confirmButtonText,cancelButtonText) {
 title = title || "بعد از حذف دیگر به این مورد دسترسی نخواهید داشت!";
 text_message = text_message || "بعد از حذف دیگر به این مورد دسترسی نخواهید داشت!";
 type = type || "warning";
 confirmButtonText = confirmButtonText || "بله، حذف شود!";
 cancelButtonText = cancelButtonText || "خیر، منصرف شدم!";
 swal({
 title: title,
 text: text_message,
 type: type,
 showCancelButton: true,
 confirmButtonColor: "#EF5350",
 confirmButtonText: confirmButtonText,
 cancelButtonText: cancelButtonText,
 closeOnConfirm: false,
 closeOnCancel: false
 },
 function (isConfirm) {
 if (isConfirm) {
 deleteWorkerUser(worker_id);
 swal({
 title: "Deleted!",
 text: "Your imaginary file has been deleted.",
 confirmButtonColor: "#66BB6A",
 type: "success"
 });
 }
 else {
 swal({
 title: "Cancelled",
 text: "Your imaginary file is safe :)",
 confirmButtonColor: "#2196F3",
 type: "error"
 });
 }
 });
 }*/
function clear_form_elements(selector) {
    selector = selector || 'document';
    $(ele).find(':input').each(function () {
        switch (this.type) {
            case 'password':
            case 'select-multiple':
            case 'select-one':
            case 'text':
            case 'textarea':
                $(this).val('');
                break;
            case 'checkbox':
            case 'radio':
                this.checked = false;
        }
    });
}
var modalTemplate = '<div class="modal-dialog modal-lg" role="document">\n' +
    '  <div class="modal-content">\n' +
    '    <div class="modal-header">\n' +
    '      <div class="kv-zoom-actions btn-group">{toggleheader}{fullscreen}{borderless}{close}</div>\n' +
    '      <h6 class="modal-title">{heading} <small><span class="kv-zoom-title"></span></small></h6>\n' +
    '    </div>\n' +
    '    <div class="modal-body">\n' +
    '      <div class="floating-buttons btn-group"></div>\n' +
    '      <div class="kv-zoom-body file-zoom-content"></div>\n' + '{prev} {next}\n' +
    '    </div>\n' +
    '  </div>\n' +
    '</div>\n';

// Buttons inside zoom modal
var previewZoomButtonClasses = {
    toggleheader: 'btn btn-default btn-icon btn-xs btn-header-toggle',
    fullscreen: 'btn btn-default btn-icon btn-xs',
    borderless: 'btn btn-default btn-icon btn-xs',
    close: 'btn btn-default btn-icon btn-xs'
};

// Icons inside zoom modal classes
var previewZoomButtonIcons = {
    prev: '<i class="icon-arrow-right32"></i>',
    next: '<i class="icon-arrow-left32"></i>',
    toggleheader: '<i class="icon-menu-open"></i>',
    fullscreen: '<i class="icon-screen-full"></i>',
    borderless: '<i class="icon-alignment-unalign"></i>',
    close: '<i class="icon-cross3"></i>'
};

// File actions
var fileActionSettings = {
    zoomClass: 'btn btn-link btn-xs btn-icon',
    zoomIcon: '<i class="icon-zoomin3"></i>',
    dragClass: 'btn btn-link btn-xs btn-icon',
    dragIcon: '<i class="icon-three-bars"></i>',
    removeClass: 'btn btn-link btn-icon btn-xs',
    removeIcon: '<i class="icon-trash"></i>',
    indicatorNew: '<i class="icon-file-plus text-slate"></i>',
    indicatorSuccess: '<i class="icon-checkmark3 file-icon-large text-success"></i>',
    indicatorError: '<i class="icon-cross2 text-danger"></i>',
    indicatorLoading: '<i class="icon-spinner2 spinner text-muted"></i>'
};
function init_file_style(selector, object_options) {
    object_options = object_options || {
            browseLabel: 'Browse',
            browseIcon: '<i class="icon-file-plus"></i>',
            uploadIcon: '<i class="icon-file-upload2"></i>',
            removeIcon: '<i class="icon-cross3"></i>',
            layoutTemplates: {
                icon: '<i class="icon-file-check"></i>',
                modal: modalTemplate
            },
            initialCaption: "No file selected",
            previewZoomButtonClasses: previewZoomButtonClasses,
            previewZoomButtonIcons: previewZoomButtonIcons,
            fileActionSettings: fileActionSettings
        };
    selector = selector || '.file-input';
    $(selector).fileinput(object_options);
}
$(document).off('keyup', '.number_comma_formatted');
$(document).on('keyup', '.number_comma_formatted', function () {
    var $this = $(this);
    var input_val = NumberCommaFormatted($this);
    $this.after($this.clone());
    $this.attr('name', $this.attr('name') + '__');
    $("input:text .number_comma_formatted").val(input_val);
});

function NumberCommaFormatted(amount, delimiter) {
    delimiter = delimiter || ',';
    var a = amount.split('.', 2);
    var d = a[1];
    var i = parseInt(a[0]);
    if (isNaN(i)) {
        return '';
    }
    var minus = '';
    if (i < 0) {
        minus = '-';
    }
    i = Math.abs(i);
    var n = new String(i);
    var a = [];
    while (n.length > 3) {
        var nn = n.substr(n.length - 3);
        a.unshift(nn);
        n = n.substr(0, n.length - 3);
    }
    if (n.length > 0) {
        a.unshift(n);
    }
    n = a.join(delimiter);
    if (d.length < 1) {
        amount = n;
    }
    else {
        amount = n + '.' + d;
    }
    amount = minus + amount;
    return amount;
}
function init_doAfterStopTyping(selector, function_name, function_params, waiting_time) {
    selector = selector || 'document';
    function_params = function_params || false;
    waiting_time = waiting_time || 500;
    var $this = $(selector);
    //setup before functions
    var typingTimer;                //timer identifier
    var doneTypingInterval = waiting_time;  //time in ms, 5 second for example

    //on keyup, start the countdown
    $(document).on('keyup', selector, function () {
        clearTimeout(typingTimer);
        //console.log(doneTypingInterval);
        typingTimer = setTimeout(function () {
            if (function_params) {
                return function_name($this.val(), function_params);
            }
            else {
                return function_name($this.val());
            }
        }, doneTypingInterval);
    });

    //on keydown, clear the countdown
    $(document).on('keydown', selector, function () {
        clearTimeout(typingTimer);
    });

}
String.prototype.replaceAll = function (str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignore ? "gi" : "g")), (typeof(str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
};
function init_toPersianSwitchKey(selector) {
    $(document).on('keyup', selector, function () {
        var $this = $(this);
        var fa = _toPersianSwitchKey($this.val());
        $this.val(fa);
    });
}
function init_toEnglishSwitchKey(selector) {
    $(document).on('keyup', selector, function () {
        var $this = $(this);
        var en = _toEnglishSwitchKey($this.val());
        $this.val(en);
    });
}
function _toPersianSwitchKey(value) {
    if (!value) {
        return;
    }
    var persianChar = ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "ئ", "پ", "پ", "و", "؟", "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ظ", "ط", "ژ", "ر", "ذ", "د", "ء"],
        englishChar = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", "~", "`", ",", "?", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

    for (var i = 0, charsLen = englishChar.length; i < charsLen; i++) {
        value = value.replaceAll(englishChar[i], persianChar[i]);
    }
    return value;
}
function _toEnglishSwitchKey(value) {
    if (!value) {
        return;
    }
    var persianChar = ["ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ج", "چ", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ک", "گ", "ظ", "ط", "ز", "ر", "ذ", "د", "ئ", "پ", "پ", "و", "؟", "ض", "ص", "ث", "ق", "ف", "غ", "ع", "ه", "خ", "ح", "ش", "س", "ی", "ب", "ل", "ا", "ت", "ن", "م", "ظ", "ط", "ژ", "ر", "ذ", "د", "ء"],
        englishChar = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "z", "x", "c", "v", "b", "n", "m", "~", "`", ",", "?", "Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V", "B", "N", "M"];

    for (var i = 0, charsLen = persianChar.length; i < charsLen; i++) {
        value = value.replaceAll(persianChar[i], englishChar[i]);
    }
    return value;
}
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
function init_checkboxes_and_radios() {
    $(".styled, .multiselect-container, input").uniform({
        radioClass: 'choice'
    });

    $(".control-primary").uniform({
        radioClass: 'choice',
        wrapperClass: 'border-primary-600 text-primary-800'
    });
}
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
function generate_loader_html(loading_text) {
    var loader_html = '' +
        '<div class="total_loader">' +
        '   <div class="total_loader_content" style="">' +
        '       <div class="spinner_area">' +
        '           <div class="spinner_rects">' +
        '               <div class="rect1"></div>' +
        '               <div class="rect2"></div>' +
        '               <div class="rect3"></div>' +
        '               <div class="rect4"></div>' +
        '               <div class="rect5"></div>' +
        '           </div>' +
        '       </div>' +
        '       <div class="text_area">' + loading_text + '</div>' +
        '   </div>' +
        '</div>';
    return loader_html;
}
function modal_init(modal_id, modal_size, modal_header, modal_content, modal_footer) {
    //console.log(modal_id);
    $('#' + modal_id).remove();
    var public_modal = '' +
        '<div id="' + modal_id + '" class="modal fade">' +
        '   <div class="modal-dialog ' + modal_size + '">' +
        '       <div class="modal-content">' +
        '           <div class="modal-header no-padding" style="border-bottom: 1px solid #ddd; background-color: #eee;">' +
        modal_header +
        '           </div>' +
        '           <div class="modal-body no-margin no-padding">' +
        modal_content +
        '           </div>' +
        '           <div class="modal-footer">' +
        modal_footer +
        '           </div>' +
        '       </div>' +
        '   </div>' +
        '</div>';

    $('#all_modals').append(public_modal);
    $('#' + modal_id).modal('show');
}
function init_select2_ajax(selector, url, allowClear, multiple, tags, placeholder) {
    allowClear = allowClear || false;
    tags = tags || false;
    multiple = multiple || false;
    placeholder = placeholder || "جستجو کنید ...";
    url = url || '{{ "222"}}';
    $(selector).select2({
        minimumInputLength: 3,
        allowClear: allowClear,
        multiple: multiple,
        tags: tags,
        dir: "rtl",
        width: "100%",
        placeholder: placeholder,
        language: "fa",
        tags: false,
        ajax: {
            url: url,
            dataType: "json",
            type: "POST",
            quietMillis: 150,
            data: function (term) {
                return {
                    term: term
                };
            },
            results: function (data) {
                return {
                    results: $.map(data, function (item) {
                        return {
                            text: item.text,
                            id: item.id
                        }
                    })
                };
            }
        }
    });
}

function init_select2_data(selector, data, minimumInputLength, allowClear, multiple, tags, placeholder) {
    //console.log(data);
    allowClear = allowClear || false;
    minimumInputLength = minimumInputLength || false;
    tags = tags || false;
    multiple = multiple || false;
    placeholder = placeholder || "جستجو کنید ...";
    data = data || '{{ "222"}}';
    $(selector).select2({
        minimumInputLength: minimumInputLength,
        allowClear: allowClear,
        multiple: multiple,
        tags: tags,
        dir: "rtl",
        width: "100%",
        placeholder: placeholder,
        language: "fa",
        data: data
    });
}
$(document).on("click", ".jsPanels", function () {
    var $this = $(this);

    var link = $this.data('href');
    var title = $this.data('title');
    var modal = $this.data('modal');
    modal = modal ? 'modal' : '';

    console.log(link);
    var h = $(window).height();
    var w = $(window).width();

    var JS_Panel = $.jsPanel({
        contentAjax: {
            url: link,
            method: 'POST',
            dataType: 'json',
            done: function (data, textStatus, jqXHR, panel) {
                panel.headerTitle(data.header);
                panel.content.html(data.content);
                panel.toolbarAdd('footer', [{item: data.footer}]);
            }
        },
        headerTitle: title,
        theme: 'bootstrap-info'
        //paneltype: 'modal'
        /*headerControls: {
         minimize: 'disable',
         smallify: 'disable'
         }*/,
        contentOverflow: {horizontal: 'hidden', vertical: 'auto'},
        panelSize: {width: w * 0.65, height: h * 0.8}
    });
    JS_Panel.content.html('<div class="loader"></div>');
    return false
});
function yesNoAlert(title, text, type, confirm_button_text, cancel_button_text, func, function_params) {
    swal({
            title: title,
            text: text,
            type: type,
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: confirm_button_text,
            cancelButtonText: cancel_button_text,
            closeOnConfirm: false,
            closeOnCancel: false
        },
        function (isConfirm) {
            if (isConfirm) {
//                    swal({
//                        title: "Deleted!",
//                        text: "Your imaginary file has been deleted.",
//                        confirmButtonColor: "#66BB6A",
//                        type: "success"
//                    });
                func(function_params);
                swal.close();
            }
            else {
                swal.close();
//                    swal({
//                        title: "Cancelled",
//                        text: "Your imaginary file is safe :)",
//                        confirmButtonColor: "#2196F3",
//                        type: "error"
//                    });
            }
        });
}
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
function init_input_just_int(selector) {
    $(document).off('keydown', selector);
    $(document).on('keydown', selector, function (e) {
        -1 !== $.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) || (/65|67|86|88/.test(e.keyCode) && (e.ctrlKey === true || e.metaKey === true)) && (!0 === e.ctrlKey || !0 === e.metaKey) || 35 <= e.keyCode && 40 >= e.keyCode || (e.shiftKey || 48 > e.keyCode || 57 < e.keyCode) && (96 > e.keyCode || 105 < e.keyCode) && e.preventDefault()
    });
}
init_input_just_int('.input_only_number');

function menotify(type, title, text) {
    PNotify.desktop.permission();
    (new PNotify({
            title: title,
            type: type,
            text: text,
            desktop: {
                desktop: true
            }
        })
    )
}
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
function func_search_in_obj(nameKey, value, Obj) {
    for (var i = 0; i < Obj.length; i++) {
        if (Obj[i][nameKey] == value) {
            return Obj[i];
        }
    }
    return false;
}

/*var array = [
 { name:"string 1", value:"this", other: "that" },
 { name:"string 2", value:"this", other: "that" }
 ];
 _.findWhere(array, {name: 'string 1'})
 In ES6 you can use Array.prototype.find(predicate, thisArg?) like so:
 array.find(x => x.name === 'string 1')
 var resultObject = search("string 1", array);*/
