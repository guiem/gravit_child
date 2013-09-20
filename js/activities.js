// By Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Last update December 2011
//
// Free to use and distribute at will
// So long as you are nice to people, etc

var ACT_WIDTH = 10;
var ACT_HEIGHT = 20;
var SCREEN_OFFSET = 0;
var PADDING_LEFT = 50; // G.Bosch: in order to see starting month and year for the first activity
var MORE_INFO_MSG = "Click on any activity to display more information.";
var NO_EXTRA_MSG = "No extra information available for this activity.";
var TITLE_SIZE = 12;
var EDGE_LABEL_SIZE = 12;
var MONTH_B = 4.25;
var MONTH_W = 4.25;
var ZOOM = 1;
var MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sept','oct','nov','dec'];
var canvasState; // TODO: I don't like the idea of having a global canvasState, but right now I'm using it to 
var catStudies = null;
var POINT_RADIUS = 3.5;
var ZERO_MONTH = 8;
var ZERO_YEAR = 2002;

// G.Bosch: new class Category
function Category(name, color, visible){
	this.name = name;
	this.color = color;
	this.visible = visible || true;
}

// G.Bosch: Constructor for Activity objects to hold data for all drawn objects.
// For now they will just be defined as rectangles.
function Activity(point, y, h, category, title, more, sMonth, sYear, eMonth, eYear, shortT) {
  	// This is a very simple and unsafe constructor. All we're doing is checking if the values exist.
  	// "x || 0" just means "if there is a value for x, use that. Otherwise use 0."
  	// But we aren't checking anything else! We could put "Lalala" for the value of x 
 	this.point = point || false;
 	this.x0 = 0; // G.Bosch: this is the position that remains unchanged, this way I can scroll all over the canvas and remember my first position
 	this.y = y || 0;
 	this.h = h || 1;
 	//this.fill = fill || '#AAAAAA';
 	this.title = title || null;
 	this.shortT = shortT || null;
 	this.category = category || null;
	this.more = more || NO_EXTRA_MSG;
	this.sMonth = sMonth;
	this.sYear = sYear;
	if(eMonth == 0 && eYear == 0){ // G.Bosch: this is the code to say that the activity still goes on
		var d = new Date();
		this.eMonth = d.getMonth();
		this.eYear = d.getFullYear();
	}
	else{
		this.eMonth = eMonth;
		this.eYear = eYear;
	}
	this.category = category;
	// G.Bosch: I'm overriding the width here
	var months = getMonths(this.sMonth,this.sYear,this.eMonth,this.eYear);
	this.m = months;
	this.posIni = getMonths(ZERO_MONTH,ZERO_YEAR,this.sMonth,this.sYear);
}

// Draws this activity to a given context
Activity.prototype.draw = function(ctx) {
	ctx.beginPath();
	if(this.point){
		var radius = POINT_RADIUS;
		/*if(canvasState.pointify){
			radius = radius * 2;
		}*/
		ctx.fillStyle = this.category.color;
		ctx.arc(this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET,this.y,radius,2*Math.PI,false);
		ctx.fill();
	}
	else{
		ctx.fillStyle = this.category.color;
	  	this.x = this.x0 - SCREEN_OFFSET;
	  	ctx.fillRect(this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET, this.y, this.m * MONTH_W, this.h);
	  		
		// G.Bosch: drawing activity title
		var title_size = TITLE_SIZE;
		ctx.lineWidth = 3;
		ctx.font = title_size+"px Calibri";
		ctx.fillStyle = "#000000"; // text color
		var t_width = ctx.measureText(this.title).width;
		var act_title = 'NA';
		if(t_width < this.m*MONTH_W) act_title = this.title; // G.Bosch: we can draw the title inside the activity
		else {
			act_title = this.shortT;
			t_width = ctx.measureText(act_title).width;
		}
		ctx.fillText(act_title, this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET+this.m*MONTH_W/2-t_width/2, this.y+this.h/2+title_size/3);
	}
}

// Determine if a point is inside the activity's bounds
Activity.prototype.contains = function(mx, my) {
  // All we have to do is make sure the Mouse X,Y fall in the area between
  // the activity's X and (X + Height) and its Y and (Y + Height)
  return  (this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET <= mx) && (this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET + this.m*MONTH_W >= mx) &&
          (this.y <= my) && (this.y + this.h >= my);
}

