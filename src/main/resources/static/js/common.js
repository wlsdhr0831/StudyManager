function loadingAjax(options) {
    const loadingNode = $("#loading");

    $.ajax({
        ...options,
        beforeSend() {
            if(options.beforeSend) {
                options.beforeSend();
            }
            loadingNode.show();
        },
        complete() {
            if(options.complete) {
                options.complete();
            }
            loadingNode.hide();
        }
    });
}