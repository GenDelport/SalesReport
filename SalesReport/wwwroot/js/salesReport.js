var month = null;
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
let topFiveSalesChart = null;
let tenBestProductsChart = null;
let topThreeSalesChart = null;
let lineChart = null;
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
    let tableHeader = table.querySelector('thead');
    if (!tableHeader) {
        tableHeader = document.createElement('thead');
        table.appendChild(tableHeader);
    }
    let tableHeaderRow = tableHeader.querySelector('tr');
    if (!tableHeaderRow) {
        tableHeaderRow = document.createElement('tr');
        tableHeader.appendChild(tableHeaderRow);
    } else {
        tableHeaderRow.innerHTML = '';
    }
    const fixedColumnHeader = document.createElement('th');
    fixedColumnHeader.textContent = 'Sales Person';
    fixedColumnHeader.classList.add('fixed-column');
    tableHeaderRow.appendChild(fixedColumnHeader);
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

        var arrow = document.createElement("span");
        arrow.setAttribute("class", "arrowClass");
        arrow.textContent = "▼";
        arrow.style.color = "gray";
        arrow.style.marginLeft = "5px"

        var fullNameCell = createCell(value.fullName, "fixed-column");
        fullNameCell.appendChild(arrow);
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
        renderTopFiveSalesChart(data);
    })
}
function loadProducts() {
    $.get('/SalesReport/TopTenBestSellerProducts', (data, status) => {
        console.log(status, data);
        renderTenBestProductsChart(data);
    })
}
function loadTotalSales() {
    $.get('/SalesReport/TopSalesOfLastThreeMonths', (data, status) => {
        console.log(status, data);
        renderTopThreeSalesChart(data);
    })
}
function loadLineChart() {
    $.get('/SalesReport/TotalSalesPerMonthForTheYear', (data, status) => {
        console.log(status, data);
        renderLineChart(data);
    })
}


function renderTopFiveSalesChart(data) {
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
            name: "Total Sales",
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
    if (topFiveSalesChart == null) {
        topFiveSalesChart = new ApexCharts(document.getElementById("chart-bar-sales"), options);

        topFiveSalesChart.render();
    }
    else {
        topFiveSalesChart.updateOptions(options)
    }
}

function renderTenBestProductsChart(data) {
    let series = []
    let labels = []
    if (data != null)
        for (let i = 0; i < data.length; i++) {
            series.push(data[i].quantitySold)
            labels.push(data[i].productName)
        }
    var options = {
        chart: {
            id: "chart-pie-products",
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
    if (tenBestProductsChart == null) {
        tenBestProductsChart = new ApexCharts(document.getElementById("chart-pie-products"), options);

        tenBestProductsChart.render();
    }
    else {

        tenBestProductsChart.updateOptions(options)
    }
}

function renderTopThreeSalesChart(data) {
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
            id: "chart-bar-topsales",
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
        dataLabels: {
            enabled: true,
            formatter: function (val, opt) {
                return "R " + Number((val).toFixed(2)).toLocaleString()
            },

        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true
            },
            colors: colorPalette,
        },
        series: [
            {
                name: "Total Sales",
                data: chartData
            }],
        xaxis: {
            name: 'Month',
            categories: chartLabels
        },
    };

    if (topThreeSalesChart == null) {
        topThreeSalesChart = new ApexCharts(document.getElementById("chart-bar-topsales"), options);

        topThreeSalesChart.render();
    }
    else {
        topThreeSalesChart.updateOptions(options)
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
        dataLabels: {
           
            formatter: function (val, opt) {
                return "R " + Number((val).toFixed(2)).toLocaleString()
            },

        },
        plotOptions: {
            bar: {
                distributed: true,
                horizontal: true
            },
            colors: colorPalette,
        },
        series: [
            {
                name: "Total Sales",
                data: chartData
            }],
        xaxis: {
            name: 'Month',
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

function toggleTable(row, month) {
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
                subTableHtml += '<td style="font-weight: bold">Line Total</td>';
                subTableHtml += '<td style="font-weight: bold">Order Quantity</td>';
                subTableHtml += '<td style="font-weight: bold">Product Name</td>';
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

const tableContainer = document.querySelector('.table-container');

// Create an intersection observer that will call a function when the element is visible
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            // Add the fade-in class to the table container
            tableContainer.classList.add('fade-in');
        } else {
            // Remove the fade-in class from the table container
            tableContainer.classList.remove('fade-in');
        }
    });
});

// Observe the table container element
observer.observe(tableContainer);