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
            var salesData = from sp in _db.SalesLtSalesPeople
                            join sd in _db.SalesOrderDetails on sp.Id equals sd.SalesPersonId
                            group sd by new { sd.SalesPersonId, sd.SaleDate.Year, sd.SaleDate.Month, sd.SaleDate.Day } into g
                            select new
                            {
                                g.Key.SalesPersonId,
                                g.First().SalesPerson.FullName,
                                g.Key.Day,
                                TotalAmount = g.Sum(sd => sd.LineTotal)
                            };

            var viewModel = salesData.GroupBy(s => new { s.SalesPersonId, s.FullName })
                             .Select(g => new SalesReportViewModel
                             {
                                 SalesPersonID = g.Key.SalesPersonId,
                                 FullName = g.Key.FullName,
                                 Amounts = g.OrderBy(s => s.Day).Select(s => s.TotalAmount).ToArray()
                             })
                             .ToList();

            return View(viewModel);
        }
        public ActionResult DatePicker()
        {
            return PartialView("DatePicker");
        }

        [HttpGet]
        public ActionResult SalesPivot(int id)
        {
            var salesOrder = _db.SalesOrderDetails.Where(x => x.SalesPersonId == id).ToList();
            return Json(salesOrder);
        }
    }
}
