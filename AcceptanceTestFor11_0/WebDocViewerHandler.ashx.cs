using Atalasoft.Imaging.WebControls;

namespace AcceptanceTestFor11_0
{
    public class WebDocViewerHandler : WebDocumentRequestHandler
    {
        public WebDocViewerHandler()
        {
            DocumentInfoRequested += OnDocumentInfoRequested;
        }

        private void OnDocumentInfoRequested(object sender, DocumentInfoRequestedEventArgs e)
        {
            e.ThumbCaptionFormat = @"page num {0}";
        }
    }
}