// G.Bosch: Determine if a point is inside the point bounds
Activity.prototype.containsPoint = function(mx, my) {
  return  (this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET - POINT_RADIUS <= mx) && (this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET + POINT_RADIUS >= mx) &&
          (this.y - POINT_RADIUS <= my) && (this.y + POINT_RADIUS >= my);
}

function CanvasState(canvas) {
  // **** First some setup! ****
  
  this.canvas = canvas;
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');
  // This complicates things a little but but fixes mouse co-ordinate problems
  // when there's a border or padding. See getMouse for more detail
  var stylePaddingLeft, stylePaddingTop, styleBorderLeft, styleBorderTop;
  if (document.defaultView && document.defaultView.getComputedStyle) {
    this.stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
    this.stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
    this.styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
    this.styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
  }
  // Some pages have fixed-position bars (like the stumbleupon bar) at the top or left of the page
  // They will mess up mouse coordinates and this fixes that
  var html = document.body.parentNode;
  this.htmlTop = html.offsetTop;
  this.htmlLeft = html.offsetLeft;

  // **** Keep track of state! ****
  
  this.valid = false; // when set to false, the canvas will redraw everything
  this.activities = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  // the current selected object. In the future we could turn this into an array for multiple selection
  this.selection = null;
  this.dragoffx = 0; // See mousedown and mousemove events for explanation
  this.dragoffy = 0;
  
  //this.pointify = false;
  
  // **** Then events! ****
  
  // This is an example of a closure!
  // Right here "this" means the CanvasState. But we are making events on the Canvas itself,
  // and when the events are fired on the canvas the variable "this" is going to mean the canvas!
  // Since we still want to use this particular CanvasState in the events we have to save a reference to it.
  // This is our reference!
  var myState = this;
  
  //fixes a problem where double clicking causes text to get selected on the canvas
  canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
  // Up, down, and move are for dragging
canvas.addEventListener('mousedown', function(e) {
    var mouse = myState.getMouse(e);
    var mx = mouse.x;
    var my = mouse.y;
    var activities = myState.activities;
    var l = activities.length;
    for (var i = l-1; i >= 0; i--) {
      contains = false;
      if(activities[i].point){
      	contains = activities[i].containsPoint(mx, my);
      }
      else {
      	contains = activities[i].contains(mx, my);
      }
      if (contains) {
        var mySel = activities[i];
      	document.getElementById("information").update(mySel.more);
      	
        // Keep track of where in the object we clicked
        // so we can move it smoothly (see mousemove)
        myState.dragoffx = mx - mySel.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET;
        myState.dragoffy = my - mySel.y;
        myState.dragging = true;
        myState.selection = mySel;
        myState.valid = false;
        return;
      }
      else document.getElementById("information").update("<i>"+MORE_INFO_MSG+"</i>");
    }
    // havent returned means we have failed to select anything.
    // If there was an object selected, we deselect it
    if (myState.selection) {
      myState.selection = null;
      myState.valid = false; // Need to clear the old selection border
    }
  }, true);
  
  canvas.addEventListener('mousemove', function(e) {
    var mouse = myState.getMouse(e);
    if (myState.dragging){
      /*
      // We don't want to drag the object by its top-left corner, we want to drag it
      // from where we clicked. Thats why we saved the offset and use it here
      myState.selection.x = mouse.x - myState.dragoffx;
      myState.selection.y = mouse.y - myState.dragoffy;   
      myState.valid = false; // Something's dragging so we must redraw
      e.target.style.cursor = 'move';
      */
    }
    else { // G.Bosch: I don't know if that will have side effects on efficiency, right now I'll try it this way
    	var mx = mouse.x;
    	var my = mouse.y;
    	var activities = myState.activities;
    	var l = activities.length;
    	for (var i = l-1; i >= 0; i--) {
      		contains = false;
      		if(activities[i].point){
      			contains = activities[i].containsPoint(mx, my);
      			//if(contains) canvasState.pointify = true;
      			//else canvasState.pointify = false;
      			//myState.valid = false;
      		}
      		else {
      			contains = activities[i].contains(mx, my);
      		}
      		if (contains) {
        		e.target.style.cursor = 'pointer';
        		return;
        	}
        	else e.target.style.cursor = 'auto';
        }	
    }
  }, true);
  
  canvas.addEventListener('mouseup', function(e) {
    myState.dragging = false;
  }, true);
  // double click for making new activities
  canvas.addEventListener('dblclick', function(e) {
    var mouse = myState.getMouse(e);
    //myState.addActivity(new Activity(mouse.x - 10, mouse.y - 10, 20, 20, 'rgba(0,255,0,.6)'));
  }, true);
  
  
  // **** Options! ****
  
  this.selectionColor = '#000';
  this.selectionWidth = 0.7;  
  this.interval = 30;
  setInterval(function() { myState.draw(); }, myState.interval);
}

