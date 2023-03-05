using System;
using System.Collections.Generic;

namespace SalesReport.Models;

public partial class SalesOrderDetail
{
    public int SalesOrderId { get; set; }

    public int SalesOrderDetailId { get; set; }

    public short OrderQty { get; set; }

    public int? SalesPersonId { get; set; }

    public int ProductId { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal UnitPriceDiscount { get; set; }

    public decimal LineTotal { get; set; }

    public Guid Rowguid { get; set; }

    public DateTime SaleDate { get; set; }

    public virtual SalesOrderHeader SalesOrder { get; set; } = null!;

    public virtual SalesLtSalesPerson? SalesPerson { get; set; }
    public virtual Product? Product { get; set; }
}
