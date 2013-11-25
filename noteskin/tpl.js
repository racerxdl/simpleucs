/* Empty NoteSkin template */ 
PUMPER.NoteSkin = PUMPER.NoteSkin || function ( parameters ) {
	console.error("PUMPER.NoteSkin :: Not Loaded");

	// To Implement
	this.FilesToLoad = 0;		//	Number of files to load
	this.arrowSize = 0;			//	Arrow Size
	this.ShowWidth = 0;			//	The show width
	this.NoteWidth = 0;			//	Note Width
	this.NoteHeight = 0;		//	Note Height

	_numFrames = 1;			//	Number of note frames
	_numReceptorFrames = 1;		//	Number of receptor frames
	_NoteFrameTime	= 1;			//	1 Frame Per Sec
							//	Receptor Time will be BPS
	_NoteFrame = 0;		
	_ReceptorFrame = 0;

	this.load = function() { 	//	Function to load the files
		console.error("PUMPER.NoteSkin.load :: Nothing to load");
	};
	
	this.update = function(timeDelta, BPS) {
		_NoteFrame = (( _NoteFrame + _NoteFrameTime * (timeDelta / 1000) ) % _numFrames )^0;
		_ReceptorFrame = ( ( _ReceptorFrame + BPS * (timeDelta / 1000) ) % _numReceptorFrames)^0;
	};

	this.getImage = function(note)	{
		return this.StepImages[note][_NoteFrame];
	};
	this.getReceptorImage = function(note)	{
		return this.ReceptorImages[note][_ReceptorFrame];
	};
	//NoteSkin Structure
	this.loaded = false;
	this.FilesLoaded = 0;
	this.StepImages = { "downleft"     : [new Image()], "upleft"     : [new Image()], "center"     : [new Image()], "upright"     : [new Image()], "downright"     : [new Image()],
					"downleftbody" : [new Image()], "upleftbody" : [new Image()], "centerbody" : [new Image()], "uprightbody" : [new Image()], "downrightbody" : [new Image()],
					"downleftcap"  : [new Image()], "upleftcap"  : [new Image()], "centercap"  : [new Image()], "uprightcap"  : [new Image()], "downrightcap"  : [new Image()]
				   };
	this.ReceptorImages = { "downleft" : [new Image()], "upleft"     : [new Image()], "center"     : [new Image()], "upright"     : [new Image()], "downright"     : [new Image()] };
};
