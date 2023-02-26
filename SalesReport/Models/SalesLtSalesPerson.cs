using System;
using System.Collections.Generic;

namespace SalesReport.Models;

public partial class SalesLtSalesPerson
{
    public int Id { get; set; }

    public string FullName { get; set; } = null!;

    public DateTime Created { get; set; }

    public virtual ICollection<SalesOrderDetail> SalesOrderDetails { get; } = new List<SalesOrderDetail>();
}
