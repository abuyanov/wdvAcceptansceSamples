using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace AcceptanceTestFor11_0.Pages
{
    public partial class WebDocViewer1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string imagesPath = "Documents/";
                string[] filePaths = Directory.GetFiles(MapPath(imagesPath));
                var validExtensions = new List<string> { ".tiff", ".tif", ".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx" };
                for (int i = 0; i < filePaths.Length; i++)
                {
                    if (validExtensions.Contains(Path.GetExtension(filePaths[i]).ToLower()))
                    {
                        FileSelectionListLeft.Items.Add(imagesPath + Path.GetFileName(filePaths[i]));
                        FileSelectionListRight.Items.Add(imagesPath + Path.GetFileName(filePaths[i]));
                    }
                }
            }
            
        }


    }
}