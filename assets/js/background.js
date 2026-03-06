(function(){
  var canvas = document.getElementById("stars");
  if (!canvas) return;

  var ctx = canvas.getContext("2d");
  var mouse = { x: 0, y: 0 };
  var gridSpacing = 32;
  var motion = 0.015;

  function resize(){
    canvas.width = window.innerWidth * (window.devicePixelRatio || 1);
    canvas.height = window.innerHeight * (window.devicePixelRatio || 1);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
  }

  function render(){
    var w = canvas.width, h = canvas.height;
    var mx = (mouse.x / (window.innerWidth || w)) * w;
    var my = (mouse.y / (window.innerHeight || h)) * h;
    var offsetX = (w / 2 - mx) * motion;
    var offsetY = (h / 2 - my) * motion;

    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = "rgba(184, 169, 154, 0.12)";
    ctx.lineWidth = 1;

    var startX = (offsetX % gridSpacing) - gridSpacing;
    var startY = (offsetY % gridSpacing) - gridSpacing;

    for (var x = startX; x < w + gridSpacing; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (var y = startY; y < h + gridSpacing; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    requestAnimationFrame(render);
  }

  document.body.addEventListener("mousemove", function(e){
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  mouse.x = (window.innerWidth || 800) / 2;
  mouse.y = (window.innerHeight || 600) / 2;
  resize();
  window.addEventListener("resize", resize);
  render();
})();
