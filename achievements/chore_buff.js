var name		= "Chore Buff";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Ranked as top 5 contributors for 37 phases of a project";
var status_text		= "In recognization of the above-and-beyond-ness of your Project participation, please accept this Chore Buff badge. We made it just for you.";
var last_published	= 1316467819;
var is_shareworthy	= 0;
var url		= "chore-buff";
var category		= "projects";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-09-10\/chore_buff_1315686062.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-09-10\/chore_buff_1315686062_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-09-10\/chore_buff_1315686062_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-09-10\/chore_buff_1315686062_40.png";
function on_apply(pc){
	
}
var conditions = {
	545 : {
		type	: "counter",
		group	: "job_phase_winner",
		label	: "count",
		value	: "37"
	},
};
function onComplete(pc){ // generated from rewards
	var multiplier = pc.buffs_has('gift_of_gab') ? 1.2 : pc.buffs_has('silvertongue') ? 1.05 : 1.0;
	multiplier += pc.imagination_get_achievement_modifier();
	if (/completist/i.exec(this.name)) { 
		 var level = pc.stats_get_level(); 
		 if (level > 4) {  
				multiplier *= (pc.stats_get_level()/4); 
		} 
	} 
	pc.stats_add_xp(round_to_5(500 * multiplier), true);
	pc.stats_add_favor_points("all", round_to_5(40 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 500,
	"favor"	: {
		"giant"		: "all",
		"points"	: 40
	}
};

// generated ok (NO DATE)
