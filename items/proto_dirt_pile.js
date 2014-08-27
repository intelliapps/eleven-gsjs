//#include include/jobs.js, include/cultivation.js

var label = "Dirt Pile";
var version = "1347907556";
var name_single = "Dirt Pile";
var name_plural = "Dirt Piles";
var article = "a";
var description = "";
var is_hidden = false;
var has_info = false;
var has_infopage = false;
var proxy_item = null;
var is_routable = false;
var adjusted_scale = 1;
var stackmax = 1;
var base_cost = 300;
var input_for = [];
var parent_classes = ["proto_dirt_pile", "proto"];
var has_instance_props = false;

var classProps = {
	"item_class"	: "dirt_pile",	// defined by proto (overridden by proto_dirt_pile)
	"job_class_id"	: "job_cult_dirt_pile_2",	// defined by proto (overridden by proto_dirt_pile)
	"width"	: "220",	// defined by proto (overridden by proto_dirt_pile)
	"placement_set"	: "all"	// defined by proto (overridden by proto_dirt_pile)
};

var instancePropsDef = {};

var verbs = {};

verbs.remove = { // defined by proto
	"name"				: "remove",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 50,
	"tooltip"			: "Remove from the location",
	"is_drop_target"		: true,
	"drop_many"			: false,
	"drop_tip"			: "Pour {$stack_name} on {$item_name}",
	"drop_ok_code"			: function(stack, pc){

		return stack.class_tsid == 'wine_of_the_dead' && this.hasInProgressJob(pc);
	},
	"conditions"			: function(pc, drop_stack){

		if (!this.container.pols_is_owner(pc)) return {state: null};

		if ((!drop_stack || drop_stack.class_tsid != 'wine_of_the_dead') && this.hasInProgressJob(pc)) return {state: 'disabled', reason: "Pour some Wine of the Dead to cancel the project first."};

		return {state:'enabled'};
	},
	"handler"			: function(pc, msg, suppress_activity){

		if (this.hasInProgressJob(pc)){
			var it = pc.getAllContents()[msg.target_itemstack_tsid];
			if (!it) return false;

			msg.target = this;
			return it.verbs['pour'].handler.call(it, pc, msg);
		}
		else{
			pc.prompts_add({
				title			: 'Please Confirm!',
				txt			: "Are you really sure you want to remove this "+this.name_single+"?",
				is_modal		: true,
				icon_buttons	: true,
				choices		: [
					{ value : 'ok', label : 'Yes' },
					{ value : 'cancel', label : 'Nevermind' }
				],
				callback	: 'prompts_itemstack_location_callback',
				itemstack_tsid		: this.tsid
			});
		}
	}
};

verbs.build_tower = { // defined by proto
	"name"				: "build tower",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 51,
	"tooltip"			: "Start a project to build a tower here",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid != 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		return this.verbs.restore.handler.call(this, pc, msg, suppress_activity);
	}
};

verbs.restore = { // defined by proto
	"name"				: "restore",
	"ok_states"			: ["in_location"],
	"requires_target_pc"		: false,
	"requires_target_item"		: false,
	"include_target_items_from_location"		: false,
	"is_default"			: false,
	"is_emote"			: false,
	"sort_on"			: 52,
	"tooltip"			: "Start a project to restore this item",
	"is_drop_target"		: false,
	"conditions"			: function(pc, drop_stack){

		if (this.class_tsid == 'proto_furniture_tower_chassis') return {state:null};
		if (this.hasJobs(pc)) return {state:'enabled'};

		return {state:null};
	},
	"handler"			: function(pc, msg, suppress_activity){

		this.offerJobs(pc, msg);
		return true;
	}
};

function onRemoved(pc){ // defined by proto_dirt_pile
	if (pc){
		pc.runDropTable('cult_remove_dirt_pile', this);
	}
}

function getEndItems(){ // defined by proto
	//this.container.geo_placement_get(this.pl_tsid);
	return this.getClassProp('item_class').split(',');
}

function modal_callback(pc, value, details){ // defined by proto
	if (value == 'ok'){
		if (this.hasInProgressJob(pc) && details.target_itemstack_tsid){
			var wine = pc.removeItemStackTsid(details.target_itemstack_tsid, 1);
			if (wine){
				wine.apiConsume(1);
				this.resetJob(pc);
				pc.sendActivity("You poured Wine of the Dead on a "+this.name_single+" and canceled the project.");
			}
			else{
				pc.sendActivity("Where'd your wine go? I can't find it.");
			}
		}
		else{
			this.removeResource(pc);
		}
	}
}

function onCreate(){ // defined by proto
	this.setAndBroadcastState('depleted');
	this.setJobData();
}

