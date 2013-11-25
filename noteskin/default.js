PUMPER.NoteSkin = PUMPER.NoteSkin || function ( parameters ) {
	console.log("PUMPER.NoteSkin :: Default");
	console.log("PUMPER.NoteSkin :: By: Lucas Teske");
	console.log("PUMPER.NoteSkin :: Images from cmd noteskin of Stepmania 5");
	//NoteSkin Structure
	this.loaded = false;
	this.FilesLoaded = 0;
	this.StepImages = { "downleft"     : [new Image()], "upleft"     : [new Image()], "center"     : [new Image()], "upright"     : [new Image()], "downright"     : [new Image()],
						"downleftbody" : [new Image()], "upleftbody" : [new Image()], "centerbody" : [new Image()], "uprightbody" : [new Image()], "downrightbody" : [new Image()],
						"downleftcap"  : [new Image()], "upleftcap"  : [new Image()], "centercap"  : [new Image()], "uprightcap"  : [new Image()], "downrightcap"  : [new Image()]
				   };
	this.ReceptorImages = { "downleft" : [new Image()], "upleft"     : [new Image()], "center"     : [new Image()], "upright"     : [new Image()], "downright"     : [new Image()] };
	this.Flash = new Image();
	this.Flash.onload = function()	{
			this.FilesLoaded += 1;
			this.loaded = this.FilesLoaded == this.FilesToLoad;
	}
	this.Flash.src = 'noteskin/defaultimg/flash.png';
	
	// To Implement
	this.FilesToLoad = 11;			//	Number of files to load
	this.arrowSize = 80;			//	Arrow Size
	this.ShowWidth = 58;			//	The show width
	this.DoubleGap = 10;			//	Double Gap
	this.NoteWidth = 80;			//	Note Width
	this.NoteHeight = 80;			//	Note Height
	this.MarginNote = 15;			//	Note Margin to subtract from global margins
	

	_numFrames = 6;					//	Number of note frames
	_numReceptorFrames = 2;			//	Number of receptor frames
	_NoteFrameTime	= 12;			//	12 Frame Per Sec
									//	Receptor Time will be BPS
	this.DynamicReceptor = true;	//	If we need to redraw the receiver
	_NoteFrame = 0;		
	_ReceptorFrame = 0;

	_noteskin = this;

	for(var n in _noteskin.StepImages)	{
		_noteskin.StepImages[n] = [];
		for(var i=0;i<_numFrames;i++)	{
			_noteskin.StepImages[n].push("");
		}
	}
	for(var n in _noteskin.ReceptorImages)	{
		_noteskin.ReceptorImages[n] = [];
		for(var i=0;i<_numReceptorFrames;i++)	{
			_noteskin.ReceptorImages[n].push("");
		}
	}

	this.load = function() { 	//	Function to load the files

		var setaReceptor = new Image();
		setaReceptor.onload = function() {
			for(var i=0;i<_numReceptorFrames;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.drawImage(setaReceptor, 0, 128*i, 128, 128, -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.ReceptorImages.downleft[i] = PUMPER.cloneCanvas(cnv);

				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.rotate(Math.PI/180 * 90);
				cx.drawImage(setaReceptor, 0, 128*i, 128, 128, -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.ReceptorImages.upleft[i] = PUMPER.cloneCanvas(cnv);

				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.rotate(Math.PI);
				cx.drawImage(setaReceptor, 0, 128*i, 128, 128, -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.ReceptorImages.upright[i] = PUMPER.cloneCanvas(cnv);
		
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.rotate(Math.PI/180 * 270);
				cx.drawImage(setaReceptor, 0, 128*i, 128, 128, -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.ReceptorImages.downright[i] = PUMPER.cloneCanvas(cnv);
			}
			_noteskin.FilesLoaded += 1;
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var centroReceptor = new Image();
		centroReceptor.onload = function() {
			for(var i=0;i<_numReceptorFrames;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(centroReceptor, 0, 128*i, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.ReceptorImages.center[i] = PUMPER.cloneCanvas(cnv);
			}
			_noteskin.FilesLoaded += 1;
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var CenterStep = new Image();
		CenterStep.onload = function() {
			for(var y=0;y<2;y++)	{
				for(var x=0;x<3;x++)	{
					var cnv = document.createElement("canvas");
					cnv.width = _noteskin.NoteWidth;
					cnv.height = _noteskin.NoteHeight;
					cx = cnv.getContext("2d");
					cx.drawImage(CenterStep, 128*x, 128*y, 128, 128, 0, 0,  _noteskin.NoteWidth, _noteskin.NoteHeight);
					_noteskin.StepImages.center[y*3+x] = PUMPER.cloneCanvas(cnv);
				}
			}
			_noteskin.FilesLoaded += 1;
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var UpStep = new Image();
		UpStep.onload = function() {
			for(var y=0;y<2;y++)	{
				for(var x=0;x<3;x++)	{
					var cnv = document.createElement("canvas");
					cnv.width = _noteskin.NoteWidth;
					cnv.height = _noteskin.NoteHeight;
					cx = cnv.getContext("2d");
					cx.drawImage(UpStep, 128*x, 128*y, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
					_noteskin.StepImages.upleft[y*3+x] = PUMPER.cloneCanvas(cnv);
					var cnv = document.createElement("canvas");
					cx = cnv.getContext("2d");
					cnv.width = _noteskin.NoteWidth;
					cnv.height = _noteskin.NoteHeight;
					cx.translate(cnv.width/2,cnv.height/2);
					cx.rotate(Math.PI/180 * 90);
					cx.drawImage(UpStep, 128*x, 128*y, 128, 128,  -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
					_noteskin.StepImages.upright[y*3+x] = PUMPER.cloneCanvas(cnv);
				}
			}
			_noteskin.FilesLoaded += 1;
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var DownStep = new Image();
		DownStep.onload = function() {
			for(var y=0;y<2;y++)	{
				for(var x=0;x<3;x++)	{
					var cnv = document.createElement("canvas");
					cnv.width = _noteskin.NoteWidth;
					cnv.height = _noteskin.NoteHeight;
					cx = cnv.getContext("2d");
					cx.drawImage(DownStep, 128*x, 128*y, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
					_noteskin.StepImages.downleft[y*3+x] = PUMPER.cloneCanvas(cnv);
					var cnv = document.createElement("canvas");
					cx = cnv.getContext("2d");
					cnv.width = _noteskin.NoteWidth;
					cnv.height = _noteskin.NoteHeight;
					cx.translate(cnv.width/2,cnv.height/2);
					cx.rotate(Math.PI/180 * 270);
					cx.drawImage(DownStep, 128*x, 128*y, 128, 128,  -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
					_noteskin.StepImages.downright[y*3+x] = PUMPER.cloneCanvas(cnv);
				}
			}
			_noteskin.FilesLoaded += 1;
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var UpLongBody = new Image();
		UpLongBody.onload = function()	{
			for(var i=0;i<6;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(UpLongBody,  128*i, 0, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.upleftbody[i] = PUMPER.cloneCanvas(cnv);
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.rotate(Math.PI);
				cx.drawImage(UpLongBody, 128*i, 0, 128, 128,  -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.uprightbody[i] = PUMPER.cloneCanvas(cnv);	
			}
			_noteskin.FilesLoaded += 1;	
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var DownLongBody = new Image();
		DownLongBody.onload = function()	{
			for(var i=0;i<6;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(DownLongBody,  128*i, 0, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.downleftbody[i] = PUMPER.cloneCanvas(cnv);
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.rotate(Math.PI);
				cx.drawImage(DownLongBody,  128*i, 0, 128, 128,  -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.downrightbody[i] = PUMPER.cloneCanvas(cnv);	
			}
			_noteskin.FilesLoaded += 1;	
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var CenterLongBody = new Image();
		CenterLongBody.onload = function()	{
			for(var i=0;i<6;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(CenterLongBody, 128*i, 0, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.centerbody[i] = PUMPER.cloneCanvas(cnv);	
			}
			_noteskin.FilesLoaded += 1;	
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};

		var UpLongCap = new Image();
		UpLongCap.onload = function()	{
			for(var i=0;i<6;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(UpLongCap,  128*i, 0, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.upleftcap[i] = PUMPER.cloneCanvas(cnv);
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.scale(-1,1);
				cx.drawImage(UpLongCap, 128*i, 0, 128, 128,  -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.uprightcap[i] = PUMPER.cloneCanvas(cnv);	
			}
			_noteskin.FilesLoaded += 1;	
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var DownLongCap = new Image();
		DownLongCap.onload = function()	{
			for(var i=0;i<6;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(DownLongCap,  128*i, 0, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.downleftcap[i] = PUMPER.cloneCanvas(cnv);
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.translate(cnv.width/2,cnv.height/2);
				cx.scale(-1,1);
				cx.drawImage(DownLongCap,  128*i, 0, 128, 128, -cnv.width/2, -cnv.height/2, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.downrightcap[i] = PUMPER.cloneCanvas(cnv);	
			}
			_noteskin.FilesLoaded += 1;	
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		var CenterLongCap = new Image();
		CenterLongCap.onload = function()	{
			for(var i=0;i<6;i++)	{
				var cnv = document.createElement("canvas");
				cx = cnv.getContext("2d");
				cnv.width = _noteskin.NoteWidth;
				cnv.height = _noteskin.NoteHeight;
				cx.drawImage(CenterLongCap,  128*i, 0, 128, 128, 0, 0, _noteskin.NoteWidth, _noteskin.NoteHeight);
				_noteskin.StepImages.centercap[i] = PUMPER.cloneCanvas(cnv);	
			}
			_noteskin.FilesLoaded += 1;	
			_noteskin.loaded = _noteskin.FilesLoaded == _noteskin.FilesToLoad;
		};
		setaReceptor.src = 'noteskin/defaultimg/downreceptor.png';
		centroReceptor.src = 'noteskin/defaultimg/centerreceptor.png';
		CenterStep.src = 'noteskin/defaultimg/centernote.png';
		UpStep.src = 'noteskin/defaultimg/upnote.png';
		DownStep.src = 'noteskin/defaultimg/downnote.png';
		UpLongBody.src = 'noteskin/defaultimg/uphold.png';
		DownLongBody.src = 'noteskin/defaultimg/downhold.png';
		CenterLongBody.src = 'noteskin/defaultimg/centerhold.png';
		DownLongCap.src = 'noteskin/defaultimg/downcap.png';
		UpLongCap.src = 'noteskin/defaultimg/upcap.png';
		CenterLongCap.src = 'noteskin/defaultimg/centercap.png';
	};
	
	this.update = function(timeDelta, BPS) {
		_NoteFrame = (( _NoteFrame + _NoteFrameTime * (timeDelta) ) % _numFrames ) ;
		_ReceptorFrame = ( ( _ReceptorFrame + BPS * (timeDelta) ) % _numReceptorFrames) ;

	};

	this.getImage = function(note)	{
		return this.StepImages[note][_NoteFrame|0];
	};
	this.getReceptorImage = function(note)	{
		return this.ReceptorImages[note][_ReceptorFrame|0];
	};
	this.load();
};

