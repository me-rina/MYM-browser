/* you gotta start somewhere
* this is my first attempt to convert my Python MYM game
* to browser based
*  amr 9-jan-2015
* and away we go
*/


/* so to speak, globals */

var arr_len = 4; // length of input array
var game_colors = {
  "pot": ["red","blue","green","yellow"],
  "potHex": ["#ff2402",'#0c00ff','#05ff3b', '#ffff05']
  }
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

 var c1 = document.getElementById("activeColor");
    var ctx = c1.getContext("2d");
    ctx.fillStyle = color;
    ctx.fillRect(40,4,40,40);
	ctx.strokeRect(38,2,44,44);

	}

function set_goal(thisOrder) {
        var goal=[];
    for (var i=0;i< arr_len;i++) {
		    goal.push(game_colors["pot"][thisOrder[i]]);
		}
    return goal
	}	
/* __mainloop__ */

set_active_color("#f4f4f4");

var theGoal = set_goal(random_array(arr_len));

document.getElementsByClassName("pot")




