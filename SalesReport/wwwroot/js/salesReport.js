//var pivotResult = [];
//$(document).ready(function () {
//    $('tr').click(function () {
//        var dataId = $(this).data('id');
//        var postData = { rowId: dataId };
//        $.ajax({
//            type: "GET",
//            url: "/SalesReport/SalesPivot",
//            data: postData,
//            success: function (result) {

//            },
//            error: function (xhr, status, error) {
//                console.log(xhr.responseText);
//            }
//        });
//    });
//});

//const table = document.getElementById("myTable");
//table.addEventListener("click", function (event) {
//    // Check if the clicked element is a table cell
//    if (event.target.tagName === "TD") {
//        // Get the parent row of the clicked cell
//        const row = event.target.parentNode;

//        // Check if the row already has a drilldown row
//        if (row.nextSibling && row.nextSibling.classList && row.nextSibling.classList.contains("drilldown")) {
//            // Remove the drilldown row
//            row.parentNode.removeChild(row.nextSibling);
//        } else {
//            // Create a new row element
//            const newRow = document.createElement("tr");
//            newRow.classList.add("drilldown");
//            newRow.innerHTML = "<td colspan='2'>Hello</td>";

//            // Insert the new row after the clicked row
//            row.parentNode.insertBefore(newRow, row.nextSibling);
//        }
//    }
//});


const table = document.getElementById("myTable");

// Add a click event listener to the table
table.addEventListener("click", function (event) {
    // Check if the clicked element is a table cell
    if (event.target.tagName === "TD") {
        // Get the parent row of the clicked cell
        const row = event.target.parentNode;

        // Get the ID of the clicked row
        const id = row.dataset.id;
        // Check if the row already has a drilldown row
        if (row.nextSibling && row.nextSibling.classList && row.nextSibling.classList.contains("drilldown")) {
            // Remove the drilldown row
            row.parentNode.removeChild(row.nextSibling);
        }
        else {
            // Send an AJAX request to the server to get data
            $.ajax({
                url: "/SalesReport/SalesPivot",
                type: "GET",
                data: { id: id },
                dataType: "json",
                success: function (data) {
                    $.each(data, function (index, value) {
                        const newRow = document.createElement("tr");
                        newRow.classList.add("drilldown");
                        newRow.innerHTML = "$<td colspan='2'></td>";

                        // Insert the new row after the clicked row
                        row.parentNode.insertBefore(newRow, row.nextSibling);
                    });
                },
                error: function (xhr, status, error) {
                    console.log("Error: " + error);
                }
            });
        }
    }
});