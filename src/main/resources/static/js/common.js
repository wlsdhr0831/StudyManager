function loadingAjax(options) {
    const loadingDiv = $("#loadings");
    const loadingNode = $(loadingTemplate());

    $.ajax({
        ...options,
        beforeSend() {
            if(options.beforeSend) {
                options.beforeSend();
            }
            loadingDiv.append(loadingNode);
        },
        complete() {
            if(options.complete) {
                options.complete();
            }
            loadingNode.remove();
        }
    });
}

function loadingTemplate() {
    return `
    <div style="z-index: 10;position: absolute; width: 100vw; height: 100vh; background-color: rgba(255, 255, 255, 0.5);">
        <div class="d-flex justify-content-center align-items-center text-primary" style="width: 100%; height: 100%;">
            <div class="spinner-border spinner-border-sm" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
    </div>
    `;
}