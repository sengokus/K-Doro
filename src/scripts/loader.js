function loader(){
    $(window).on("load", function() {
        $(".loader-wrapper").fadeOut("slow");
    });
}

// waits for the page to load before randomizing the image
(loader());