CanvasState.prototype.addActivity = function(activity) {
  this.activities.push(activity);
  this.valid = false;
}

CanvasState.prototype.clear = function() {
  this.ctx.clearRect(0, 0, this.width, this.height);
}

// While draw is called as often as the INTERVAL variable demands,
// It only ever does something if the canvas gets invalidated by our code
CanvasState.prototype.draw = function() {
  // if our state is invalid, redraw and validate!
  if (!this.valid) {
    var ctx = this.ctx;
    var activities = this.activities;
    this.clear();
    
    // ** Add stuff you want drawn in the background all the time here **
    
    // draw all activities
    var l = activities.length;
    for (var i = 0; i < l; i++) {
      var activity = activities[i];
      // We can skip the drawing of elements that have moved off the screen:
      // TODO: check this one
      if (this.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET > this.width || activity.y > this.height ||
          activity.x0 + activity.m*MONTH_W < 0 || activity.y + activity.h < 0) continue;
			activities[i].draw(ctx);
    }
    
    // draw selection
    // right now this is just a stroke along the edge of the selected Activity
    	if (this.selection != null) {
      		var mySel = this.selection;
      		//ctx.strokeRect(mySel.x,mySel.y,mySel.w,mySel.h);
      		
     		if(!this.selection.point){// G.Bosch: drawing start and end dates
	     		ctx.fillStyle = '#000000'; // text color
				ctx.font = EDGE_LABEL_SIZE+"px Calibri";
				ctx.lineWidth = 1;
				var text = MONTHS[mySel.sMonth]+"-"+mySel.sYear;
				var t_width = ctx.measureText(text).width;
				ctx.fillText(text, mySel.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET-t_width-1, mySel.y+mySel.h/2+EDGE_LABEL_SIZE/3);
				text = MONTHS[mySel.eMonth]+"-"+mySel.eYear;
				ctx.fillText(text, 2+mySel.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET+mySel.m*MONTH_W, mySel.y+mySel.h/2+EDGE_LABEL_SIZE/3);	
			}
			else{
				ctx.strokeStyle = this.selectionColor;
      			ctx.lineWidth = this.selectionWidth;
      			ctx.strokeRect(mySel.posIni*MONTH_W+PADDING_LEFT-SCREEN_OFFSET - POINT_RADIUS,mySel.y - POINT_RADIUS,2*POINT_RADIUS,2*POINT_RADIUS);
      			//ctx.stroke();
				//ctx.strokeArc(mySel.x,mySel.y,radius);
			}		
    	}
    
    // ** Add stuff you want drawn on top all the time here **
    
    this.valid = true;
  }
}


// Creates an object with x and y defined, set to the mouse position relative to the state's canvas
// If you wanna be super-correct this can be tricky, we have to worry about padding and borders
CanvasState.prototype.getMouse = function(e) {
  var element = this.canvas, offsetX = 0, offsetY = 0, mx, my;
  
  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;

  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;
  
  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
}

function getMonths(sMonth, sYear, eMonth, eYear){
	return (eYear - sYear)*12 - sMonth + eMonth + 1; // G.Bosch: the last +1 is including the last month as full
}

function changeScreenOffset() {
    var screen_offset = document.getElementById('screen-slider').value;
  	SCREEN_OFFSET = screen_offset * MONTH_W;
	canvasState.valid = false;
}

function changeZoom() {
    var zoom = document.getElementById('zoom-slider').value;
  	MONTH_W = MONTH_B * (1+zoom/2);
	canvasState.valid = false;
}

function changeStudiesSelection() {
    var checked = document.getElementById('studies').checked;
    catStudies.visible = checked;
}

// If you dont want to use <body onLoad='init()'>
// You could uncomment this init() reference and place the script reference inside the body tag
//init();

