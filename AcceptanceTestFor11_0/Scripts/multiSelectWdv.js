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
            savefileformat: 'jpg',
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
            selectionmode: Atalasoft.Utils.SelectionMode.MultiSelect,
            selecteditemsorder: Atalasoft.Utils.SelectedItemsOrder.ItemIndexOrder
        });

        thumbs.bind({
            'thumbdragstart': onDragDtart,
            'thumbdragend': onDragEnd,
            'thumbdragcomplete': onDragComplete
        });

    } catch (error) {
        alert('Thrown error: ' + error.description);
    }
});

function onSelectFile(filecombo) {
    var file = filecombo.val();
    thumbs.OpenUrl(file);
}


//Drug and Drop events

function onDragDtart(evnt) {
    var selectedPages = thumbs.getSelectedPagesIndices();
    appendStatus("Drag'n'drop started. Pages are going to be drugged: " + selectedPages)
};
function onDragEnd(evnt, data) {
    appendStatus("Drug'n'drop almost ended.")
    //appendStatus(`Page drugged from page ${data.dragindex} to page ${data.dropindex} data.`)

}
function onDragComplete(evnt, data) {
    appendStatus("Drug'n'drop completed.")
    //appendStatus(`Page drugged from page ${data.dragindex} to page ${data.dropindex} data.`)
}

function getSelectedPages() {
    var selectedPages = thumbs.getSelectedPagesIndices();
    appendStatus("Selected pages numbers are: " + selectedPages)
}