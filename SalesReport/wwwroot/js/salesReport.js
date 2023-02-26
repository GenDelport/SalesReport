const rows = document.querySelectorAll('.row');

rows.forEach(row => {
    row.addEventListener('click', () => {
        row.nextElementSibling.classList.toggle('hidden-row');
    });
});

function datePickerModal() {
    $.ajax({
        url: "/Home/DatePicker", // Replace with the URL of the action that returns the view you want to display
        type: "GET",
        success: function (result) {
            $("#myModal .modal-body").html(result); // Display the view content inside the modal
            $("#myModal").modal("show"); // Show the modal
        }
    });
}

$(function () {
    $("#myButton").click(function () {
        $.ajax({
            url: "/SalesReport/DatePicker", // Replace with the URL of the action that returns the partial view
            type: "GET",
            success: function (result) {
                $("#myModal .modal-content").html(result); // Display the partial view content inside the modal
                $("#myModal").modal("show"); // Show the modal
            }
        });
    });
});
//function setBackdrop(data) {
//    var myModalbackdrop = document.getElementsByClassName("modal-backdrop")[0];
//    if (myModalbackdrop !== undefined) {
//        myModalbackdrop.outerHTML = ""
//    }
//    placeHolderElement.html("");
//    placeHolderElement.html(data);
//    showModal()
//}
//function showModal() {
//    placeHolderElement.find('.modal').modal('hide')
//    var myModal = new bootstrap.Modal(placeHolderElement.find('.modal'), {
//        backdrop: 'static',
//        keyboard: false,
//        show: false,
//        focus: false
//    })
//    placeHolderElement.find('.modal').modal('show')
//    if (myModal._element.id == 'POS') {
//        const myModalEl = document.getElementById('POS')
//        myModalEl.addEventListener('shown.bs.modal', function () {
//            $('#barcodearea').focus();
//        })
//    }
//}