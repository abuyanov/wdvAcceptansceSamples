﻿using System;
using System.Collections.Generic;
using System.IO;

namespace AcceptanceTestFor11_0
{
    public partial class HorizontalThumb : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string imagesPath = "Documents/";
                string[] filePaths = Directory.GetFiles(MapPath(imagesPath));
                var validExtensions = new List<string> { ".tiff", ".tif", ".jpg", ".jpeg", ".png", ".bmp", ".pdf", ".doc", ".docx",".rtf",".gif",".nef",".pptx"};
                foreach (string path in filePaths)
                {
                    if (validExtensions.Contains(Path.GetExtension(path).ToLower()))
                    {
                        FileSelectionList.Items.Add(imagesPath + Path.GetFileName(path));
                        InsertDropDownList.Items.Add(imagesPath + Path.GetFileName(path));
                    }
                }
            }
        }
    }
}