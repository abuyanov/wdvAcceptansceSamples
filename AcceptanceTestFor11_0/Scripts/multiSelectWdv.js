var viewer, thumbs;

function appendStatus(msg) {
    var stat = $("#status");
    stat.append(msg + "<br>");
    stat.animate({ "scrollTop": stat[0].scrollHeight }, "fast");
}

$(function () {
    try {
        // URL that points to our Web Document Viewer handler
        var serverUrl = 'WebDocViewerHandler.ashx';
        var initDocument = 'Documents/Test.pdf'
        // Initialize Web Viewing
        viewer = new Atalasoft.Controls.WebDocumentViewer({
            parent: $('.atala-document-container'),
            toolbarparent: $('.atala-document-toolbar'),
            serverurl: serverUrl,
            allowannotations: true,
            savepath: 'saved',
            allowforms: true,
            upload: {
                enabled:true,
                uploadpath: 'Upload/Viewer',
                allowedfiletypes: '.jpg,.pdf,.png,.jpeg,image/tiff',
                allowedmaxfilesize: 5*1024*1024,
                allowmultiplefiles: true,
                allowdragdrop: true,
                filesuploadconcurrency: 3,
            }
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
            viewer: viewer,
            allowannotations: true,
            allowdragdrop: true,
            selectionmode: Atalasoft.Utils.SelectionMode.MultiSelect,
            selecteditemsorder: Atalasoft.Utils.SelectedItemsOrder.SelectedOrder,
            showthumbcaption: true,
            allowforms: true
        });

        thumbs.bind({
            'thumbdragstart': onDragDtart,
            'thumbdragend': onDragEnd,
            'thumbdragcomplete': onDragComplete,
            //'thumbselected': onThumbSelected,
            //'thumbdeselected':onThumbDeselected
        });

        openFile(initDocument);

    } catch (error) {
        alert('Thrown error: ' + error.description);
    }
});

function onSelectFile(filecombo) {
    var file = filecombo.val();
    openFile(file)
}

function openFile(filename) {
    thumbs.OpenUrl(filename, '', '', onDocLoaded);
}


//Drag and Drop events

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
// Other functions
function getSelectedPages() {
    var selectedPages = thumbs.getSelectedPagesIndices();
    appendStatus("Selected pages numbers are: " + selectedPages)
}

function getSelectedPage() {
    appendStatus("Selected pages numbers are: " + thumbs.getSelectedPageIndex())
}

function selectPage() {
    var pageToSelect = $("#PageToSelectNum").val()
    thumbs.selectThumb(pageToSelect, true)
}

function deselectPage() {
    var pageToSelect = $("#PageToSelectNum").val()
    thumbs.selectThumb(pageToSelect, false)
}

function onDocLoaded() {
    var numPages = viewer.getDocumentInfo().count
    appendStatus("Document contains " + numPages + " pages.")
    var upLimit = numPages - 1
    document.getElementById('PageToSelectNum').setAttribute('max', upLimit);
    //document.getElementById('targetindx').setAttribute('max', upLimit);
}

function onThumbSelected(e) {
    appendStatus("Thumb selected " + e.index);
}

function onThumbDeselected(e) {
    appendStatus("Thumb unselected " + e.index);
}

function deletePages() {
    var pagesToDel = $("#pagestodel").val().split(",");
    if (pagesToDel.length == 1) {
        var outmsg = "Page " + pagesToDel + " was deleted"
    } else {
        var outmsg = "Pages " + pagesToDel + " were deleted"
    }
    thumbs.document.removePages(pagesToDel, appendStatus(outmsg));
}

function rotatePages() {
    var pages = $("#pagestorot").val().split(",");
    var angles = $("#anglestorot").val().split(",");
    if (angles.length > 0 && pages.length > 0) {
        if (angles.length == pages.length) {
            thumbs.document.rotatePages(pages, angles, appendStatus("Pages were rotated"))
        } else {
            thumbs.document.rotatePages(pages, angles[0], appendStatus("Pages were rotated"))
        }
    }
}

function movePages() {
    var pages = $("#pagestomove").val().split(",");
    var target = $("#targetindx").val()
    thumbs.document.movePages(pages, target,
        appendStatus("Pages " + pages + "  were moved to " + target))
}

function insertPages() {
    var pages = $("#pagestoinsert").val().split(",");
    var srcdoc = $("#InsertDropDownList").val();
    var insIndex = $("#targetinsindx").val();
    thumbs.document.insertPages(srcdoc, pages, insIndex, appendStatus("Pages were inserted."))
};