namespace SalesReport.Models.ViewModels
{
    public class SalesReportViewModel
    {
        //public IEnumerable<SalesLtSalesPerson>? SalesLtSalesPerson { get; set; }
        //public SalesOrderDetail? SalesOrderDetail { get; set; }
        //public int? SalesPersonID { get; set; }
        //public string? FullName { get; set; }
        //public DateTime SaleDate { get; set; }
        //public decimal TotalAmount { get; set; }
        public int? SalesPersonID { get; set; }
        public string? FullName { get; set; }
        public decimal[]? Amounts { get; set; }
        //public IEnumerable<Months> Months { get; set; }
        //public List<string>? Months { get; set; }
    }
}
