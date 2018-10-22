<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="HorizontalThumb.aspx.cs" Inherits="AcceptanceTestFor11_0.HorizontalThumb" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Horizontal Thumbnailer example</title>
    <script src="Scripts/jquery-3.3.1.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery-ui-1.12.1.min.js" type="text/javascript"></script>
    <script src="Scripts/raphael-min.js"></script>
    <script src="Scripts/atalaWebDocumentViewer.js" type="text/javascript"></script>

    <!-- Style for Web Viewer -->
    <link href="Content/themes/base/jquery-ui.css" rel="Stylesheet" type="text/css" />
    <link href="Scripts/atalaWebDocumentViewer.css" rel="Stylesheet" type="text/css" />
    <link href="Content/MultiSelect.css" rel="Stylesheet" type="text/css" />

    <script>
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
        var initDocument = 'Documents/Test.pdf';
        // Initialize Web Viewing
        viewer = new Atalasoft.Controls.WebDocumentViewer({
            parent: $('.atala-document-container'),
            toolbarparent: $('.atala-document-toolbar'),
            serverurl: serverUrl,
            allowannotations: true,
            savepath: 'saved',
            //savefileformat: 'jpg',
            persistrotation: false,
            allowforms:true

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
            direction: Atalasoft.Utils.ScrollDirection.Horizontal,
            allowforms:true
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
            thumbs.OpenUrl(filename);
        }
        
        function reloadDocument() {
            var fname = $("#FileSelectionList").val();
            var fnameWOPath = fname.substr(fname.lastIndexOf('/'), fname.lastIndexOf('.') - fname.lastIndexOf('/'));
            var newFile = (viewer.config.savefileformat)? viewer.config.savepath + fnameWOPath + viewer.config.savefileformat : viewer.config.savepath + fname.substr(fname.lastIndexOf('/'))
            var annoFile = viewer.config.savepath + fnameWOPath + ".xmp"
            thumbs.OpenUrl(newFile, annoFile)
        }

        function reloadPage() {
            var fname = $("#FileSelectionList").val();
            var fnameWOPath = fname.substr(fname.lastIndexOf('/'),fname.lastIndexOf('.')-fname.lastIndexOf('/'));
            var annoFile = viewer.config.savepath + fnameWOPath + ".xmp"
            var activePg = thumbs.getSelectedPageIndex()
            thumbs.reloadPage(activePg, annoFile, false)
        }
        
</script>

<style>
    .thumb-container {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

</style>
</head>

<body>
    <h1>Atalasoft Web Document Viewer Demo</h1>
    <form id="WDVForm" runat="server">
        <div class="main-container">
            <div class ="thumb-container">
                <asp:DropDownList ID="FileSelectionList" runat="server" onchange="onSelectFile($(FileSelectionList));" style="width: 200px;float:left"></asp:DropDownList>
                
                <div class="atala-document-toolbar" style="width: 900px;float:left"></div>
                <div class="atala-document-container" style="width: 900px; height: 500px; float: left"></div>
                <div class="atala-document-thumbnailer" style="width: 900px; height: 120px; float: left"></div>
            </div>
            <div class="page-operation-container">
                <div>
                <h3>Select pages</h3>
                Page number: <input type="number" name="pagetoselect" id="PageToSelectNum" min="0"/>
                <input type="button" id="btnSelectPage" onclick="selectPage();" value="Add to Selected" />
                <input type="button" id="btnDeselectPage" onclick="deselectPage();" value="Select this page only" />
                </div>
                <div>
                    <h3>Remove pages</h3>
                    Pages: <input type="text" name="pagestodel" id="pagestodel" />
                    <input type="button" id="btnDeletePages" onclick="deletePages();" value="Delete Pages" />
                </div>
                <div>
                    <h3>Rotate pages</h3>
                    Pages: <br> <input type="text" name="pagestorot" id="pagestorot" /> <br />
                    Angles: <br> <input type="text" name="anglestorot" id="anglestorot" /> <br />
                    <input type="button" id="btnRotatePages" onclick="rotatePages();" value="Rotate Pages" />
                </div>
               <div>
                    <h3>Move pages</h3>
                    Pages: <input type="text" name="pagestomove" id="pagestomove" /> <br />
                    Target index: <input type="number" name="tragetindex" id="targetindx" min="0"/> <br />
                    <input type="button" id="btnMovePages" onclick="movePages();" value="Move Pages" />
                </div>
                <div>
                    <h3>Insert pages</h3>
                    From: <asp:DropDownList ID="InsertDropDownList" runat="server" style="width: 200px"></asp:DropDownList> <br />
                    get pages: <input type="text" name="pagestomove" id="pagestoinsert" /> <br />
                    insert index: <input type="number" name="tragetindex" id="targetinsindx" min="0"/>
                    <input type="button" id="btnInsertPages" onclick="insertPages();" value="Insert Pages" />
                </div>
                <div>
                    <h3>Reload Document</h3>
                    <input type="button" id="btnReloadDocument" onclick="reloadDocument();" value="Reload" />
                </div>
                <div>
                    <h3>Reload Actuve Page</h3>
                    <input type="button" id="btnReloadPage" onclick="reloadPage();" value="ReloadPage" />
                </div>
            </div> 
            
        </div>
        <div>
            <h3>Status:</h3>
            <div id="status" style="width:670px; height:150px; overflow:scroll; border:solid 1px #CCC;"></div>
            <input type="button" id ="btnGetSelectedPages" class="ui-button" onclick="getSelectedPages();" value="Get Selected Pages" />
            <input type="button" id ="btnGetSelectedPage" class="ui-button" onclick="getSelectedPage();" value="Get Selected Page" />
        </div>
</form>
</body>
</html>