function onPlayerEnter(pc){ // defined by proto
	var jobs = this.getAvailableJobs(pc);
		
	for (var i in jobs.given){
		var qi = jobs.given[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.open){
		var qi = jobs.open[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}

	for (var i in jobs.delayed){
		var qi = jobs.delayed[i];
		if (qi){
			var status = this.buildJobStatus(pc, qi);
			status.is_update = true;
			status.spirit_id = this.tsid;
		
			return pc.apiSendMsgAsIs(status);
		}
	}
}

function setJobData(){ // defined by proto
	if (!this.container) return this.apiSetTimer('setJobData', 500);

	log.info(this+' running setJobData');
	if (this.getClassProp('job_class_id') != '' && this.getClassProp('job_class_id') != undefined){
		var id = 'proto-'+this.tsid;

		log.info(this+' setting street data');
		this.container.jobs_set_street_info({id: id, type: 1});

		log.info(this+' setting class ids');
		var job_class_ids = {};

		var class_ids = this.getClassProp('job_class_id').split(',');
		var phase = 1;
		for (var i in class_ids){
			var class_id = class_ids[i];
			job_class_ids[class_id] = {in_order : phase, class_id: class_id, delay_seconds: 60};
			phase++;
		}
		this.container.jobs_set_class_ids({ id: id, job_class_ids: job_class_ids});

		if (class_ids[0]) this.updatePlayers(id, class_ids[0]);
	}
}

function getDescExtras(pc){
	var out = [];
	return out;
}

var tags = [
	"no_rube",
	"proto",
	"no_trade"
];


// this is a temporary fix, while the client doesn't load item defs
// from the XML files. we pass this data on login events.

function getAssetInfo(){
	return {
		'position': {"x":-97,"y":-71,"w":195,"h":71},
		'thumb': "iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAYAAACM\/rhtAAAESklEQVR42u2Wy08bVxTGkSocTLE9\nHo9n\/MJPAn7id2yMwQ\/ALzDGLxIoYExIwEnaNKJVlq3UdStlG6mK1PwBrLJoNl1U6qoSXSSLqlKi\nLrq2FHV\/es61aSO1ldJHqlSaI13dmes7M7\/7fecceWREDjnkkEMOOeSQ47+IWzlH8EbO3t+MiafL\nTq3mjYJb83HBo6y1f21xEi7HJagG+AdvBNiNrP32Ucb2VTtmgL05E1xbmIRWVIQlNw\/tmHh2OSwG\nl++OvH417y47Nb2cJVM5GbPRB9tRreZg3vzgcMECx1kbXE1bAO8R0gi1kACtmAjdeQte62G3I522\nCsJH9J6TisP2XsHe2UtItX8N7oOiq3ZryfGcFFqP6aHd0MNO0gRHGSsbBElwHfx9MybBZnww6Ldd\nXNvPm6Ee10PZrzv9sHzx7E7BBbWgCI2w\/nnKwdn+ceIjQP8QFSKV3kkMrNyKG1iu0XoX4XYSRthA\ntdZmBdgICwyMAAm8HhJhPSggvAg9VJvSoJsy434Baildv45p8Lfgtrc52\/VF61krIgHOcHvFCccZ\nG4NpRkQ2EwCNc4sbYZGBH+A9FQytLXt4qCJ4G3Pz6nDvlbII9aQAq7heCej6uWku+JfhylWuT6rQ\n6Y8QkHKN5m7KxOY7RRe8u+RgSpEqqATZCL2cDTAlfoUvelnBwNYlAzsorbWjEpR8OpYK9EzFz\/cr\nnle0u5riat20pb9PikT07CUERcpQhZLNBHuwboabeQe7vhI3QgFBmrj\/8CX19pJGZiUB7uA17aV3\nNdGVIgLWw3r2G6oI6SntWfTP+mcjJjoT1glvyqlp4safij6ekpg9TMm\/jVB0TwCbBIlqkMVUqdic\nEcjKDkIVTCAEdzNvh+uoLt3T9Ulpiu2j\/Qf43MB6ph7Q91IuLQNf8Wi\/0E4o\/IilPOdTCaoLM1bt\nWLrgFR5lfPyXmEsvqJc1ImSNEVYDetbbqAgImFTcxQ9T0pMqZB1ZuBoQBooPwUlNsp6UplRoRSVW\nVE2c6cA1TB967zYelubcDP8o55E+UypHk8T1R2Iqsm6+SbB+5\/gx2drLTrLEJjvWsEJpzkxrGdB5\ne6GiIbVJiSWPDjpoI4FQC6piS+mkLKw1DQ6JvXFuAJTHUQpIPxa9wrO8R\/d0xS\/dKwZ130tqxRay\nuF5W8XegJm40vOLVfbuBbYJOXp7XQmJW\/RjT4POIRXU\/YlXdL\/n4ryt+AeJu1ZOETf1wcYr7IeHQ\nPKtHxJ972d96JLWdvE8L+ZgGC2oAS0WS9Rq+uTip38\/O8O8nZyfu4XcdQ+UUr1rQiuEDqksbF6aH\n9xwO0\/l6yS9k827uY9YP0fY5p+Yx2vodKvWC7K6g6tWgHhJT4un4+Ggs6VR\/uhBSP4w7+E8kXpkc\nvuu1hSJkfjsUMI5HY\/aJLKpaNXBj9uFBTO70aHRuU7k1hNDheEv+3yeHHHLIIYcc\/6\/4BSvS87Y4\n77++AAAAAElFTkSuQmCC",
	};
};

var itemDef = {
	label		: this.label,
	name_plural	: this.name_plural,
	stackmax	: this.stackmax,
	is_hidden	: this.is_hidden,
	has_info	: this.has_info,
	adjusted_scale	: this.adjusted_scale,
	asset_swf_v	: "\/c2.glitch.bz\/items\/2012-04\/proto_dirt_pile-1333485475.swf",
	admin_props	: false,
	obey_physics	: false,
	in_background	: true,
	in_foreground	: false,
	has_status	: false,
	not_selectable	: false,
};

if (this.consumable_label_single) itemDef.consumable_label_single = this.consumable_label_single;
if (this.consumable_label_plural) itemDef.consumable_label_plural = this.consumable_label_plural;

itemDef.verbs = {
};
itemDef.hasConditionalVerbs = 1;
itemDef.emote_verbs = {
};
itemDef.hasConditionalEmoteVerbs = 0;
itemDef.tags = [
	"no_rube",
	"proto",
	"no_trade"
];
itemDef.keys_in_location = {
	"u"	: "build_tower",
	"e"	: "remove",
	"t"	: "restore"
};
itemDef.keys_in_pack = {};

// generated ok 2012-09-17 11:45:56 by martlume
