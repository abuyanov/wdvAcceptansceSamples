<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="WebDocViewer1.aspx.cs" Inherits="AcceptanceTestFor11_0.Pages.WebDocViewer1" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="WDV1"  runat="server">
    <title>Web Document Viewer Example</title>
    <!-- Script includes for Web Viewing -->
    <script src="Scripts/jquery-3.3.1.min.js" type="text/javascript"></script>
    <script src="Scripts/jquery-ui-1.12.1.min.js" type="text/javascript"></script>
    <script src="Scripts/raphael-min.js"></script>
    <script src="Scripts/atalaWebDocumentViewer.js" type="text/javascript"></script>
    <script src="Scripts/wdvmanager.js" type="text/javascript"></script>

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
                    <asp:DropDownList ID="FileSelectionListLeft" runat="server" onchange="onSelectFile($(FileSelectionListLeft), thumbs);" style="width: 200px;float:left"></asp:DropDownList>
                     <input type="button" id ="btnActivateLeft" class="ui-button" onclick="activateLeftThumb();" value="Activate" disabled />
                </td>
                <td><div class="atala-document-toolbar" style="width: 900px;float:left"></div></td>
                <td>
                    <asp:DropDownList ID="FileSelectionListRight" runat="server" onchange="onSelectFile($(FileSelectionListRight), thumb2);" style="width: 200px;float:left"></asp:DropDownList>
                    <input type="button" id ="btnActivateRight" class="ui-button" onclick="activateRightThumb();" value="Activate" />
                </td>
            </tr>
            <tr>
             <td> <div class="atala-document-thumbnailer" style="width: 200px; height: 500px; float: left"></div></td>
                <td> <div class="atala-document-container" style="width: 900px; height: 500px; float: left"></div> </td>
                <td> <div class="atala-document-thumbnailer_2" style="width: 200px; height: 500px; float: left"></div></td>
                
            </tr>
        </table>

        <div>
            <h3>Insert pages from second to first thumbnailer</h3>
            Page: <input type="text" name="pagetomove" id="pagetomove" /> <br />
            Insert index: <input type="number" name="tragetindex" id="targetinsindx" min="0"/>
            <input type="button" id="btnInsertPages" onclick="insertPages();" value="Insert Pages" />
        </div>

        <div>
            <h3>Status:</h3>
            <div id="status" style="width:670px; height:150px; overflow:scroll; border:solid 1px #CCC;"></div>
        </div>
        <input type="button" id ="btnCheckStatuses" class="ui-button" onclick="getThumbStatuses();" value="Check Statuses" />
</form>
</body>
</html>
