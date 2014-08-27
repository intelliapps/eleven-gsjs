var name		= "Basic Bean-Grower";
var collection_type	= 0;
var is_secret		= 0;
var desc		= "Planted 5 Seasoned Beans";
var status_text		= "Way to stick that bean in the ground! You've earned a Basic Bean-Grower badge.";
var last_published	= 1323924698;
var is_shareworthy	= 0;
var url		= "basic-beangrower";
var category		= "trees";
var url_swf		= "\/c2.glitch.bz\/achievements\/2011-05-09\/basic_beangrower_1304983801.swf";
var url_img_180		= "\/c2.glitch.bz\/achievements\/2011-05-09\/basic_beangrower_1304983801_180.png";
var url_img_60		= "\/c2.glitch.bz\/achievements\/2011-05-09\/basic_beangrower_1304983801_60.png";
var url_img_40		= "\/c2.glitch.bz\/achievements\/2011-05-09\/basic_beangrower_1304983801_40.png";
function on_apply(pc){
	
}
var conditions = {
	180 : {
		type	: "group_sum",
		group	: "beans_planted",
		value	: "5"
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
	pc.stats_add_xp(round_to_5(100 * multiplier), true);
	pc.stats_add_favor_points("spriggan", round_to_5(15 * multiplier));
	if(pc.buffs_has('gift_of_gab')) {
		pc.buffs_remove('gift_of_gab');
	}
	else if(pc.buffs_has('silvertongue')) {
		pc.buffs_remove('silvertongue');
	}
}
var rewards	= {
	"xp"	: 100,
	"favor"	: {
		"giant"		: "spriggan",
		"points"	: 15
	}
};

// generated ok (NO DATE)
