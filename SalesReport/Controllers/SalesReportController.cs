using Microsoft.AspNetCore.Mvc;
using SalesReport.Models;
using SalesReport.Models.ViewModels;

namespace SalesReport.Controllers
{
    public class SalesReportController : Controller
    {
        private readonly CyberlogicContext _db;
        public SalesReportViewModel? salesReportViewModel { get; set; }
        public SalesReportController(CyberlogicContext db)
        {
            _db = db;
        }
        public IActionResult Index()
        {
            //        var salesData = _db.SalesOrderDetails
            //.GroupBy(s => new { s.SalesPersonId, s.SaleDate })
            //.Select(g => new
            //{
            //    SalesPersonID = g.Key.SalesPersonId,
            //    SaleDate = g.Key.SaleDate,
            //    SaleAmount = g.Sum(s => s.LineTotal)
            //})
            //.ToList();

            //        var salespeople = _db.SalesLtSalesPeople.ToList();
            //        var salespersonNames = salespeople.Select(s => s.FullName).ToList();

            //        var datesOfMonth = Enumerable.Range(1, DateTime.DaysInMonth(DateTime.Now.Year, DateTime.Now.Month))
            //            .Select(day => new DateTime(DateTime.Now.Year, DateTime.Now.Month, day))
            //            .ToList();
            //        var salesAmounts = new Dictionary<string, Dictionary<DateTime, decimal>>();
            //        foreach (var salesperson in salespeople)
            //        {
            //            var salesByDate = datesOfMonth.ToDictionary(date => date, date => decimal.Zero);

            //            foreach (var salesRecord in salesData.Where(s => s.SalesPersonID == salesperson.Id))
            //            {
            //                salesByDate[salesRecord.SaleDate] += salesRecord.SaleAmount;
            //            }
            //            salesAmounts.Add(salesperson.FullName, salesByDate);
            //        }

            //        var viewModel = new SalesReportViewModel
            //        {
            //            SalePersonNames = salespersonNames,
            //            DatesOfMonth = datesOfMonth,
            //            SalesAmounts = salesAmounts
            //        };
            //SalesReportViewModel salesReportViewModel = new SalesReportViewModel();
            //salesReportViewModel.SalesLtSalesPerson = _db.SalesLtSalesPeople.ToList();
            SalesReportViewModel salesReportViewModel = new SalesReportViewModel();
            salesReportViewModel.SalesLtSalesPerson = _db.SalesLtSalesPeople.ToList();
            return View(salesReportViewModel);
        }
        public ActionResult DatePicker()
        {
            return PartialView("DatePicker");
        }
    }
}
