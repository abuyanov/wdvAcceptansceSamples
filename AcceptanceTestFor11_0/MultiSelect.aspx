<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="MultiSelect.aspx.cs" Inherits="AcceptanceTestFor11_0.MultiSelect" %>

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
</head>
<body>
    <h1>Atalasoft Web Document Viewer Demo</h1>
    <form id="WDVForm" runat="server">
        <table>
            <tr>
                <td>
                    <asp:DropDownList ID="FileSelectionList" runat="server" onchange="onSelectFile($(FileSelectionList));" style="width: 200px;float:left"></asp:DropDownList>
                </td>
                <td><div class="atala-document-toolbar" style="width: 900px;float:left"></div></td>
            </tr>
            <tr>
             <td> <div class="atala-document-thumbnailer" style="width: 200px; height: 500px; float: left"></div></td>
                <td> <div class="atala-document-container" style="width: 900px; height: 500px; float: left"></div> </td>
            </tr>
        </table>

        <div>
            <h3>Status:</h3>
            <div id="status" style="width:670px; height:150px; overflow:scroll; border:solid 1px #CCC;"></div>
            <input type="button" id ="btnGetSelectedPages" class="ui-button" onclick="getSelectedPages();" value="Get Selected Pages" />
        </div>
</form>
</body>
</html>
