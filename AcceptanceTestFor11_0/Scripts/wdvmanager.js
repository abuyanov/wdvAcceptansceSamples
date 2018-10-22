var viewer, thumbs, thumb2;

function appendStatus(msg) {
    var stat = $("#status");
    stat.append(msg + "<br>");
    stat.animate({ "scrollTop": stat[0].scrollHeight }, "fast");
}

$(function () {
    try {
        // URL that points to our Web Document Viewer handler
        var serverUrl = 'WebDocViewerHandler.ashx';
        // Initialize Web Viewing
        viewer = new Atalasoft.Controls.WebDocumentViewer({
            parent: $('.atala-document-container'),
            toolbarparent: $('.atala-document-toolbar'),
            serverurl: serverUrl,
            allowannotations: true,
            savepath: 'saved',
            //savefileformat: 'jpg',
            //burn:true
        });
        // Initialize Thumbnail Viewer
        thumbs = new Atalasoft.Controls.WebDocumentThumbnailer({
            parent: $('.atala-document-thumbnailer'),
            serverurl: serverUrl,
            maxwidth: 120,
            minwidth: 60,
            // Note that specify relative URL to our
            // sample document on server here:
            documenturl: 'Documents/Test.pdf',
            viewer: viewer,
            allowannotations: true,
            allowdragdrop: true,
            showthumbcaption: true
        });

        // Initialize Second Thumbnail
        thumb2 = new Atalasoft.Controls.WebDocumentThumbnailer({
            parent: $('.atala-document-thumbnailer_2'),
            serverurl: serverUrl,
            maxwidth: 120,
            minwidth: 60,
            // Note that specify relative URL to our
            // sample document on server here:
            documenturl: 'Documents/Test.pdf',
            allowdragdrop: true,
            viewer: viewer,
            allowannotations: true,
            showthumbcaption: true
        });

        thumb2.bind({
            'thumbdragstart':onDrugDtart,
            'thumbdragend': onDrugEnd,
            'thumbdragcomplete': onDrugComplete
        });

        thumbs.bind({
            'thumbdragstart': onDrugDtart,
            'thumbdragend': onDrugEnd,
            'thumbdragcomplete': onDrugComplete
        });

    } catch (error) {
        alert('Thrown error: ' + error.description);
    }
});

function onSelectFile(filecombo, thumb) {
    var file = filecombo.val();
    loadFile(file, thumb);
}

function loadFile(file, thumb) {
    //appendStatus("New file is: " + file)
    //(thumb || _thumbLeft).OpenUrl(file, target.substring(0, target.lastIndexOf('.')) + ".xmp");
    thumb.OpenUrl(file);
}

function activateLeftThumb() {
    thumbs.activate()
    //appendStatus("Left thumbnailer is active? " + thumbs.isActive())
    //appendStatus("Right thumbnailer is active? " + thumb2.isActive())
    $("#btnActivateLeft").prop('disabled', true);
    $("#btnActivateRight").prop('disabled', false);
}

function activateRightThumb() {
    thumb2.activate()
    //appendStatus("Right thumbnailer is active? " + thumb2.isActive())
    //appendStatus("Left thumbnailer is active? " + thumbs.isActive())
    $("#btnActivateLeft").prop('disabled', false);
    $("#btnActivateRight").prop('disabled',true);
}

function getThumbStatuses() {
    appendStatus("Right thumbnailer is active? " + thumb2.isActive())
    appendStatus("Left thumbnailer is active? " + thumbs.isActive())
};

//Drug and Drop events

function onDrugDtart(evnt) {
    appendStatus("Drug'n'drop started. Page is going to be drugged: " + evnt.dragindex)
};
function onDrugEnd(evnt, data) {
    appendStatus("Drug'n'drop almost ended.")
    //appendStatus(`Page drugged from page ${data.dragindex} to page ${data.dropindex} data.`)

}
function onDrugComplete(evnt, data) {
    appendStatus("Drug'n'drop completed.")
    //appendStatus(`Page drugged from page ${data.dragindex} to page ${data.dropindex} data.`)
}

function insertPages() {
    var page = $("#pagetomove").val()
    var insIndex = $("#targetinsindx").val();
    thumbs.document.insertPage(null, thumb2.document.getPageReference(page), insIndex);
    appendStatus("Page were moved");
}