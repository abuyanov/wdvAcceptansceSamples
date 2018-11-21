using Atalasoft.Imaging.WebControls;


namespace AcceptanceTestFor11_0
{
    public class WebDocViewerHandler : WebDocumentRequestHandler
    {
        public WebDocViewerHandler()
        {
            ReplaceFileExtensionOnSave = ReplaceFileExtension.AllFiles;
            DocumentInfoRequested += OnDocumentInfoRequested;
            DocumentSaveResponseSend += WebDocViewerHandler_DocumentSaveResponseSend;
        }

        private void WebDocViewerHandler_DocumentSaveResponseSend(object sender, ResponseSendEventArgs e)
        {
            e.CustomResponseData.Add("MyMessage","All works fine!!");
        }

        private void OnDocumentInfoRequested(object sender, DocumentInfoRequestedEventArgs e)
        {
            e.ThumbCaptionFormat = @"page num {0}";
        }


    }
}