/* you gotta start somewhere
* this is my first attempt to convert my Python MYM game
* to browser based
*  amr 9-jan-2015
* and away we go
*/


/* ###################################
*
*  so to speak, globals 
*
* ####################################
*/

var num_pegs = 4; // length of input array
var num_guesses = num_pegs * 3;
var game_colors = {
  "potHuman": {"#ff2402":"red","#0c00ff":"blue","#05ff3b":"green","#ffff05":"yellow"},

  "potHex": ["#ff2402",'#0c00ff','#05ff3b', '#ffff05'],
  "rgb2Hex": {  "rgb(255, 255, 5)": "#ffff05", "rgb(5, 255, 59)":"#05ff3b", "rgb(12, 0, 255)":"#0c00ff", "rgb(255, 36, 2)":"#ff2402"}
  };
/* after all that color shit.......colors are stored in rgb!!!!! */

var color_key ={"r": "#ff2402","b": "#0c00ff","g": "#05ff3b","y": "#ffff05"};

var game_state = {"w": "YOU WIN!", "l": "YOU LOSE!"};
var toggle_vis = {"hidden": "visible", "visible": "hidden"};
var theGoal=[];
var moves = [];
var results = [];
var blank_color="#f4f4f4";
var game_is_running = true;

var boardSpecs = {
    "startCol": 340,
	"startRow": 32,
	"slotWidth": 30,
	"shiftRes": 15,
	"startResCol": function() {return boardSpecs["startCol"]+(num_pegs*(boardSpecs["slotWidth"]+2)) + boardSpecs["shiftRes"]}
	}

/* ################################################
*
* helpers
*
* ###################################### */	

/* acquired this routine from http://web-profile.com.ua/js/dev/randomize-shuffle-an-array/ */
function random_array( num ) {
    var i, j, tmp,
        raw_array = [];

    for ( i = 0; i < num; i++ ) { // create array
        raw_array.push(i);
    }

    for ( i = num - 1; i > 0; i-- ) { // swap elements in array randomly using Fisher-Yates (aka Knuth) Shuffle
        j = Math.floor( Math.random() * (i + 1) );
        tmp = raw_array[i];
        raw_array[i] = raw_array[j];
        raw_array[j] = tmp;
    }
    //alert( 'n = ' + num + '; array = [ ' + raw_array + ' ]' ); // alert for demonstation
    //document.getElementById('main').innerHTML = 'n = ' + num + '; array = [ ' + raw_array + ' ]';
     return raw_array;
}
/* ##############################
*
* Drawing "methods"
*
* ############################ */

function draw_board() {
    var ctx = document.getElementById("playingField").getContext("2d");
	/* background a0a0a0 */
	ctx.fillStyle="#a0a0a0";
	ctx.fillRect(boardSpecs["startCol"],boardSpecs["startRow"], boardSpecs["shiftRes"] + (num_pegs * 2) * ((boardSpecs["slotWidth"]+2)),num_guesses*32 )
	
	/* i = rows, posy; j=cols, posx */
	    
	    for (var i=0;i<num_guesses;i++) {
		    for (var j=0;j<num_pegs;j++) {
	        ctx.fillStyle = "#b56d3d";
	       	ctx.fillRect(boardSpecs["startCol"] + (j*(boardSpecs["slotWidth"]+2)),(385 - (i*32)),boardSpecs["slotWidth"],30);
         }	
		 
		for (var j=0;j<num_pegs;j++) {
	        ctx.fillStyle = "#b56d3d";
        	ctx.fillRect(boardSpecs.startResCol() + (j*(boardSpecs["slotWidth"]+2)),(385 - (i*32)),boardSpecs["slotWidth"],30);		
	        }
	    
		}
}

function draw_move(row) {
    var ctx = document.getElementById("playingField").getContext("2d");
	/* row = rows , posy; j = cols, posx */
	for (var j=0;j<num_pegs;j++) {
	ctx.fillStyle = moves[row][j];
	ctx.fillRect(boardSpecs["startCol"] + (j*(boardSpecs["slotWidth"]+2)),(385 - (row*32)),boardSpecs["slotWidth"],30);
	ctx.fillStyle=results[row][j];
	ctx.fillRect(boardSpecs.startResCol() + (j*(boardSpecs["slotWidth"]+2)), (385 - (row*32)),boardSpecs["slotWidth"],30); 
	}
}

function set_active_color(color){
    if (game_is_running) {
 
        var ctx = document.getElementById("playingField").getContext("2d");
        ctx.fillStyle = color;
        ctx.fillRect(14,325,30,30);
	    ctx.strokeRect(12,323,34,34);
	    active_color = color;

	}
}
	
