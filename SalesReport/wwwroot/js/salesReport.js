var month = null;
$(document).ready(async function () {
    await Promise.all([
        loadReport(),
        loadTopSalesPerson(),
        loadSales(),
        loadProducts(),
        loadTotalSales(),
        loadLineChart(),
        loadFooter()
    ]);
});
function loadReport() {
    $.get('/SalesReport/SalesPerPersonOnEachDay?month='+ month, (data, status) => {
        console.log(status, data);
        renderReport(data);
    })
}
function slectedMonth(data) {
    month = data;
    loadReport();
}
function getDates(month) {
    var table = document.getElementById("myTable");

    // Check if the table header already exists
    let tableHeader = table.querySelector('thead');
    if (!tableHeader) {
        // Create the table header if it doesn't exist
        tableHeader = document.createElement('thead');
        table.appendChild(tableHeader);
    }

    // Create or update the table header row
    let tableHeaderRow = tableHeader.querySelector('tr');
    if (!tableHeaderRow) {
        // Create the table header row if it doesn't exist
        tableHeaderRow = document.createElement('tr');
        tableHeader.appendChild(tableHeaderRow);
    } else {
        // Clear the existing header row
        tableHeaderRow.innerHTML = '';
    }

    // Create the fixed column header
    const fixedColumnHeader = document.createElement('th');
    fixedColumnHeader.textContent = 'Sales Person';
    fixedColumnHeader.classList.add('fixed-column');
    tableHeaderRow.appendChild(fixedColumnHeader);

// Create the column headers for each day of the month
    if (month == null) {
        month = 1
    }
    const daysInMonth = new Date(2022, month, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
        const columnHeader = document.createElement('th');
        columnHeader.textContent = i.toString();
        columnHeader.classList.add('text-center');
        tableHeaderRow.appendChild(columnHeader);
    }
}
function renderReport(data) {
    getDates(month);
    var table = document.getElementById("myTable");
    var tbody = table.querySelector("tbody") || table.appendChild(document.createElement("tbody"));

    // Remove all existing rows before updating
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    data.forEach(function (value) {
        var row = createRow(value);
        tbody.appendChild(row);
    });

    function createRow(value) {
        var row = document.createElement("tr");
        row.setAttribute("data-id", value.salesPersonID);
        row.setAttribute("onclick", "toggleTable(this,month)");
        row.setAttribute("class", "dataRow");

        var fullNameCell = createCell(value.fullName, "fixed-column");
        row.appendChild(fullNameCell);

        value.amounts.forEach(function (amount) {
            var amountCell = createCell("R" + amount.toFixed(2));
            row.appendChild(amountCell);
        });

        var subRow = document.createElement("tr");
        subRow.setAttribute("class", "subTableRow");
        subRow.setAttribute("style", "display:none");
        tbody.appendChild(subRow);

        return row;
    }

    function updateRow(row, value) {
        // No need to update rows, just delete all existing rows and recreate them
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        createRow(value);
    }

    function createCell(value, className) {
        var cell = document.createElement("td");
        cell.innerHTML = value;
        if (className) cell.setAttribute("class", className);
        return cell;
    }
}
function loadTopSalesPerson() {
    $.ajax({
        url: "/SalesReport/TopSalesPerson",
        type: "GET",
        dataType: "json",
        success: function (data) {
            // Update labels with data
            $("#salesperson-name").text(data.salesPersonName);
            $("#salesperson-sales").text("Sales: R" + data.totalSales.toFixed(2));
            $("#salesperson-quantity").text("Quantity: " + data.totalQuantity);
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr.responseText);
        }
    });
}
function loadSales() {
    $.get('/SalesReport/TopFiveSalesPeople', (data, status) => {
        console.log(status, data);
        renderAccountingChart(data);
    })
}
function loadProducts() {
    $.get('/SalesReport/TopTenBestSellerProducts', (data, status) => {
        console.log(status, data);
        renderSpieciesChart(data);
    })
}
function loadTotalSales() {
    $.get('/SalesReport/TopSalesOfLastThreeMonths', (data, status) => {
        console.log(status, data);
        renderDiagnosisChart(data);
    })
}
function loadLineChart() {
    $.get('/SalesReport/TotalSalesPerMonthForTheYear', (data, status) => {
        console.log(status, data);
        renderLineChart(data);
    })
}
var colorPalette = [
    '#05aaff',
    '#82a0ff',
    '#c890fb',
    '#fd7edd',
    '#ff72b1',
    '#ff767e',
    '#ff8b49',
    '#ffa600',
    '#6194EA',
    '#817DCE',
    '#9068AE',
    '#95558D',
    '#8F456D',
];
Apex.colors = colorPalette;
let fromDate = new Date();
let toDate = new Date()
let salesChart = null;
let diagnosisChart = null;
let spieciesChart = null;
let accountingChart = null;
let lineChart = null;

function renderAccountingChart(data) {
    let chartData = []
    let chartLabels = []
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            chartData.push(data[i].totalSaleAmount)
            chartLabels.push(data[i].salesPersonName)
        }
    }
    var options = {
        chart: {
            id: "chart-bar-sales",
            width: '100%',
            height: '100%',
            type: 'bar',
            toolbar: {
                show: false
            },
            shadow: {
                enabled: false,
            },

        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: false,

            },

        },
        colors: colorPalette,
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return "R " + Number((val).toFixed(2)).toLocaleString()
            },

        },
        series: [{
            name: "Amount",
            data: chartData,

        }],
        xaxis: {
            name: 'Sales Person',
            categories: chartLabels
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return "R " + Number((value).toFixed(2)).toLocaleString()
                }
            },
        },
    };
    if (accountingChart == null) {
        accountingChart = new ApexCharts(document.getElementById("chart-bar-sales"), options);

        accountingChart.render();
    }
    else {
        accountingChart.updateOptions(options)
    }
}

