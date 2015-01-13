/* you gotta start somewhere
* this is my first attempt to convert my Python MYM game
* to browser based
*  amr 9-jan-2015
* and away we go
*/


/* so to speak, globals */

var num_pegs = 4; // length of input array
var num_guesses = num_pegs * 3
var game_colors = {
  "pot": ["red","blue","green","yellow"],
  "potHex": ["#ff2402",'#0c00ff','#05ff3b', '#ffff05']
  }
var color_key ={"r": "red","b": "blue","g": "green","y": "yellow"}

var game_state = {"w": "YOU WIN!", "l": "YOU LOSE!"}

var moves = []
var results = []

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
function set_active_color(color){

 var c1 = document.getElementById("playingField");
    var ctx = c1.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(36,355,40,40);
	ctx.strokeRect(34,353,44,44);

	}
	
function declare_game_over(state) {
    var c1 = document.getElementById("playingField");
    var ctx = c1.getContext("2d");
	ctx.fillStyle="yellow"
	ctx.fillRect(480,30,120,20);
	ctx.font="20px Verdana";
	ctx.fillStyle="red";
    ctx.fillText(game_state[state],480,50);
	}


function set_goal(thisOrder) {
        var goal=[];
    for (var i=0;i< num_pegs;i++) {
		    goal.push(game_colors["pot"][thisOrder[i]]);
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
    	if (movex[i] == theGoal[i]) {this_result.push("T");}
		else {g_rest.push(theGoal[i]);m_rest.push(movex[i]);}
	    }
	
    /* now check for color match 2 loops */	
	g_rest=g_rest.sort();m_rest=m_rest.sort();
	for (i in m_rest) {
	    if (m_rest[i] == g_rest[i]) {this_result.push("t");}
	    
		   }
    
    
	for (i = this_result.length;i<num_pegs;i++) {this_result.push("-");}
	
	return this_result
	
}

function make_move(movex) {
    moves.push(movex);
	results.push(eval_move(movex));
	is_game_over();
	}
	
function is_game_over() {
    if (results[results.length-1].toString() ==	"T,T,T,T" ) {
	/* you win , print message, end game */
	declare_game_over("w");
	}
	else {if (results.length == num_guesses) {
	declare_game_over("l");
	}
	}
}	
	
    	
function str_to_move(str) {
   var newarr=[];
   for (var i=0;i<str.length;i++) {
   newarr.push(color_key[str.substr(i,1)]);
   }
   return newarr
   }

    	
/* __mainloop__ */

set_active_color("#f4f4f4");

var theGoal = set_goal(random_array(num_pegs));

document.getElementsByClassName("pot")




