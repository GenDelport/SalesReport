/*const table = document.createElement("table");*/
/*var activeTable = document.getElementsByClassName("active-table");*/
//table.style.maxHeight = "20px";
/*const parentRows = document.querySelectorAll('.parent-row');*/
var table = document.getElementsByClassName("active-table");
var drillDown = document.getElementById("drillDown");
function toggleTable(row) {
    const id = row.dataset.id;
    var nestedTable = row;
    if (nestedTable.classList.contains("active-row")) {
        nestedTable.classList.remove("active-row");
        nestedTable.nextElementSibling.classList.remove('active-table');
        //table.style.display = "none";
        /* activeTable.display = "none";*/
        table.display = "none";
    } else {
        nestedTable.classList.add("active-row");
        nestedTable.nextElementSibling.classList.toggle('active-table');
        //let tbody = table.tBodies[0];
        //if (!tbody) {
        //    tbody = document.createElement("tbody");
        //    table.appendChild(tbody);
        //}
        const row2 = document.createElement("tr");
        drillDown.appendChild(row2);
       /* activeTable.display = "block";*/
        $.ajax({
            url: "/SalesReport/SalesPivot",
            type: "GET",
            data: { id: id },
            dataType: "json",
            success: function (data) {
                /*table.style.display = "block";*/
                $.each(data, function (index, value) {
                    const cell = document.createElement("td");
                    cell.textContent = value.salesPersonId;
                    row2.appendChild(cell);
                    //const tr = document.createElement("tr");
                    //const td1 = document.createElement("td");
                    //td1.textContent = value.lineTotal;
                    //tr.appendChild(td1);
                    //drillDown.appendChild(tr);
                });
                //nestedTable.appendChild(table);
            },
            error: function (xhr, status, error) {
                console.log("Error: " + error);
            }
        });
    }
}