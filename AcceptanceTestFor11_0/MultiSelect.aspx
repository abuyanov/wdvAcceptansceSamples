﻿<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MultiSelect.aspx.cs" Inherits="AcceptanceTestFor11_0.MultiSelect" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>Multi Select test</title>
 <script src="Scripts/jquery-3.3.1.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery-ui-1.12.1.min.js" type="text/javascript"></script>
    <script src="Scripts/raphael-min.js"></script>
    <script src="Scripts/atalaWebDocumentViewer.js" type="text/javascript"></script>
    <script src="Scripts/multiSelectWdv.js" type="text/javascript"></script>

    <!-- Style for Web Viewer -->
    <link href="Content/themes/base/jquery-ui.css" rel="Stylesheet" type="text/css" />
    <link href="Scripts/atalaWebDocumentViewer.css" rel="Stylesheet" type="text/css" />
    <link href="Content/MultiSelect.css" rel="Stylesheet" type="text/css" />
</head>
<body>
    <h1>Atalasoft Web Document Viewer Demo</h1>
    <form id="WDVForm" runat="server">
        <div class="main-container">
            <div class ="thumb-container">
                <asp:DropDownList ID="FileSelectionList" runat="server" onchange="onSelectFile($(FileSelectionList));" style="width: 200px;float:left"></asp:DropDownList>
                <div class="atala-document-thumbnailer" style="width: 200px; height: 500px; float: left"></div>
            </div>
            <div class="viewer-container">
                <div class="atala-document-toolbar" style="width: 900px;float:left"></div>
                <div class="atala-document-container" style="width: 900px; height: 500px; float: left"></div>
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
