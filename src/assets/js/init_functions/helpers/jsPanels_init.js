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