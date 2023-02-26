namespace SalesReport.Models.ViewModels
{
    public class SalesReportViewModel
    {
        public IEnumerable<SalesLtSalesPerson>? SalesLtSalesPerson { get; set; }
        public SalesOrderDetail? SalesOrderDetail { get; set; }
    }
}
