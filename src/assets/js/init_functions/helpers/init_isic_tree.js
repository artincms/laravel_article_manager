function init_isic_tree(selector_id, select2_selector_id, select2_selector_name, allowClear, multiple, global_variable, jstree_route, datatable_route, selectable_id) {
    //console.log(select2_selector_name);
    global_variable = global_variable || selector_id;
    jstree_route = jstree_route || isic_tree_route;
    datatable_route = datatable_route || isic_datatable_route;
    selectable_id = selectable_id || false;
    if (multiple) {
        allowClear = false;
    }
    var html_elements = '' +
        '<div class="form-group">' +
//          '   <label class="control-label col-lg-2">عنوان آیسیک</label>' +
        '   <div class="col-lg-12">' +
        '       <div class="col-sm-12 pdr-0">' +
        '           <button class="close" id="' + select2_selector_id + '_btn_add_isic" data-target_element_id="' + selector_id + '" type="button" title="افزودن آیسیک" style="font-size: 12px; color: red;">' +
        '               <i class="fa fa-plus"></i>' +
        '           </button>' +
        '           <select name="' + select2_selector_name + '" id="' + select2_selector_id + '"></select>' +
        '           <div class="space-4"></div>' +
        '       </div>' +
        '   </div>' +
        '</div>';
    $('#' + selector_id).html(html_elements);
    init_select2_ajax('#' + select2_selector_id, isic_select2_route, allowClear, multiple);
    $('#' + select2_selector_id + '_btn_add_isic').on('click', function () {
        button_loader_init('#' + select2_selector_id + '_btn_add_isic', 1, 'fa fa-plus', 'fa fa-spinner');
        $.ajax({
            type: "POST",
            url: jstree_route,
            dataType: "json",
            data: {
                modal_id: select2_selector_id,
                multiple: multiple,
                global_variable: global_variable,
                selectable_id: selectable_id
            },
            success: function (result) {
                button_loader_init('#' + select2_selector_id + '_btn_add_isic', 0, 'fa fa-plus', 'fa fa-spinner');
                if (result.status == true) {
                    var modal_header = '' +
                        '<ul class="nav nav-tabs nav-tabs-bottom bottom-divided no-padding no-margin">' +
                        '   <li class="active" id="' + select2_selector_id + '_modal_tab_type" data-tab_type="tree"><a href="#isic_modal_' + select2_selector_id + '_select_from_tree" data-toggle="tab" style="color: black">انتخاب از درخت</a></li>' +
                        '   <li class="" id="' + select2_selector_id + '_modal_tab_type" data-tab_type="datatable"><a href="#isic_modal_' + select2_selector_id + '_search_in_titles" data-toggle="tab" style="color: black">جستجو در عناوین</a></li>' +
                        '</ul>';
                    var modal_footer = '' +
                        '<button type="button" class="btn btn-primary" id="' + select2_selector_id + '_tree_btn_add_isic_to_target"><i class="icon-plus22"></i> افزودن از درخت</button>' +
                        '<button type="button" class="btn btn-primary hide" id="' + select2_selector_id + '_datatable_btn_add_isic_to_target"><i class="icon-plus22"></i> افزودن از جدول</button>';
                    modal_init('modal_' + select2_selector_id, 'modal-lg', modal_header, result.modal_content, modal_footer);
                    $(document).on('click', '#' + select2_selector_id + '_modal_tab_type', function () {
                        var tab_type = $(this).data('tab_type');
                        if (tab_type == 'tree') {
                            $('#' + select2_selector_id + '_tree_btn_add_isic_to_target').removeClass('hide');
                            $('#' + select2_selector_id + '_datatable_btn_add_isic_to_target').addClass('hide');
                        }
                        else if (tab_type == 'datatable') {
                            $('#' + select2_selector_id + '_tree_btn_add_isic_to_target').addClass('hide');
                            if (multiple)
                                $('#' + select2_selector_id + '_datatable_btn_add_isic_to_target').removeClass('hide');
                        }
                    });
                    //----------------------------------------------------------------------------------------------------------------
                    $(document).on('click', '.btn_datatable_' + select2_selector_id + '_select_item', function () {
                        var variable_feed = [];
                        var item_id = $(this).data('item_id');
                        var item_title = $(this).data('item_title');
                        var item_code = $(this).data('item_code');
                        $('#' + select2_selector_id).select2("trigger", "select", {
                            data: {id: item_id, text: item_title + ' : ' + item_code}
                        });
                        window[global_variable] = item_id;
                        $('#modal_' + select2_selector_id).modal('hide');
                    });
                    var constraints = {
                        isic_search_input: {
                            presence: {message: '^<strong>فیلد جستجو نمی‌تواند خالی باشد.</strong>'}
                        }
                    };
                    var form = document.querySelector('#isic_modal_' + select2_selector_id + '_frm_search_in_isics');
                    function init_isics_datatable() {
                        $('#isic_modal_' + select2_selector_id + '_frm_search_in_isics .total_loader').remove();
                        var getDatatablesIsicsRoute = datatable_route;
                        window['isics_grid_columns'] = [
                            {
                                "data": "id", 'title': 'ردیف',
                                width: '5%',
                                searchable: false,
                                sortable: false,
                                render: function (data, type, row, meta) {
                                    return meta.row + meta.settings._iDisplayStart + 1;
                                }
                            },
                            {
                                width: '30%',
                                data: 'title', name: 'title', 'title': 'عنوان',
                                mRender: function (data, type, full) {
                                    return full.title;
                                }
                            },
                            {
                                width: '30%',
                                data: 'latin_title', name: 'latin_title', 'title': 'عنوان انگلیسی',
                                mRender: function (data, type, full) {
                                    return '<span style="direction: ltr">' + full.latin_title + '</span>';
                                }
                            },
                            {
                                width: '10%',
                                data: 'code', name: 'code', 'title': 'کد',
                                mRender: function (data, type, full) {
                                    return full.code;
                                }
                            },
                            {
                                width: '5%',
                                searchable: false,
                                sortable: false,
                                data: 'action', name: 'action', 'title': 'انتخاب',
                                mRender: function (data, type, full) {
                                    var result = '';
                                    result += '<span class="btn_datatable_' + select2_selector_id + '_select_item" style="font-size: 25px; color: #1E88E5; cursor: pointer;" ' +
                                        'data-item_id="' + full.id + '" ' +
                                        'data-item_title="' + full.title + '" ' +
                                        'data-item_code="' + full.code + '">' +
                                        '<i class="fa fa-check-circle">' +
                                        '<span>';
                                    return result;
                                }
                            }
                        ];
                        if (multiple) {
                            dataTablesGrid(
                                '#isic_modal_' + select2_selector_id + '_IsicsGridData',
                                'isic_modal_' + select2_selector_id + '_IsicsGridData',
                                getDatatablesIsicsRoute,
                                isics_grid_columns,
                                {
                                    text: $('#isic_modal_' + select2_selector_id + '_isic_search_input').val()
                                },
                                false,
                                false,
                                false,
                                false,
                                false,
                                false,
                                true
                            );
                        }
                        else {
                            dataTablesGrid(
                                '#isic_modal_' + select2_selector_id + '_IsicsGridData',
                                'isic_modal_' + select2_selector_id + '_IsicsGridData',
                                getDatatablesIsicsRoute,
                                isics_grid_columns,
                                {
                                    text: $('#isic_modal_' + select2_selector_id + '_isic_search_input').val()
                                }
                            );
                        }

                    }

                    init_validatejs(form, constraints, init_isics_datatable);

                    $(document).off('click', '#' + select2_selector_id + '_datatable_btn_add_isic_to_target');
                    $(document).on('click', '#' + select2_selector_id + '_datatable_btn_add_isic_to_target', function () {
                        var variable_feed = [];
                        var all_selected_isics = window['isic_modal_' + select2_selector_id + '_IsicsGridData_rows_selected'];
                        for (var x in all_selected_isics) {
                            $('#' + select2_selector_id).select2("trigger", "select", {
                                data: {id: all_selected_isics[x].id, text: all_selected_isics[x].title + ' : ' + all_selected_isics[x].code}
                            });
                            variable_feed.push(all_selected_isics[x].id);
                        }
                        window[global_variable] = variable_feed;
                        $('#modal_' + select2_selector_id).modal('hide');
                    });
                }
                else {

                }
            }
        });
    });
}