function set_button_color(btn) {

    if (document.getElementById(btn).style.backgroundColor == "" && active_color != blank_color) {	
    document.getElementById(btn).style.backgroundColor=active_color;}
	else {document.getElementById(btn).style.backgroundColor=""}
	}
	
function reset_guess_buttons() {
    for (var i=0;i<num_pegs;i++) {
       document.getElementsByClassName("guess")[i].style.backgroundColor="";
    }
}	
function reset_game_state() {
    var ctx = document.getElementById("playingField").getContext("2d");
    ctx.clearRect(boardSpecs["startCol"]+80,10,120,20);
}
	
function declare_game_over(state) {
    var c1 = document.getElementById("playingField");
    var ctx = c1.getContext("2d");
	ctx.fillStyle="yellow"
	ctx.fillRect(boardSpecs["startCol"]+80,10,120,20);
	ctx.font="20px Verdana";
	ctx.fillStyle="red";
    ctx.fillText(game_state[state],boardSpecs["startCol"]+80,30);
	}
	
function show_help() {
/* hardest method yet intention: modify the DOM to make the help div visible */	
    document.getElementById("helpdoc").style["visibility"]="visible";
	}
function hide_help() {
    document.getElementById("helpdoc").style["visibility"]="hidden";
}
function toggle_help() {
   var switch_vis=toggle_vis[document.getElementById("helpdoc").style["visibility"]];
   document.getElementById("helpdoc").style["visibility"]=switch_vis;
   }

/* #############################################
*
*  game "methods", "event handlers"
*
* ############################################## */

function init_game() {
    set_active_color("#f4f4f4");
    draw_board();
    theGoal = set_goal(random_array(num_pegs));
	moves = [];
	results = [];
	reset_game_state();
	reset_guess_buttons();
	game_is_running = true;
	}
	
function set_goal(thisOrder) {
        var goal=[];
    for (var i=0;i< num_pegs;i++) {
		    goal.push(game_colors["potHex"][thisOrder[i]]);
		}
    return goal
	}	
	
function eval_move(movex) {
    /* contract: array (the move) -> array (the result) */
    var exact_match = 0;
	var color_match = 0;
    var g_rest = [];
    var m_rest = [];
	var this_result=[];
	
	/* check for exact match */
	for (var i in movex) {
    	if (movex[i] == theGoal[i]) {this_result.push("black");}
		else {g_rest.push(theGoal[i]);m_rest.push(movex[i]);}
	    }
	
    /* now check for color match 2 loops */	

	for (i in g_rest) {
	    if (m_rest.indexOf(g_rest[i]) >= 0) {
		this_result.push("white");m_rest.splice(m_rest.indexOf(g_rest[i]),1)}
		   
		   }
    
    
	for (i = this_result.length;i<num_pegs;i++) {this_result.push("#b56d3d");}
	
	return this_result
	
}
function is_valid_move(element, index, array) {
    return element != undefined
	} 

function make_move(movex) {
    if (movex.every(is_valid_move)) {
       moves.push(movex);
       results.push(eval_move(movex));
	   draw_move(moves.length-1);
	   is_game_over();
	   reset_guess_buttons();
	   set_active_color("#f4f4f4");
	}
	}
	
function build_move() {
/* first validate you have 4 colors (they can all be the same, don't care) */

    guess_in_hex=[]
    for (var i=0;i<num_pegs;i++) {
	   guess_in_hex.push(game_colors["rgb2Hex"][document.getElementsByClassName("guess")[i].style.backgroundColor]);
	   }
	   return guess_in_hex
	   }
	
function is_game_over() {
    if (results[results.length-1].toString() ==	"black,black,black,black" ) {
	/* you win , print message, end game */
	declare_game_over("w"); set_active_color(blank_color);game_is_running = false;
	}
	else {if (results.length == num_guesses) {
	declare_game_over("l"); set_active_color(blank_color);game_is_running = false;
	}
	}
}	
	
/* ###########################
*
* fns for testing in the console
*
* ############################## */    	

function str_to_move(str) {
   var newarr=[];
   for (var i=0;i<str.length;i++) {
   newarr.push(color_key[str.substr(i,1)]);
   }
   return newarr
   }
   
function goal_human() {
    var incolor=[];
	for (var i in theGoal) {

	    incolor.push(game_colors["potHuman"][theGoal[i]])
		}
	return incolor
	}
	

/* __mainloop__ */
init_game()




