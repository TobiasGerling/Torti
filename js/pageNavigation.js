$(document).ready(function () {
  
    $("#weiter_button").click(function () {
        var test = $("#grid_sector_1").height();
        $('#grid_cake_settings').animate({
            scrollTop: test
           /*  scrollTop: $("#grid_sector_1").offset().top */
        }, 1250);
    });
});