function init() {
	
	if(document.getElementById('screen-slider').type === 'range'){
		document.getElementById('screen-slider').style.display="inline";
	}
	if(document.getElementById('zoom-slider').type === 'range'){
		document.getElementById('zoom-slider').style.display="inline";
	}

	
	var canvas = document.getElementById('canvas1');
	var s = new CanvasState(canvas);
	var catStudies = new Category('studies','#66CCCC'); 
	var catResearch = new Category('research','#CCCCFF');  	
	var catFreelancer = new Category('freelancer','#FFCCFF'); 
	var catYoga = new Category('yoga','#FF99CC'); 
	var catHobbies = new Category('hobbies','#999966'); 
	var catAltruistic = new Category('altruistic','#66FF00');  	 	 	 	 	 	 	 	 	 	 	 	
 	 	 	 	 	 	 	 	 	 	 	 	
	//catStudies = cat;
	var act_height = canvas.height - 60;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catStudies,'Computer Science Degree','Studies. 2002 - 2007.<br/>Degree in Computer Science, "Ingeniería Informática Superior", by Facultad de Informática de Barcelona (<a href="http://fib.upc.edu">FIB - UPC</a>).',8,2002,5,2007,'CS')); // The default is gray
  	act_height-=22;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catYoga,'Yoga','Yoga. It all started long time ago.<br/>Started to practice yoga at the age of 14. Obtained the teaching license on Kundalini Yoga under master Hargobind Singh Khalsa supervision. Title accreditation by AEKY.<br/> Yoga used as an introspection technique for mental control and as a tool to freeze problems and analyze them from differnt perspectives.',8,2006,9,2007,'Y')); // The default is gray
  	act_height-=22;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catStudies,'AI Master','Studies. 2007-2009.<br/>Master degree in Artificial Intelligence (UPC, URV, UB).',8,2007,0,2009,'AI')); // The default is gray
  	act_height-=22;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catResearch,'Research KEMLg','Research at <a href="http://kemlg.upc.edu/">KEMLg</a>. 2007 - 2010.<br/>Multi-agent systems research applied to e-health. The main area of research in the Share-IT project was intelligence navigation and ambient intelligence. An intelligent environment and a shared control navigation system among user and machine were specified, designed and implemented.',10,2007,6,2010,'R')); // The default is gray
  	act_height-=22;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catStudies,'Psychology Degree','Studies. 2008 - present. <br/>Currently enrolled in a Psychology degree at Universitat Oberta de Catalunya (UOC, more than half degree already done).',1,2008,0,0,'Psy'));
	act_height-=22;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catResearch,'Research CVI','Research at <a href="http://www.cvi-bcn.org/en">CVI</a>. 2010.<br/>Offering technical and investigation support from KEMLg at CVIs research laboratory. Worked developing and making innovation on technology addressed to dependent people. ',0,2010,6,2010,'R')); // The default is gray
	act_height-=22;
  	s.addActivity(new Activity(false,act_height,ACT_HEIGHT, catFreelancer,'Freelancer','Jobs. 2010 - present. <br/> Analyst Developer at Freelance.<br/> Custom-made applications (web, desktop applications, mobile platforms, Facebook and ERP).<br/>Technologies: Java, Javascript, PHP, CakePHP, .NET, C#, C++, MySQL, Python, OpenERP, iOS, Wordpress and any present ones that could fit into ad-hoc specific project requirements.<br/> Worked in collaboration with:<br/><a href="http://www.tecfa.com/web/es/home">TECFA</a><br/><a href="http://www.ingeniummobile.com/">Ingenium Mobile</a><br/><a href="http://www.vivamus.es/">Vivamus 3.0</a><br/><a href="http://www.coneptum.com/">Coneptum</a>' ,7,2010,0,0,'F')); // The default is gray
	s.addActivity(new Activity(true,canvas.height-10,2, catStudies,'AI Course','Studies. December, 2011.<br/>Completed the Advanced Track of <a href="https://www.ai-class.com/home/">Introduction to Artificial Intelligence</a>, first online free course offered by Stanford University.',11,2011)); 
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Local Press','Research. April, 2011.<br/>Appeared in local <a href="http://ultimahora.es/menorca/noticia/noticias/local/tecnologia-con-factor-humano.html">press</a>.',3,2011));
	s.addActivity(new Activity(true,canvas.height-17,2, catResearch,'Conference','Research. May, 2010.<br/>"Environment Control" course at Hospital Sant Joan de Déu. Conference embedded in the course “Ajuda’t Ajuda’l” (Help yourself, Help him or her) addressed to parents regarding how to take care of disabled children.',4,2010));	
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Conference','Research. April, 2010.<br/>Presentation guest at "Cercle Artístic" in Ciutadella de Menorca (April, 2010). <a href="http://www.menorca.info/menorca/131437/els/dispositius/intel/ligents/son/tan/cars/com/gent/pensa">"Pot l’Enginyeria millorar la qualitat de vida?"</a> (Could technology improve our quality of life?).',3,2010));		
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Conference','Research. June, 2009.<br/>Presentation at <a href="http://iwann.ugr.es/2009/contenido.php?apartado=home&sub=home">IWANN 2009</a>. "Managing Ambient Intelligence Sensor Network Systems, an Agent Based Approach".',5,2009));		
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Conference','Research. May, 2008.<br/>Presentation at <a href="http://gaips.inesc-id.pt/aamas2008/">AAMAS 2008</a>, Estoril (Portugal): the leading scientific conference for research in autonomous agents and multi-agent systems. Workshop on "An Agent-Based service to elders mobility using i-Walker". 2008.',4,2008));		
	s.addActivity(new Activity(true,canvas.height-17,2, catResearch,'Conference','Organization. October, 2009.<br/>Member of the local committee in <a href="http://www.lsi.upc.edu/events/ccia2009/en/index.php?option=com_content&view=section&layout=blog&id=6&Itemid=7">CCIA 2009</a> - Twelfth International Congress of the Catalan Association in Artificial Intelligence.',9,2009));		
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Conference','Organization. July, 2008.<br/>Member of the local organizer committee in <a href="http://www.iemss.org/iemss2008/index.php?n=Main.Committees">iEMMs 2008</a> (International Congress on Environmental Modelling and Software)',6,2008));		
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Trade',"Trade Fair. June, 2010.<br/>AVANTE, Barcelona 2010 (at CVI's stand).",5,2010));		
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Trade',"Trade Fair. December, 2008.<br/>e-inclusion, Wien 2008 (showing i-Walker and Spherik from UPC).",11,2008));		
	s.addActivity(new Activity(true,canvas.height-10,2, catStudies,'English','Studies. August, 2007.<br/>English language training stage in Sydney (Australia). Course granted by "Ministerio de Educación y Ciencia (MEC)".',7,2007)); 
	s.addActivity(new Activity(true,canvas.height-10,2, catStudies,'English','Studies. July, 2008.<br/>English language training stage in Malta. Course granted by "Ministerio de Educación y Ciencia (MEC)".',6,2008)); 
	s.addActivity(new Activity(true,canvas.height-10,2, catYoga,'Yoga','Teaching Yoga. June-August, 2011.<br/>6-week Kundalini Yoga course taught in Menorca.',5,2011)); 
	s.addActivity(new Activity(true,canvas.height-10,2, catYoga,'Yoga','Teaching Yoga. October, 2010.<br/>Childplay Yoga (yoga for children) at Premià de Mar.',9,2010)); 
	s.addActivity(new Activity(true,canvas.height-10,2, catResearch,'Teaching',"Teaching. September, 2009.<br/>Selected as teaching collaborator at Universitat Oberta de Catalunya. Subject from Computer Science's degree: 'Interacció d’Humans amb Ordinadors' (Human-Computer Interaction). Never taught because of a lack of students.",8,2009));		
	s.addActivity(new Activity(true,canvas.height-10,2, catHobbies,'Music',"Music. 2002.<br/>Bought an alto saxophone and started playing on my own. Until present.",0,2002));		
	s.addActivity(new Activity(true,canvas.height-25,2, catHobbies,'Literature','Writing. June, 2010.<br/>"Demà serà un altre dia, tornaré a ser un bit". Finalist in the IX edition of the <a href="http://blogs.lavanguardia.com/relatos/2010/05/17/dema-sera-un-altre-dia-tornare-a-ser-un-bit">e-poem</a> contest from LaVanguardia.',5,2010));		
	s.addActivity(new Activity(true,canvas.height-17,2, catAltruistic,'Altruistic','Altruistic. August, 2009.<br/>Published a personal initiative, <a href="http://guiem.info/altruistic/700euros-org/">700euros.org</a>.',7,2009));		
	s.addActivity(new Activity(true,canvas.height-17,2, catHobbies,'Hobbies',"Humor. March, 2011.<br/>Published a website to analze micro-poet Joana Brabo's meme. Bought the domain and built the site <a href='http://tututothom.com'>tututothom.com</a> with a friend on a Friday night plenty of boredom. The site received more than 2,000 visits in a single weekend.",2,2011));		

	canvasState = s;
  //s.addActivity(new Activity(60,140,150,ACT_HEIGHT, 'lightskyblue'));
  // Lets make some partially transparent
  //s.addActivity(new Activity(80,150,200,ACT_HEIGHT, 'rgba(127, 255, 212, .5)'));
  //s.addActivity(new Activity(125,80,300,ACT_HEIGHT, 'rgba(245, 222, 179, .7)'));
}

// Now go make something amazing!