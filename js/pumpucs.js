/**
 *	@author Lucas Teske - lucas at teske dot net dot br
 */

var PUMPER = PUMPER || { VERSION: 1.0 };
PUMPER.ScrollSpeed = 3;
self.console = self.console || {
	info: function () {},
	log: function () {},
	debug: function () {},
	warn: function () {},
	error: function () {}
};

String.prototype.trim = String.prototype.trim || function () {

	return this.replace( /^\s+|\s+$/g, '' );

};

PUMPER.log    =   function(msg)   {
        console.log("PUMPER(log):> "+msg);
};
PUMPER.debug  =   function(msg)   {
        console.log("PUMPER(debug):> "+msg);
};
PUMPER.ResizeImage = function(image,width,height)   {
      var canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      var context = canvas.getContext('2d');
      context.drawImage(image,0,0,image.width,image.height,0,0,width,height);
      //context.drawImage(image,0,0,width,height);
      return canvas;
}
PUMPER.GetCompatibleCodecs = function()  {
    var testEl = document.createElement( "video" ), testEl2 = document.createElement( "audio" ),
    video=[],audio=[];
    if ( testEl.canPlayType ) {
        // Check for MPEG-4 support
        if("" !== testEl.canPlayType( 'video/mp4; codecs="mp4v.20.8"' ))
            video.push("mpeg4");

        // Check for h264 support
        if("" !== ( testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E"' )|| testEl.canPlayType( 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"' ) ))
            video.push("h264");

        // Check for Ogg support
        if("" !== testEl.canPlayType( 'video/ogg; codecs="theora"' ))
            video.push("ogg");

        // Check for Webm support
        if("" !== testEl.canPlayType( 'video/webm; codecs="vp8, vorbis"' ))
            video.push("webm");
        
    }
    if (testEl2.canPlayType)    {
        if("" !== testEl2.canPlayType('audio/mpeg'))
            audio.push("mp3");
        if("" !== testEl2.canPlayType('audio/ogg'))
            audio.push("ogg");
    }
    return { "video": video, "audio": audio };
}

PUMPER.cloneCanvas = function ( canvas ) {
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');
    newCanvas.width = canvas.width;
    newCanvas.height = canvas.height;
    context.drawImage(canvas, 0, 0);
    return newCanvas;
}

PUMPER.parseHashes = function () {
	HashConfig = { "UCS" : undefined, "Speed" : 2};
	hashes = window.location.hash.split("#");
	hashes = hashes.filter(function(n){return n; });
	for(var hashn in hashes)		{
		breaked = hashes[hashn].split("=");
		HashConfig[breaked[0]] = breaked[1];
	}
	HashConfig.Speed = parseFloat(HashConfig.scrollSpeed);
	if(isNaN(HashConfig.scrollSpeed))	
		HashConfig.scrollSpeed = 2;
	return HashConfig;
};


PUMPER.UCSParser = PUMPER.UCSParser || function ( UCSText ) {
	var lines = UCSText.split('\n');
	var lastblock = -1;
	var inBlock = false;
	var beat = 0;
	var time = 0;
	var linen = 0;
	var lastbeat = 0;
	var UCSData = { blocks : [] , isDouble : false, numNotes : 0, numBlocks : 0};
	//	Some people has regional settings that makes float uses , instead . - The StepEdit from Andamiro repeates that, and that is wrong. So we correct it changing , to . on some places before parse to float.
	for(var i=0;i<lines.length;i++)	{
		if(lines[i][0] == ':')	{
			if(!inBlock)	{
				if(lastblock > -1)	{
					UCSData.blocks[lastblock]["LastBeat"] = beat;
					UCSData.blocks[lastblock]["EndTime"] = time;
			    }
				lastblock++;
				inBlock = true;
				UCSData.blocks[lastblock] = { "Notes" : [] , "StartBeat": beat , "StartTime":time};
			}
			command = lines[i].replace(":","").split('=');
			UCSData.blocks[lastblock][command[0]] = isNaN(parseFloat(command[1]))?command[1]:parseFloat(command[1].replace(",","."));	
			if(command[0] == "BPM")
				UCSData.blocks[lastblock]["BPS"] = parseFloat(command[1].replace(",","."))/60;
			else if(command[0] == "Delay")	{
				UCSData.blocks[lastblock]["delaybeat"] = ( parseFloat(command[1].replace(",",".")) / 1000 ) * UCSData.blocks[lastblock]["BPS"];
				beat += UCSData.blocks[lastblock]["delaybeat"];
				time += parseFloat(command[1].replace(",",".")) / 1000;
			}else if(command[0] == "Mode")	
				UCSData.isDouble = (command[1].toLowerCase().trim() == "double" || command[1].toLowerCase().trim() == "d-performance");
			else if(command[0] == "Format")
				UCSData.Format = command[1];
		}else{
			inBlock = false;
			if(UCSData.isDouble)	{
				note = { "beat": beat, "time": time, "pos" : [ 0,0,0,0,0,0,0,0,0,0 ] };
				for (var z=0;z<10;z++)	{
					if(lines[i][z] == 'X')
						note.pos[z] = 1;
					else if(lines[i][z] == 'M')
						note.pos[z] = 2;
					else if(lines[i][z] == 'H')
						note.pos[z] = 3;
					else if(lines[i][z] == 'W')
						note.pos[z] = 4;
				}
				if ( !( note.pos[0] == 0 &&  note.pos[1] == 0 &&  note.pos[2] == 0 && note.pos[3] == 0 &&  note.pos[4] == 0 &&  note.pos[5] == 0 &&  note.pos[6] == 0 &&  note.pos[7] == 0 &&  note.pos[8] == 0 &&  note.pos[9] == 0) ) {
					UCSData.blocks[lastblock].Notes.push(note);
					UCSData.numNotes++;
				}					
			}else{
				note = { "beat": beat, "pos" : [ 0,0,0,0,0 ] };
				for (var z=0;z<5;z++)	{
					if(lines[i][z] == 'X')
						note.pos[z] = 1;
					else if(lines[i][z] == 'M')
						note.pos[z] = 2;
					else if(lines[i][z] == 'H')
						note.pos[z] = 3;
					else if(lines[i][z] == 'W')
						note.pos[z] = 4;
				}
				if ( !( note.pos[0] == 0 &&  note.pos[1] == 0 &&  note.pos[2] == 0 && note.pos[3] == 0 &&  note.pos[4] == 0 ) ) {
					UCSData.blocks[lastblock].Notes.push(note);					
					UCSData.numNotes++;
				}
			}
			//console.log("Beat: "+beat+" Time: "+time+" Split: "+UCSData.blocks[lastblock].Split+ " BPM: "+UCSData.blocks[lastblock].BPM+" Line: "+linen);
			beat +=  1.0 / UCSData.blocks[lastblock].Split;
			time +=  1.0 / (UCSData.blocks[lastblock].Split * UCSData.blocks[lastblock].BPS);
			linen += 1;
		}
	}
	console.log("PUMPER.UCSParser :: Parsed UCS\n- Blocks: "+UCSData.blocks.length+"\n- Steps: "+UCSData.numNotes+"\n- Mode: "+((UCSData.isDouble)?"Double":"Single")+"\n- Format: "+UCSData.Format);
	return UCSData;
};
PUMPER.Drawer = PUMPER.Drawer || function ( parameters ) {
	if(parameters.noteskin === undefined || parameters.canvas === undefined)
		console.error("PUMPER.Drawer some parameters are missing");

	this.NoteSkin = parameters.noteskin;
	this.Flashes = [ ];

	for(var i=0;i<10;i++)	
		this.Flashes.push({"visible" : false, "time": 0});
	
	_canvas = parameters.canvas;
	_gctx = _canvas.getContext("2d");

	_background = new Image();
	this._backgroundimage = new Image();
    
	__this = this;
	if(parameters.backgroundimage !== undefined)	{
		this.loaded = false;
		var tmpload = new Image();
		tmpload.onload = function()	{
			__this.loaded = true;
			__this._backgroundimage = PUMPER.ResizeImage(this,820,480);
		};	
		tmpload.src = parameters.backgroundimage;
	}else
		this.loaded = true;

	_NoteLayer = document.createElement("canvas");
	
	_NoteLayer.width = _canvas.width;
	_NoteLayer.height = _canvas.height;
	_notectx = _NoteLayer.getContext("2d");
	
	_leftMarginSingle = ( (_canvas.width - ( 5 * this.NoteSkin.ShowWidth )) / 2 ) - this.NoteSkin.MarginNote;
	_leftMarginDouble = ( (_canvas.width - ( 10 * this.NoteSkin.ShowWidth ) - this.NoteSkin.DoubleGap*2) / 2) - this.NoteSkin.MarginNote;

	this.height = _canvas.height;
	this.width = _canvas.width;

	this.UpdateFlash = function(deltaTime)	{
		for(var i=0;i<10;i++)	{
			var fl = this.Flashes[i];
			if(fl.visible)	{
				fl.time -= deltaTime;
				if(fl.time < 0)	{
					fl.time = 0;
					fl.visible = false;
				}
			}
		}
	}
	this.DrawBG = function (isDouble) {
		if(this.NoteSkin.DynamicReceptor)	{
			_gctx.fillStyle = '#111111';
		   	_gctx.fillRect(0,0,_canvas.width,_canvas.height);
			_gctx.drawImage(this._backgroundimage,0,0);
			if(isDouble)	{
				_gctx.drawImage(this.NoteSkin.getReceptorImage("center"),   _leftMarginDouble+this.NoteSkin.ShowWidth*2,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("center"),   _leftMarginDouble+this.NoteSkin.ShowWidth*7+this.NoteSkin.DoubleGap,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("upleft"),   _leftMarginDouble+this.NoteSkin.ShowWidth*1,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("upright"),  _leftMarginDouble+this.NoteSkin.ShowWidth*3,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("downright"),_leftMarginDouble+this.NoteSkin.ShowWidth*4,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("downleft"), _leftMarginDouble+this.NoteSkin.ShowWidth*0,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("upleft"),   _leftMarginDouble+this.NoteSkin.ShowWidth*6+this.NoteSkin.DoubleGap,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("upright"),  _leftMarginDouble+this.NoteSkin.ShowWidth*8+this.NoteSkin.DoubleGap,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("downright"),_leftMarginDouble+this.NoteSkin.ShowWidth*9+this.NoteSkin.DoubleGap,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("downleft"), _leftMarginDouble+this.NoteSkin.ShowWidth*5+this.NoteSkin.DoubleGap,16);
			}else{
				_gctx.drawImage(this.NoteSkin.getReceptorImage("center"),   _leftMarginSingle+this.NoteSkin.ShowWidth*2,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("upleft"),   _leftMarginSingle+this.NoteSkin.ShowWidth*1,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("upright"),  _leftMarginSingle+this.NoteSkin.ShowWidth*3,16);	
				_gctx.drawImage(this.NoteSkin.getReceptorImage("downright"),_leftMarginSingle+this.NoteSkin.ShowWidth*4,16);
				_gctx.drawImage(this.NoteSkin.getReceptorImage("downleft"), _leftMarginSingle+this.NoteSkin.ShowWidth*0,16);
			}
		}else
			_gctx.drawImage(_background,0,0);
	};
	this.DrawNote = function ( note, isDouble, y , z ) {
		if(z>4)
			_notectx.drawImage(this.NoteSkin.getImage(note),((isDouble)?_leftMarginDouble:_leftMarginSingle)+z*this.NoteSkin.ShowWidth+this.NoteSkin.DoubleGap,y); 
		else
			_notectx.drawImage(this.NoteSkin.getImage(note),((isDouble)?_leftMarginDouble:_leftMarginSingle)+z*this.NoteSkin.ShowWidth,y); 
	};
	this.DrawNote2 = function ( note, isDouble, y , z , height ) {
		if(z>4)
			_gctx.drawImage(this.NoteSkin.getImage(note),0,0,this.NoteSkin.NoteWidth,this.NoteSkin.NoteHeight,((isDouble)?_leftMarginDouble:_leftMarginSingle)+z*this.NoteSkin.ShowWidth+this.NoteSkin.DoubleGap,y+this.NoteSkin.NoteHeight/2,this.NoteSkin.NoteWidth,height);
		else
			_gctx.drawImage(this.NoteSkin.getImage(note),0,0,this.NoteSkin.NoteWidth,this.NoteSkin.NoteHeight,((isDouble)?_leftMarginDouble:_leftMarginSingle)+z*this.NoteSkin.ShowWidth,y+this.NoteSkin.NoteHeight/2,this.NoteSkin.NoteWidth,height);
			
	};
	this.DrawFlash = function ( isDouble, z )	{
		if(z>4)
			_gctx.drawImage(this.NoteSkin.Flash,((isDouble)?_leftMarginDouble:_leftMarginSingle)+z*this.NoteSkin.ShowWidth+this.NoteSkin.DoubleGap-24,-10); 
		else
			_gctx.drawImage(this.NoteSkin.Flash,((isDouble)?_leftMarginDouble:_leftMarginSingle)+z*this.NoteSkin.ShowWidth-24,-10); 
	};
	this.DrawFlashes = function ( isDouble ) {
		var z = isDouble?10:5;
		for(var i=0;i<z;i++)	
			if(this.Flashes[i].visible)
				this.DrawFlash( isDouble, i )
	}
	this.DrawLongs = function ( longsToDraw , isDouble ) {
		for(var z=0;z<longsToDraw.length;z++)	{
			for(var n=0;n<longsToDraw[z].length;n++)	{
				starty = longsToDraw[z][n].starty;
				if(starty < 16)
					starty = 16;
				endy   = longsToDraw[z][n].endy==undefined?_canvas.height:longsToDraw[z][n].endy;
				drawCap =  (longsToDraw[z][n].endy!=undefined) && endy > 32;
				bodysize = (endy-starty-this.NoteSkin.NoteHeight/2)>0?endy-starty-this.NoteSkin.NoteHeight/2:0;
				y = starty;
				switch(z)	{
					case 0: case 5: 
						this.DrawNote2("downleftbody",isDouble,y,z,bodysize); 
						if(drawCap) 
							this.DrawNote("downleftcap",isDouble,endy,z);
						this.DrawNote("downleft",isDouble,y,z);
						if(starty==0) 
							this.DrawNote("downleft" ,isDouble,0,z);
					break;
					case 1: case 6: 
						this.DrawNote2("upleftbody",isDouble,y,z,bodysize);   
						if(drawCap) 
							this.DrawNote("upleftcap",isDouble,endy,z);
						this.DrawNote("upleft",isDouble,y,z); 
						if(starty==0) 
							this.DrawNote("upleft" ,isDouble,0,z);
						break;
					case 2: case 7: 
						this.DrawNote2("centerbody",isDouble,y,z,bodysize);   
						if(drawCap) 
							this.DrawNote("centercap",isDouble,endy,z);
						this.DrawNote("center",isDouble,y,z); 
						if(starty==0) 
							this.DrawNote("center" ,isDouble,0,z);
						break;
					case 3: case 8: 
						this.DrawNote2("uprightbody",isDouble,y,z,bodysize);  
						if(drawCap) 
							this.DrawNote("uprightcap",isDouble,endy,z);
						this.DrawNote("upright",isDouble,y,z);
						if(starty==0) 
							this.DrawNote("upright" ,isDouble,0,z);
						break;
					case 4: case 9: 
						this.DrawNote2("downrightbody",isDouble,y,z,bodysize);
						if(drawCap) 
							this.DrawNote("downrightcap",isDouble,endy,z);
						this.DrawNote("downright",isDouble,y,z);
						if(starty==0) 
							this.DrawNote("downright" ,isDouble,0,z);
						break;
				}
			}
		}
	};
	this.DrawLayers = function () {
		_gctx.drawImage(_NoteLayer,0,0);
	};

	this.CleanLayers = function () {
   		_notectx.clearRect(0, 0, _NoteLayer.width,_NoteLayer.height);
	};
	this.GenerateBG = function (isDouble)	{
		_background = document.createElement("canvas");
		_background.width = _canvas.width;
		_background.height = _canvas.height;
		cx = _background.getContext("2d");
		cx.fillStyle = '#111111';
	   	cx.fillRect(0,0,_canvas.width,_canvas.height);
		cx.drawImage(this._backgroundimage,0,0);
		
		//_background = PUMPER.ResizeImage(this._backgroundimage,820,480);
		if(isDouble)	{
			cx.drawImage(this.NoteSkin.getReceptorImage("center"),   _leftMarginDouble+this.NoteSkin.ShowWidth*2,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("center"),   _leftMarginDouble+this.NoteSkin.ShowWidth*7+this.NoteSkin.DoubleGap,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("upleft"),   _leftMarginDouble+this.NoteSkin.ShowWidth*1,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("upright"),  _leftMarginDouble+this.NoteSkin.ShowWidth*3,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("downright"),_leftMarginDouble+this.NoteSkin.ShowWidth*4,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("downleft"), _leftMarginDouble+this.NoteSkin.ShowWidth*0,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("upleft"),   _leftMarginDouble+this.NoteSkin.ShowWidth*6+this.NoteSkin.DoubleGap,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("upright"),  _leftMarginDouble+this.NoteSkin.ShowWidth*8+this.NoteSkin.DoubleGap,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("downright"),_leftMarginDouble+this.NoteSkin.ShowWidth*9+this.NoteSkin.DoubleGap,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("downleft"), _leftMarginDouble+this.NoteSkin.ShowWidth*5+this.NoteSkin.DoubleGap,0);
		}else{
			cx.drawImage(this.NoteSkin.getReceptorImage("center"),   _leftMarginSingle+this.NoteSkin.ShowWidth*2,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("upleft"),   _leftMarginSingle+this.NoteSkin.ShowWidth*1,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("upright"),  _leftMarginSingle+this.NoteSkin.ShowWidth*3,0);	
			cx.drawImage(this.NoteSkin.getReceptorImage("downright"),_leftMarginSingle+this.NoteSkin.ShowWidth*4,0);
			cx.drawImage(this.NoteSkin.getReceptorImage("downleft"), _leftMarginSingle+this.NoteSkin.ShowWidth*0,0);
		}
	};

};
PUMPER.Looper = PUMPER.Looper || function ( parameters ) { 

	if (parameters.drawer === undefined || parameters.UCS === undefined || parameters.musicPlayer === undefined)
		console.error("PUMPER.Looper some parameters are missing");

	_drawer = parameters.drawer !== undefined ? parameters.drawer  : { draw : function ( ) { console.error("PUMPER.Looper._drawer not defined."); } };
	_UCS =  parameters.UCS;
	_musicPlayer = parameters.musicPlayer;
	_statsCounter = parameters.stats !== undefined ? parameters.stats : { update : function () {} };
	_lastTime = Date.now();
	_gameBeat = 0;
	_currentTime = 0;
	_actualBlock = 0;

	_gameStarted = false;
	this.loaded = false;
	this.ready = false;
	
	this.DebugData = { "beatlooptime" : 0, "rendertime" : 0 };

	_LoadingBG = new Image();
	_LoadingBG.src = "img/loading.jpg";
	_NoSongBG = new Image();
	_NoSongBG.src = "img/nosong.jpg";

	this.getBeat = function()	{
		return _gameBeat;
	};
	this.GetDebugData = function ()	{
		return this.DebugData;
	}
	this.lightup = function(z, long, keep)	{
		if(long)	{
			_drawer.Flashes[z].visible = keep;
			if (keep)
				_drawer.Flashes[z].time = 1000000;
			else
				_drawer.Flashes[z].time = 0;
		}else	if(_drawer.Flashes[z].visible == false && !keep)	{
			_drawer.Flashes[z].visible	= true;
			_drawer.Flashes[z].time = 0.1;
		}else{
			_drawer.Flashes[z].visible	= true;
			_drawer.Flashes[z].time = 0.1;
		}
	};
	this.loop = function()	{
		timeDelta = Date.now() - _lastTime;
		_lastTime = Date.now();
		_StartRenderTime = performance.now();
		this.loaded = _drawer.loaded && _drawer.NoteSkin.loaded;
		if(_UCS === undefined)	{
			_gctx.drawImage(_NoSongBG,0,0);
		}else{
			if(!_gameStarted && this.loaded)	{
				_gameStarted = true;
				this.ready = true;
				_drawer.GenerateBG(_UCS.isDouble);
				_gctx.drawImage(_LoadingBG,0,0);
			}
			if(_gameStarted)	{
				_drawer.DrawBG(_UCS.isDouble);
				_drawer.CleanLayers();
				var musicDelta = _musicPlayer.currentTime - _currentTime;
				_currentTime = _musicPlayer.currentTime;
				_gameBeat += this.getMusicBeat(musicDelta);
				_drawer.NoteSkin.update(musicDelta,_UCS.blocks[_actualBlock].BPS * _UCS.blocks[_actualBlock].Beat);
				_drawer.UpdateFlash(musicDelta);
				if(_musicPlayer.currentTime > _UCS.blocks[_actualBlock].EndTime-0.001)    {
					_actualBlock++;
					console.log("PUMPER.Looper :: "+_gameBeat+" - ("+_UCS.blocks[_actualBlock-1].LastBeat+") Changing to block "+_actualBlock+"\n- BPM: "+_UCS.blocks[_actualBlock].BPM+"\n- Beat: "+_UCS.blocks[_actualBlock].Beat+"\n- Split: "+_UCS.blocks[_actualBlock].Split +"\n- Time: "+_musicPlayer.currentTime + "\n- BlockStart Time: "+_UCS.blocks[_actualBlock].StartTime);
				}
				var numNotes = (_UCS.isDouble)?10:5;
				var longsToDraw = (_UCS.isDouble)?[ [], [], [], [], [], [], [], [], [], [] ]:[ [], [], [], [], [] ];
				for(var blkn=0;blkn<_UCS.blocks.length;blkn++)	{
					var block = _UCS.blocks[blkn];
					for(var n=0;n<block.Notes.length;n++)	{
						var note = block.Notes[n];
						var beatUntilNote = note.beat - _gameBeat;
						var y = 0 + beatUntilNote * _drawer.NoteSkin.arrowSize * PUMPER.ScrollSpeed;
						if( y >= 4 && y <= _drawer.height)	{
							for(var z=0;z<numNotes;z++)	{
								switch(note.pos[z])	{
									case 1:	//	Normal Note
										if(y < 32)
											this.lightup(z, false, false);
										switch(z)	{
											case 0: case 5:	_drawer.DrawNote("downleft" ,_UCS.isDouble,y,z); break;
											case 1: case 6:	_drawer.DrawNote("upleft"   ,_UCS.isDouble,y,z); break;
											case 2: case 7:	_drawer.DrawNote("center"   ,_UCS.isDouble,y,z); break;
											case 3: case 8:	_drawer.DrawNote("upright"  ,_UCS.isDouble,y,z); break;
											case 4: case 9:	_drawer.DrawNote("downright",_UCS.isDouble,y,z); break;
										}
										break;
									case 2: // Long Start
										if(y < 32)
											this.lightup(z,true,true);
										longsToDraw[z].push({"starty":y});					
									break;
									case 3:	// Long Body
										if(y < 32)
											this.lightup(z,true,true);
										if(longsToDraw[z][longsToDraw[z].length-1] == undefined)
											longsToDraw[z].push({ "starty" : -_drawer.NoteSkin.arrowSize  });								
									break;
									case 4: // Long End
										if(y < 32)
											this.lightup(z, false, true);
										if(longsToDraw[z][longsToDraw[z].length-1] != undefined)
											longsToDraw[z][longsToDraw[z].length-1]["endy"] = y;	
										else
											longsToDraw[z].push({ "starty" : -_drawer.NoteSkin.arrowSize, "endy" : y });								
									break;
								}
							}
						}else if(y > 640)	{
							break;
							break;
						}
					}
				}
				_drawer.DrawLongs(longsToDraw, _UCS.isDouble);
				_drawer.DrawLayers();
				_drawer.DrawFlashes(_UCS.isDouble);
			}
		}
		_EndRenderTime =  performance.now();
		this.DebugData.rendertime = _EndRenderTime - _StartRenderTime;
		_statsCounter.update();
	};
	this.getMusicBeat = function (musicSec) {
		return (musicSec * _UCS.blocks[_actualBlock].BPM) / 60;
	}
	this.reset = function()	{
		_lastTime = Date.now();
		_gameBeat = 0;
		_currentTime = 0;
		_actualBlock = 0;
		_gameStarted = false;
	}
};

PUMPER.Game = PUMPER.Game || function ( parameters ) {
	_canvas = parameters.canvas;
	_musicPlayer = new Audio();
	_canPlayMP3 = (typeof _musicPlayer.canPlayType === "function" && _musicPlayer.canPlayType("audio/mpeg") !== "");
	_stats = parameters.stats;
	_this = this;
	_isPlaying = false;
	this.DebugData = { "beatlooptime" : 0, "rendertime" : 0 };

	_musicPlayer.src = parameters.music;
	console.log("PUMPER.Game :: Browser can play mp3: "+_canPlayMP3);
	console.log(_musicPlayer.src);
	this.NoteSkin = parameters.noteskin !== undefined ? parameters.noteskin : new PUMPER.NoteSkin();
	this.Drawer = new PUMPER.Drawer({ canvas: _canvas, noteskin: this.NoteSkin, backgroundimage : parameters.backgroundimage});

	this.Looper = { loop : function() {}, GetDebugData : function() {return { "beatlooptime" : 0, "rendertime" : rendertime };} };
	this.play	= function()	{
		if(_this.Looper.ready)	{
			_isPlaying = true;
			_musicPlayer.play();
			console.log("PUMPER.Game :: Start playing");
		}
	};
	this.pause = function()	{
		if(_this.Looper.ready)	{
			_isPlaying = false;
			_musicPlayer.pause();
			console.log("PUMPER.Game :: Paused at beat: "+_this.Looper.getBeat());
		}
	};
	
	_UCS = parameters.UCSData;
	_this.Looper = new PUMPER.Looper({ musicPlayer : _musicPlayer, drawer : _this.Drawer, UCS : _UCS, stats : _stats });
};
