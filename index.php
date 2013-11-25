<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<title>Pump Visualizer</title>
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<style>
			body {
				background:#000000;
				padding:0;
				margin:0;
				font-weight: bold;
				overflow:hidden;
				color: white;
				text-align: center;
			}
			#gamePoint {
			    width: 100%;
			    height: 100%;
			    background-image: url(img/pumpback.jpg);
			    background-position: center -350px;
			    background-repeat:no-repeat;
			};
	</style>
	<script src="js/jquery-1.10.1.min.js"></script>
	<script src="js/jquery-migrate-1.2.1.min.js"></script>
	<script src="js/stats.js"></script>
	<script src="js/pumpucs.js"></script>
	<script src="js/loader.js"></script>
	<script src="noteskin/default.js"></script>
	<script src="js/ucsman.js"></script>
	<script>
		var PumpGameLoader, PumpGame, GameStats, GameParameters;
		var requestAnimFrameA = (function(){
		  return  function( callback ){
				    window.setTimeout(callback, 1000 / 240);
				  };
		})();
		window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                  };
        })();
		window.performance = window.performance || {};
		performance.now = (function() {
		  return performance.now       ||
				 performance.mozNow    ||
				 performance.msNow     ||
				 performance.oNow      ||
				 performance.webkitNow ||
				 function() { return new Date().getTime(); };
		})();

	</script>
</head>
<body>
<div id="gamePoint">

</div>
</body>
</html>
