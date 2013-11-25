PUMPER.GameLoader = PUMPER.GameLoader || function(parameters)   {

    this.loadargs       =   parameters["loadargs"]         || {};
    this.gamestats      =   parameters["gamestats"]        || {};
    this.canvasname     =   parameters["canvasname"]       || {};
    this.compcodec      =   PUMPER.GetCompatibleCodecs();
           
};

PUMPER.GameLoader.prototype.Load    =   function()  {
    var _this = this;
    if(this.loadargs["ucsdata"] !== undefined && this.loadargs.songid !== undefined) {
        this.soundfile = (this.compcodec.audio.indexOf("mp3") > -1)?"ucs/mp3/"+this.loadargs["songid"]+".mp3":"ucs/ogg/"+this.loadargs["songid"]+".ogg";
        this.imagefile = "ucs/img/"+this.loadargs.songid+".jpg";
        this._UCS = PUMPER.UCSParser(this.loadargs.ucsdata);
        var gameCanvas = document.getElementById(_this.canvasname);
        
        PumpGame = new PUMPER.Game({UCSData:this._UCS,music:this.soundfile,backgroundimage:this.imagefile, canvas: gameCanvas, scrollspeed: GameParameters.scrollSpeed});
        this.Animate();
    }else
        PUMPER.debug("No UCS data specifed!");           
 
};

PUMPER.GameLoader.prototype.Animate =   function()  {
    PUMPER.GameLoaderAnimate();
};
PUMPER.GameLoader.prototype.DrawLoading = function()    {
    this.ctx.font = "bold 56px sans-serif";
    this.ctx.textAlign = 'center';
    this.ctx.clearRect(0,0,640,480);
    this.ctx.fillStyle = "rgb(255, 255, 255)";
    if(this.HasProgress)    {
        this.ctx.fillText("Loaded: "+this.LoadedPercent+"%", 320, 260);
        this.ctx.fillText(((this.LoadedBytes/1024)>>0)+"/"+((this.TotalBytes/1024)>>0)+" KB", 320, 320);    
    }else{
        this.ctx.fillText("Loading", 320, 240);
    }
};
PUMPER.GameLoaderAnimate = function()   {
    requestAnimFrame(PUMPER.GameLoaderAnimate);
	PumpGame.Looper.loop();
};
