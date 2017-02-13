$(document).ready(function() {
    $(document).mousemove(function(e) {
        var $width = ($(document).width()/30);
        var $height = ($(document).height()/30);
        var $r = parseInt(e.pageX / $width,10) + 225;
        var $g = parseInt(e.pageY / $height,10) + 225;
        var $b = 230;
        $("body").css("background-color", "rgb("+$r+","+$g+","+$b+")");
        console.log(e.pageX/$width + " " + e.pageY/$height);
    }); 
});

