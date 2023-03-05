using FluentAssertions.Extensions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using SalesReport.Models;
using SalesReport.Models.ViewModels;
using System.Collections.Generic;
using System.Globalization;

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
            return View();
        }
        [HttpGet]
        public async Task<IActionResult> SalesPerPersonOnEachDay(int? month)
        {
            // Get the sales data from the database for the specified month or January 2022 if month parameter is null
            var selectedMonth = new DateTime(2022, month ?? 1, 1);
            var salesDataForMonth = await _db.SalesOrderDetails
                .Where(s => s.SaleDate.Year == selectedMonth.Year && s.SaleDate.Month == selectedMonth.Month)
                .Select(s => new { s.SalesPersonId, s.SaleDate.Day, s.LineTotal })
                .ToListAsync();

            // Load all SalesPeople into a dictionary
            var salesPeople = await _db.SalesLtSalesPeople.ToDictionaryAsync(p => p.Id);

            // Group the sales data by salesperson and day
            var salesByPersonAndDay = from sale in salesDataForMonth
                                      group sale by new { sale.SalesPersonId, sale.Day } into g
                                      select new
                                      {
                                          SalesPersonID = g.Key.SalesPersonId,
                                          g.Key.Day,
                                          TotalAmount = g.Sum(s => s.LineTotal)
                                      };

            // Create a new collection of SalesPersonViewModel objects to pass to the view
            var viewModel = new List<SalesReportViewModel>();

            foreach (var group in salesByPersonAndDay.GroupBy(s => s.SalesPersonID))
            {
                if (salesPeople.TryGetValue(group.Key ?? 0, out var salesPerson))
                {
                    var salesPersonViewModel = new SalesReportViewModel
                    {
                        SalesPersonID = salesPerson.Id,
                        FullName = salesPerson.FullName,
                        Amounts = new decimal[DateTime.DaysInMonth(selectedMonth.Year, selectedMonth.Month)]
                    };

                    foreach (var sale in group)
                    {
                        salesPersonViewModel.Amounts[sale.Day - 1] = sale.TotalAmount;
                    }

                    viewModel.Add(salesPersonViewModel);
                }
            }

            return Json(viewModel);
        }
        public ActionResult DatePicker()
        {
            return PartialView("DatePicker");
        }

        [HttpGet]
        public ActionResult SalesPivot(int id, int rowMonth)
        {
            if(rowMonth == 0) {
                rowMonth = 1;
            }
            var salesOrder = _db.SalesOrderDetails
                .Where(x => x.SalesPersonId == id && x.SaleDate.Month == rowMonth)
                .Include(x => x.Product)
                .GroupBy(x => x.SalesPersonId)
                .Select(g => new
                {
                    SalesPersonId = g.Key,
                    TopSales = g.OrderByDescending(x => x.LineTotal)
                        .Take(5)
                        .Select(x => new
                        {
                            ProductName = x.Product.Name,
                            OrderQuantity = x.OrderQty,
                            SalesAmount = x.LineTotal
                        })
                        .ToList()
                })
                .FirstOrDefault();

            return Json(salesOrder);
        }

        public async Task<IActionResult> TopSalesLastThreeMonths()
        {
            int currentMonth = DateTime.Now.Month;
            int threeMonthsAgoMonth = DateTime.Now.AddMonths(-3).Month;

            // Query the sales data
            var sales = await _db.SalesOrderDetails
                .Where(s => s.SaleDate.Month >= threeMonthsAgoMonth)
                .GroupBy(s => s.SalesPersonId)
                .Select(g => new
                {
                    SalePersonID = g.Key,
                    TotalSales = g.Sum(s => s.LineTotal)
                })
                .OrderByDescending(s => s.TotalSales)
                .Take(1)
                .SingleOrDefaultAsync();

            return Json(sales);
        }

        //public ActionResult TopSalesOfLastThreeMonths()
        //{
        //    var topSales = _db.SalesOrderDetails.ToList();
        //    return Json(topSales);
        //}
        [HttpGet]
        public ActionResult GetMonths()
        {
            // Create a new instance of the DateTimeFormatInfo class
            DateTimeFormatInfo dateFormat = new DateTimeFormatInfo();

            // Get an array of month names
            string[] monthNames = dateFormat.MonthNames;

            // Create a list of MonthData objects
            List<Month> months = new List<Month>();

            // Loop through the array and add each month to the list
            for (int i = 0; i < monthNames.Length; i++)
            {
                months.Add(new Month
                {
                    MonthName = monthNames[i],
                    MonthNumber = i + 1
                });
            }

            // Serialize the list to JSON and return it
            return Json(months);
        }

        [HttpGet]
        public async Task<IActionResult> TopFiveSalesPeople()
        {
            var currentMonth = 12;
            var currentYear = 2022;

            // Query the SalesOrderDetails table to get the total sale amount for each salesperson in the current month
            var topSalesPeople = _db.SalesOrderDetails
                .Where(s => s.SaleDate.Month == currentMonth && s.SaleDate.Year == currentYear)
                .GroupBy(s => s.SalesPersonId)
                .Select(g => new
                {
                    SalesPersonId = g.Key,
                    SalesPersonName = g.FirstOrDefault().SalesPerson.FullName,
                    TotalSaleAmount = g.Sum(s => s.LineTotal)
                })
                .OrderByDescending(s => s.TotalSaleAmount)
                .Take(5)
                .ToList();

            return Ok(topSalesPeople);
        }

        [HttpGet]
        public async Task<IActionResult> TopTenBestSellerProducts()
        {
            var products = _db.SalesOrderDetails
                    .GroupBy(x => x.ProductId)
                    .Select(g => new
                    {
                        ProductName = g.FirstOrDefault().Product.Name,
                        QuantitySold = g.Sum(x => x.OrderQty)
                    })
                    .OrderByDescending(x => x.QuantitySold)
                    .Take(10)
                    .ToList();

            return Ok(products);
        }

        [HttpGet]
        public async Task<IActionResult> TopSalesOfLastThreeMonths()
        {
            var currentMonth = 12;
            var currentYear = 2022;
            var salesTotalByMonth = await _db.SalesOrderDetails
        .Where(s => s.SaleDate.Month >= (currentMonth - 2) && s.SaleDate.Year == currentYear)
        .GroupBy(s => new { s.SaleDate.Year, s.SaleDate.Month })
        .Select(g => new
        {
            Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key.Month),
            SalesTotal = g.Sum(s => s.LineTotal)
        })
        .ToListAsync();
            //var threeMonthsAgo = DateTime.Today.AddMonths(-3);

            // Filter the sales records that fall within the last three months
            //var salesTotal = await _db.SalesOrderDetails
            //   .Where(s => s.SaleDate.Month >= (currentMonth - 3) && s.SaleDate.Year == currentYear)
            //    .SumAsync(s => s.LineTotal);

            return Ok(salesTotalByMonth);
        }

        [HttpGet]
        public IActionResult TopSalesPerson()
        {
            var topSalesPerson = _db.SalesOrderDetails
         .Include(x => x.SalesPerson)
         .GroupBy(x => x.SalesPersonId)
         .Select(g => new
         {
             //SalesPersonId = g.Key,
             SalesPersonName = g.FirstOrDefault().SalesPerson.FullName,
             TotalSales = g.Sum(x => x.LineTotal),
             TotalQuantity = g.Sum(x => x.OrderQty)
         })
         .OrderByDescending(x => x.TotalSales)
         .FirstOrDefault();

            return Json(topSalesPerson);
        }

        [HttpGet]
        public IActionResult TotalSalesPerMonthForTheYear()
        {
            var currentMonth = 12;
            var currentYear = 2022;
            var totalSales = _db.SalesOrderDetails
         .Include(x => x.SalesPerson)
         .Where(x => x.SaleDate.Year == currentYear) // filter by current year
         .GroupBy(x => x.SaleDate.Month) // group by month
         .Select(g => new 
         {
             Month = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(g.Key),
             TotalSales = g.Sum(x => x.LineTotal) })
         .ToList();
            return Ok(totalSales);
        }
    }
}
