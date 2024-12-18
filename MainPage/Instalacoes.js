$(document).ready(function () {
    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $("#myModal").modal('hide');
    }

    $('button.rounded-border').click(function () {
        showLoading();

        const iframeSrc = $(this).data('src');

        $('#myModal').data('iframeSrc', iframeSrc).modal('show');
    });

    $('#myModal').on('shown.bs.modal', function () {
        const iframeSrc = $(this).data('iframeSrc');

        $(this).find('iframe').attr('src', iframeSrc);
    });

    $('#myModal').on('hidden.bs.modal', function () {
        $(this).find('iframe').attr('src', '');
    });
});