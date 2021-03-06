//-----------------------------------------------------------------------
// <copyright file="PurchaseHeaderViewModel.cs" company="AccountGo">
// Copyright (c) AccountGo. All rights reserved.
// <author>Marvin Perez</author>
// <date>1/11/2015 9:48:38 AM</date>
// </copyright>
//-----------------------------------------------------------------------

using Services.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Core.Domain;

namespace Web.Models.ViewModels.Purchases
{
    public class PurchaseHeaderViewModel
    {
        public PurchaseHeaderViewModel()
        {
            PurchaseLine = new PurchaseLineItemsViewModel();
            Date = DateTime.Now;
        }

        public int? Id { get; set; }
        public int? VendorId { get; set; }
        public DateTime Date { get; set; }
        public string ReferenceNo { get; set; }
        public string VendorInvoiceNo { get; set; }
        public DocumentTypes DocumentType { get; set; }
        public PurchaseLineItemsViewModel PurchaseLine { get; set; }
        public bool IsDirect { get; set; }
    }
}
