const rows = document.querySelectorAll('.row');

rows.forEach(row => {
    row.addEventListener('click', () => {
        row.nextElementSibling.classList.toggle('hidden-row');
    });
});

function datePickerModal() {
    $.ajax({
        url: "/SalesReport/DatePicker", // Replace with the URL of the action that returns the view you want to display
        type: "GET",
        success: function (result) {
            $("#myModal .modal-body").html(result); // Display the view content inside the modal
            $("#myModal").modal("show"); // Show the modal
            $("#myModal").focus();
        }
    });
}