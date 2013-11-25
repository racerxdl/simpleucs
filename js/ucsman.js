if (window['File'] && window['FileReader'] && window['FileList'] && window['Blob']) {
  // Great success! All the File APIs are supported.
} else {
  alert('The File APIs are not fully supported in this browser.');
}
function handleDragOver(e)  {
    e.preventDefault();
    e.stopPropagation();
    e.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
};
jQuery.fn.center = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
jQuery.fn.centerw = function () {
    this.css("position","absolute");
    this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + 
                                                $(window).scrollLeft()) + "px");
    return this;
}
jQuery.fn.centerh = function () {
    this.css("position","absolute");
    this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + 
                                                $(window).scrollTop()) + "px");
    return this;
}

function handleFileSelect(e)    {
    e.preventDefault();
    e.stopPropagation();
    
    var files = e.originalEvent.dataTransfer.files; // FileList object.
    if(files.length > 0)    {
        PUMPER.log("Reading file "+files[0].name);
        var reader = new FileReader();
        reader.onload = (function(theFile) { return function(e) {
            $("#gamePoint").html("");
            var data = e.target.result;
            var UCS = theFile.name.slice(0,5);
			var GameStats = new Stats();
			var newCanvas =    $('<canvas/>').attr({'id':'gamescreen', 'width': 820, 'height': 480});
			newCanvas.width(820);
			newCanvas.height(480);
			newCanvas.css({
                position: 'absolute',
                zIndex: 5000,
                top: "138px",
                left: "0px"
            });
            //  POS: 468x485
            newCanvas.centerw();
			$("#gamePoint").append(newCanvas);
			$("#gamePoint").append('<BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><input type="button" onClick="PumpGame.play();" value="Play"><input type="button" onClick="PumpGame.pause();" value="Pause"><input type="button" onClick="PUMPER.ScrollSpeed=PUMPER.ScrollSpeed+ 1;" value="Speed+"><input type="button" onClick="PUMPER.ScrollSpeed=PUMPER.ScrollSpeed-1" value="Speed-">');
			GameStats["domElement"].style.position = 'absolute';
			GameStats["domElement"].style.left = '0px';
			GameStats["domElement"].style.top = '0px';
			document.body.appendChild( GameStats["domElement"] );
			GameParameters = PUMPER.parseHashes();
			PUMPER.ScrollSpeed = (GameParameters.scrollSpeed!==undefined)?parseInt(GameParameters.scrollSpeed):4;
            PumpGameLoader = new PUMPER.GameLoader({"loadargs" : {"ucsdata":data,"songid" : UCS}, "canvasname" : "gamescreen", "gamestats" : GameStats});
            PumpGameLoader.Load();
                       
        };})(files[0]);
        reader.readAsText(files[0]);   
        $("#gamePoint").on('dragover', function(e){});
        $("#gamePoint").on('drop', function(e){});
    }else
        PUMPER.log("No files, uh?");
    
};
$(window).resize(function(){
    $("#gamescreen").centerw();
});
$( document ).ready(function() {
    $("#gamePoint").html("<BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR><BR>Thrown your UCS File here.");
    $("#gamePoint").on('dragover', handleDragOver);
    $("#gamePoint").on('drop', handleFileSelect);
});