function renderSpieciesChart(data) {
    let series = []
    let labels = []
    if (data != null)
        for (let i = 0; i < data.length; i++) {
            series.push(data[i].quantitySold)
            labels.push(data[i].productName)
        }
    var options = {
        chart: {
            id: "chart-pie-spiecies",
            width: '100%',
            height: '100%',
            type: 'pie',
            toolbar: {
                show: false
            },
            shadow: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: true
        },
        series: series,
        labels: labels,

    };
    if (spieciesChart == null) {
        spieciesChart = new ApexCharts(document.getElementById("chart-pie-spiecies"), options);

        spieciesChart.render();
    }
    else {

        spieciesChart.updateOptions(options)
    }
}

function renderDiagnosisChart(data) {
    let chartData = []
    let chartLabels = []
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            chartData.push(data[i].salesTotal)
            chartLabels.push(data[i].month)
        }
    }
    var options = {
        chart: {
            id: "chart-bar-diagnosis",
            width: '100%',
            height: '100%',
            type: 'bar',
            toolbar: {
                show: false
            },
            shadow: {
                enabled: false,
            },
            colors: colorPalette,
        },
        colors: colorPalette,
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true
            },
            colors: colorPalette,
        },
        series: [
            {
                name: "Diagnosis",
                data: chartData
            }],
        xaxis: {
            name: 'Total',
            categories: chartLabels
        },
    };

    if (diagnosisChart == null) {
        diagnosisChart = new ApexCharts(document.getElementById("chart-bar-diagnosis"), options);

        diagnosisChart.render();
    }
    else {
        diagnosisChart.updateOptions(options)

    }
}

function renderLineChart(data) {
    let chartData = []
    let chartLabels = []
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            chartData.push(data[i].totalSales)
            chartLabels.push(data[i].month)
        }
    }
    var options = {
        chart: {
            id: "line-chart-sales",
            width: '100%',
            height: '100%',
            type: 'line',
            toolbar: {
                show: false
            },
            shadow: {
                enabled: false,
            },
            colors: colorPalette,
        },
        colors: colorPalette,
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true
            },
            colors: colorPalette,
        },
        series: [
            {
                name: "Diagnosis",
                data: chartData
            }],
        xaxis: {
            name: 'Total',
            categories: chartLabels
        },
    };
    if (lineChart == null) {
        lineChart = new ApexCharts(document.getElementById("line-chart-sales"), options);
        lineChart.render();
    }
    else {
        lineChart.updateOptions(options)
    }
}

function toggleTable(row,month) {
    var rowId = $(row).data('id');
    var subTableRow = $(row).next('.subTableRow');
    if (subTableRow.is(":visible")) {
        subTableRow.hide();
        subTableRow.removeClass('show');
    } else {
        $.ajax({
            url: "/SalesReport/SalesPivot",
            type: "GET",
            data: { id: rowId,rowMonth:month  },
            dataType: "json",
            success: function (data) {
                var subTableHtml = '<table>';
                subTableHtml += '<thead>';
                subTableHtml += '<tr>';
                subTableHtml += '<td>LineTotal</td>';
                subTableHtml += '<td>Order Quantity</td>';
                subTableHtml += '<td>Product Name</td>';
                subTableHtml += '</tr>';
                subTableHtml += '</thead>';
                subTableHtml += '<tbody>';
                $.each(data.topSales, function (index, value) {
                    subTableHtml += '<tr>';
                    subTableHtml += '<td>' + value.productName + '</td>';
                    subTableHtml += '<td>' + value.orderQuantity + '</td>';
                    subTableHtml += '<td> R' + value.salesAmount.toFixed(2) + '</td>';
                    subTableHtml += '</tr>';
                });

                subTableHtml += '</tbody>';
                subTableHtml += '</table>';
                subTableRow.html(subTableHtml);
                subTableRow.show();
                subTableRow.html(subTableHtml).addClass('show');
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    }
}

function loadFooter() {
    var myLabel = document.getElementById("myLabel");
    
    fetch('https://open.er-api.com/v6/latest/USD')
        .then(response => response.json())
        .then(data => {
            var dateString = data.time_next_update_utc;
            var date = new Date(Date.parse(dateString));
            var now = new Date();
            var timestamp = now.getTime(); // current timestamp in milliseconds
            var nowDate = new Date().toUTCString();
            if (timestamp => date.getTime()) {
                console.log('Current UTC date is greater than', dateString);
                myLabel.innerText = "ZAR/USD Exchange rate: "+data.rates.USD + "/" + data.rates.ZAR;
            } else {
                console.log('Current UTC date is not greater than', dateString);
                myLabel.innerText = "ZAR/USD Exchange rate: " + data.rates.USD + "/" + data.rates.ZAR;
            }
        })
        .catch(error => {
            console.error(error);
        });
}

//$(window).scroll(function () {
//    if ($(this).scrollTop() > 0) {
//        $('.navbar, .footer').removeClass('hide');
//    } else {
//        $('.navbar, .footer').addClass('hide');
//    }
//});

//$('#scrollButton').click(function () {
//    $('html, body').animate({
//        scrollTop: $('#div2').offset().top
//    }, 'slow');
//});