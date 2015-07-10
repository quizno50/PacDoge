function debug_update(name, value)
{
	var tgt = document.getElementById('debug_' + name);
	tgt.innerHTML = value;
}

function debug_update_tiles(l, r, u, d)
{
	var debug_l = document.getElementById('debug_l');
	var debug_r = document.getElementById('debug_r');
	var debug_u = document.getElementById('debug_u');
	var debug_d = document.getElementById('debug_d');
	debug_l.style.background = l ? "#000" : "#fff";
	debug_r.style.background = r ? "#000" : "#fff";
	debug_u.style.background = u ? "#000" : "#fff";
	debug_d.style.background = d ? "#000" : "#fff";
}

var DIRECTION_LEFT = 0;
var DIRECTION_UP = 1;
var DIRECTION_RIGHT = 2;
var DIRECTION_DOWN = 3;

function Map()
{
	this.width = 884;
	this.height = 544;
	this.tile_width = 26;
	this.tile_height = 16;
/*
	this.data = [
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1,
1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1,
1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1,
1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1,
1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1,
1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1,
1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1,
1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1,
1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1,
1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1,
1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1,
1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1,
1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1,
1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
	];
*/

/*

// Code to convert 1 / 0 array to numbers:

final = [];
for (var i = 0; i < m.data.length; ++i)
{
	fi = Math.floor(i / 32);
	shift = i % 32;
	final[fi] |= m.data[i] << shift;
}
debug.log(final);

*/
	this.map_data_bm = [-2013265921, -1212661216, -2004846806, -725619323,
			-100401146, -1603545237, 2125310992, -1262315899, 1787321179,
			1437249345, -1118428639, -1476126038, -24];
	this.data = [];
	this.dots = [];
	// This is zero for now, but we'll count them as we place them when the map
	// is built.
	this.total_dots = 0;
	this.power_pill_size = 3;
	this.frame_no = 0;

	// Convert the map data bitmap to something the render function can use.
	for (var i = 0; i < 32 * this.map_data_bm.length; ++i)
	{
		var map_data_idx = Math.floor(i / 32);
		var shift = i % 32;
		this.data[i] = (this.map_data_bm[map_data_idx] >> shift) & 1;
		this.dots[i] = this.data[i];
		this.total_dots += (this.dots[i] == 0);
	}

	// Add the power pills
	this.dots[29] = 2; // 3x1
	this.dots[49] = 2; // 23x1
	this.dots[24 + 14 * this.tile_width] = 2; // 24x15 
	this.dots[3 + 14 * this.tile_width] = 2; // 3x13
	this.process = function()
	{
		this.frame_no += 1;
		this.power_pill_size = 2 * Math.sin(this.frame_no) + 30;
	}

	this.render = function(canvas)
	{
		var ctx = canvas.getContext('2d');
		if (typeof(this.dogecoin_logo) == 'undefined')
		{
			this.dogecoin_logo = new Image();
			this.dogecoin_logo.src = "Dogecoin_logo.png";
		}

		for (var y = 0; y < this.tile_height; ++y)
		{
			for (var x = 0; x < this.tile_width; ++x)
			{
				ctx.fillStyle = this.data[x + y * this.tile_width] == 0 ? "#fff" :
						"#000";
				ctx.fillRect(8 + 34 * x, 3 + 34 * y, 34, 34);
				if (this.dots[x + y * this.tile_width] == 0)
				{
					var pos_x = x * 34 + 24;
					var pos_y = y * 34 + 20;
					ctx.beginPath();
					ctx.arc(pos_x, pos_y, 3, 0, 2 * Math.PI);
					ctx.fillStyle = "#8c8c00";
					ctx.fill();
				}
				else if (this.dots[x + y * this.tile_width] == 2)
				{
					var pos_x = x * 34 + (24 - this.power_pill_size / 2);
					var pos_y = y * 34 + (20 - this.power_pill_size / 2);
					ctx.beginPath()
					ctx.drawImage(this.dogecoin_logo, 0, 0, this.dogecoin_logo.width,
							this.dogecoin_logo.height, pos_x, pos_y,
							this.power_pill_size, this.power_pill_size);
					/*
					ctx.arc(pos_x, pos_y, this.power_pill_size, 0, Math.PI * 2);
					ctx.fillStyle = "#8c8c00";
					ctx.fill();
					*/
				}
			}
		}
	}
}

function Animation(tgtObj)
{
	this.tgtObj = tgtObj;
	this.frameCount = 0;
	// Duration in frames.
	this.duration = 0;
	this.done = false;
	this.processNextFrame = function()
	{
		this.frameCount += 1;
		if (this.frameCount > this.duration && this.duration != -1)
		{
			this.done = true;
			return false;
		}
	}

	this.render = function(ctx)
	{
	}
}

function BlockingAnimation(tgtObj)
{
	Animation.call(this, tgtObj)
}

BlockingAnimation.prototype = new Animation(null);

function GhostEatenAnimation(tgtObj, ptVal)
{
	BlockingAnimation.call(this, tgtObj);
	this.duration = 15;
	this.textLocal = 17;
	this.text = ptVal + "";
	this.processNextFrame = function()
	{
		BlockingAnimation.prototype.processNextFrame.call(this);
		this.textLocal += this.frameCount / 3;
	}

	this.render = function(ctx)
	{
		BlockingAnimation.prototype.render.call(this, ctx);
		ctx.fillStyle = "#fff";
		ctx.font = "18pt ComicSansMS";
		ctx.textBaseline = "middle";
		ctx.textAlign = "center";
		ctx.fillText(this.text, this.tgtObj.x + 17,
				this.tgtObj.y - this.textLocal + 17);
		ctx.strokeStyle = "#000";
		ctx.strokeText(this.text, this.tgtObj.x + 17,
				this.tgtObj.y - this.textLocal + 17);
	}
}

GhostEatenAnimation.prototype = new BlockingAnimation(null);

function SpaceBarFullScreenAnimation(tgtObj, text, subtext)
{
	BlockingAnimation.call(this, tgtObj, text, subtext);
	this.duration = -1;
	this.textLocale = 0;
	this.text = text;
	this.subtext = subtext;
	
	this.processNextFrame = function()
	{
		BlockingAnimation.prototype.processNextFrame.call(this);
		this.textLocale = (this.tgtObj.height / 4)
				* Math.cos(this.frameCount / 50) + (this.tgtObj.height / 2);
	}

	this.render = function(ctx)
	{
		ctx.fillStyle = "#f3ab24";
		ctx.strokeStyle = "#000";
		ctx.font = "85pt Comic Sans MS";
		ctx.textAlign = "center";
		ctx.textBaseline = "bottom";
		ctx.fillText(this.text, this.tgtObj.width / 2, this.textLocale);
		ctx.strokeText(this.text, this.tgtObj.width / 2, this.textLocale);
		ctx.font = "20pt Comic Sans MS";
		ctx.fillStyle = "#fff";
		ctx.strokeStyle = "#000";
		ctx.textBaseline = "top";
		ctx.fillText(this.subtext, this.tgtObj.width / 2,
				this.textLocale);
		ctx.strokeText(this.subtext, this.tgtObj.width / 2,
				this.textLocale);
	}
}

SpaceBarFullScreenAnimation.prototype = new BlockingAnimation(null);

function StartGameAnimation(tgtObj)
{
	SpaceBarFullScreenAnimation.call(this, tgtObj, "PacDoge",
			"Press Space Bar to Start");
}

StartGameAnimation.prototype = new SpaceBarFullScreenAnimation(null, "", "");

function PlayerDeadAnimation(tgtObj)
{
	var dead_text = ["such ouch", "very dead", "so ghosted"];
	SpaceBarFullScreenAnimation.call(this, tgtObj,
			dead_text[Math.floor(Math.random() * dead_text.length)],
			"Press Space Bar to Start");
}

PlayerDeadAnimation.prototype = new SpaceBarFullScreenAnimation(null, "", "");

function GameOverAnimation(tgtObj)
{
	SpaceBarFullScreenAnimation.call(this, tgtObj, "Game Over",
			"Press Space Bar to Start a new game");
}

GameOverAnimation.prototype = new SpaceBarFullScreenAnimation(null, "", "");

function VictoryAnimation(tgtObj)
{
	SpaceBarFullScreenAnimation.call(this, tgtObj, "Victory!",
			"Press Space Bar to start next level.");
	//TODO: Add some fireworks or something festive to this animation.
}

VictoryAnimation.prototype = new SpaceBarFullScreenAnimation(null, "", "");

function GameObject()
{
	this.x = 0;
	this.y = 0;
	this.map_x = 0;
	this.map_y = 0;
	this.width = 0;
	this.height = 0;
	this.image = null;

	this.render = function(canvas)
	{
		var ctx = canvas.getContext('2d');
		if (this.image != null)
		{
			ctx.drawImage(this.image, this.direction * 34, 0, 34, 34, this.x + 8,
					this.y + 3, 34, 34);
		}
	}

	this.convert_coord_screen_to_map = function()
	{
		this.map_x = Math.floor((this.x) / 34);
		this.map_y = Math.floor((this.y) / 34);
	}

	this.convert_coord_map_to_screen = function()
	{
		this.x = 34 * this.map_x;
		this.y = 34 * this.map_y;
	}

	this.process = function()
	{
		var newx = this.x - this.speed * (this.direction == DIRECTION_LEFT)
				+ this.speed * (this.direction == DIRECTION_RIGHT);
		var newy = this.y - this.speed * (this.direction == DIRECTION_UP)
				+ this.speed * (this.direction == DIRECTION_DOWN);;
		var crossing_tile_x = Math.floor(newx / 34) != Math.floor(this.x / 34);
		var crossing_tile_y = Math.floor(newy / 34) != Math.floor(this.y / 34);
		var ok_to_move = true;

		var new_tile_x =
				Math.floor((newx + ((this.direction == DIRECTION_RIGHT) * 34)) / 34);
		var new_tile_y =
				Math.floor((newy + (this.direction == DIRECTION_DOWN) * 34) / 34);
		if (p.map.data[new_tile_x + new_tile_y * p.map.tile_width])
		{
			ok_to_move = false;
		}
		
		if (ok_to_move)
		{
			this.x = newx;
			this.y = newy;
			this.map_x = Math.floor(newx / 34);
			this.map_y = Math.floor(newy / 34);
			this.on_boundry = false;
		}
		else
		{
			this.x = Math.round((this.x +
					((this.direction == DIRECTION_RIGHT) * this.speed))
					/ 34) * 34;
			this.y = Math.round((this.y + 
					((this.direction == DIRECTION_DOWN) * this.speed))
					/ 34) * 34;
		}

		if (((this.x % 34 == 0 || crossing_tile_x)
				&& (this.direction == DIRECTION_LEFT
				|| this.direction == DIRECTION_RIGHT))
				|| ((this.y % 34 == 0 || crossing_tile_y)
				&& (this.direction == DIRECTION_UP
				|| this.direction == DIRECTION_DOWN))
				|| (this.direction == DIRECTION_LEFT
				&& this.next_direction == DIRECTION_RIGHT)
				|| (this.direction == DIRECTION_RIGHT
				&& this.next_direction == DIRECTION_LEFT)
				|| (this.direction == DIRECTION_UP
				&& this.next_direction == DIRECTION_DOWN)
				|| (this.direction == DIRECTION_DOWN
				&& this.next_direction == DIRECTION_UP))
		{
			this.on_boundry = true;
			if (this.direction != this.next_direction)
			{
				this.direction = this.next_direction;
				this.x = Math.round(this.x / 34) * 34;
				this.y = Math.round(this.y / 34) * 34;
			}
		}
		var reversing_direction = (this.direction == DIRECTION_UP && this.next_direction == DIRECTION_DOWN);
		/*
		debug_update('x', this.x);
		debug_update('y', this.y);
		debug_update('map_x', this.x / 34);
		debug_update('map_y', this.y / 34);
		*/
	}
}

GHOST_RANDOM = 0;
GHOST_SPECIAL = 1;
GHOST_CHASE = 2;
GHOST_AWAY = 3;

function debug_path_map_plot(idx)
{
	var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
	var x = 23 + Math.floor(idx % p.map.tile_width) * 34;
	var y = 18 + Math.floor(idx / p.map.tile_width) * 34;
	ctx.fillStyle = "#ffcccc";
	ctx.fillRect(x, y, 5, 5);
}

function Ghost()
{
	GameObject.call(this);
	this.ghost_num = Ghost.ghost_num;
	++Ghost.ghost_num;
	this.color_array = ["#ff0000", "#00ff00", "#fa5600", "#ff5c5c"];
	this.speed = 3;
	this.direction = DIRECTION_UP;
	this.next_direction = DIRECTION_UP;
	this.mode = 0;
	this.eaten = false;
	this.jail_local = [12, 7];
	this.blink = false;
	this.last_blink = 0;
	this.image = new Image();
	this.image.src = "Ghost" + (this.ghost_num + 1) + ".png";
	
	// Initial positions:
	this.x = 34 * (10 + this.ghost_num);
	this.y = 34 * 7;

	this._base_process = this.process;
	this.process = function()
	{
		this._base_process();

		if (this.eaten)
		{
			if (this.on_boundry)
			{
				this.movement_path = this.find_path(this.jail_local[0],
						this.jail_local[1]);
				this.set_next_direction();
				if (this.map_x == this.jail_local[0]
						&& this.map_y == this.jail_local[1])
				{
					this.eaten = false;
				}
			}
			return;
		}

		if (p.player.power)
		{
			var tgt = this.get_run_away_coords();
			this.movement_path = this.find_path(tgt[0], tgt[1]);
			this.set_next_direction();
			if (Date.now() >= this.last_blink + 1500
					&& Date.now()
					> p.player.power_time + p.player.power_duration - 2000)
			{
				this.blink = !this.blink;
			}
		}
		else
		{
			switch (this.ghost_num)
			{
				case 0:
					this.process_red();
					break;
				case 1:
					// Wonders at random until within 7 map tiles of the player, then
					// chases.
					this.process_green();
					break;
				case 2:
					// Wonders randomly forever.
					this.process_orange();
					break;
				case 3:
					// Trys to stay as far away from the player as possible.
					this.process_pink();
					break;
			}
		}

		// Check if player has eaten me
		var player_distance = Math.sqrt(Math.pow(p.player.x - this.x, 2)
				+ Math.pow(p.player.y - this.y, 2));
		if (player_distance < 17 && p.player.power)
		{
			var ptVal = Math.pow(2, p.player.ghosts_eaten) * 100 ;
			p.player.ghosts_eaten += 1;
			p.score += ptVal;
			this.eaten = true;
			p.animations.push(new GhostEatenAnimation(this, ptVal));
		}
		else if (player_distance < 17 && !p.player.power)
		{
			p.player.dead = true;
			--p.lives;
			Player.call(p.player);
			Ghost.ghost_num = 0;
			for (var i = 0; i < 4; ++i)
			{
				Ghost.call(p.ghosts[i]);
			}
			if (p.lives <= 0)
			{
				// Reset ghost_num here because PacDoge() constructor will reinit
				// all the ghosts again.
				Ghost.ghost_num = 0;
				PacDoge.call(p);
				p.game_running = true;
				p.animations[0] = new GameOverAnimation(p.canvas);
			}
			else
			{
				p.animations.push(new PlayerDeadAnimation(p.canvas));
			}
		}
	}

	this.normalize_coords = function(input_coords)
	{
		var rval = input_coords;
		if (p.map.data[rval[0] + rval[1] * p.map.tile_width] == 1)
		{
			if (!p.map.data[rval[0] + rval[1] * p.map.tile_width + 1])
			{
				rval[0] += 1;
			}
			else if (!p.map.data[rval[0] + rval[1] * p.map.tile_width - 1])
			{
				rval[0] -= 1;
			}
			else if (!p.map.data[rval[0] + (rval[1] + 1) * p.map.tile_width])
			{
				rval[1] += 1;
			}
			else if (!p.map.data[rval[0] + (rval[1]- 1) * p.map.tile_width])
			{
				rval[1] -= 1;
			}
			else
			{
				alert("Couldn't find open space starting from " + rval[0] 
						+ ", " + rval[1] + ".");
			}
		}
		return rval;
	}

	this.get_run_away_coords = function()
	{
		var rval = [];
		if (p.player.map_x < 12)
		{
			rval[0] = 24;
		}
		else
		{
			rval[0] = 1;
		}
		if (p.player.map_y < 7)
		{
			rval[1] = 14;
		}
		else
		{
			rval[1] = 1;
		}

		rval = this.normalize_coords(rval);

		return rval;
	}

	this.draw_current_path = function()
	{
		if (typeof(this.movement_path) == "undefined")
		{
			return;
		}
		var ctx = document.getElementsByTagName("canvas")[0].getContext('2d');
		ctx.beginPath();
		ctx.strokeStyle = this.color_array[this.ghost_num];
		ctx.moveTo(this.map_x * 34 + 8 + 17, this.map_y * 34 + 3 + 17);
		for (var i = 0 ; i < this.movement_path.length; ++i)
		{
			var x = 8 + 17 + (this.movement_path[i] % p.map.tile_width) * 34;
			var y = 3 + 17
					+ Math.floor(this.movement_path[i] / p.map.tile_width) * 34;
			ctx.lineTo(x, y);
		}
		ctx.stroke();
	}

	this.map_coords_to_offset = function(x, y)
	{
		return x + y * p.map.tile_width;
	}

	this.set_next_direction = function()
	{
		var next_tile = this.movement_path.splice(0, 1);
		var x = next_tile % p.map.tile_width;
		var y = Math.floor(next_tile / p.map.tile_width);
		if (x > this.map_x)
		{
			this.next_direction = DIRECTION_RIGHT;
		}
		else if (x < this.map_x)
		{
			this.next_direction = DIRECTION_LEFT;
		}
		else if (y < this.map_y)
		{
			this.next_direction = DIRECTION_UP;
		}
		else if (y > this.map_y)
		{
			this.next_direction = DIRECTION_DOWN;
		}
	}

	this.find_path = function(t_x, t_y)
	{
		this.convert_coord_screen_to_map();
		this.distance = [];
		this.previous = [];
		for (var i = 0; i < p.map.data.length; ++i)
		{
			this.distance.push(999999);
			this.previous.push(null);
		}
		this.distance[this.map_coords_to_offset(this.map_x, this.map_y)] = 0;
		var Q = [];
		for (var i = 0; i < p.map.data.length; ++i)
		{
			Q.push(1);
		}
		while (Q.length > 0)
		{
			var u_i = 0;
			for (var i = 0; i < this.distance.length; ++i)
			{
				if (this.distance[i] < this.distance[u_i] && Q[i] == 1)
				{
					u_i = i;
				}
			}
			// debug_path_map_plot(u_i);
			var u = p.map.data[u_i];
			Q[u_i] = 0;
			if (this.distance[u_i] == 999999) break;
			var nl = [];
			// The one above...
			if (p.map.data[u_i - p.map.tile_width] != 1)
			{
				nl.push(u_i - p.map.tile_width);
			}
			// ...below
			if (p.map.data[u_i + p.map.tile_width] != 1)
			{
				nl.push(u_i + p.map.tile_width);
			}
			// to the right...
			if (p.map.data[u_i + 1] != 1)
			{
				nl.push(u_i + 1);
			}
			// to the left...
			if (p.map.data[u_i - 1] != 1)
			{
				nl.push(u_i - 1);
			}
			for (var i = 0; i < nl.length; ++i)
			{
				var alt = this.distance[u_i] + 1;
				if (alt < this.distance[nl[i]])
				{
					this.distance[nl[i]] = alt;
					this.previous[nl[i]] = u_i;
					// decrease-key v in Q ??? - huh? I don't think we need this
					// since we just do a linear search anyway...
				}
			}
		}

		var path = [];
		u = this.map_coords_to_offset(t_x, t_y);
		while (this.previous[u] != null)
		{
			path.splice(0, 0, u);
			u = this.previous[u];
		}
		return path;
	}

	this.process_red = function()
	{
		// Searches out the shortest path to the player's next junction.
		if (this.on_boundry)
		{
			var d_x = (p.player.direction == DIRECTION_LEFT) * -1
					+ (p.player.direction == DIRECTION_RIGHT) * 1;
			var d_y = (p.player.direction == DIRECTION_UP) * -1
					+ (p.player.direction == DIRECTION_DOWN) * 1
			// Make sure the player's current coords are up to date.
			p.player.convert_coord_screen_to_map();
			var tgt_x = p.player.map_x + d_x;
			var tgt_y = p.player.map_y + d_y;
			var tgt_tile = p.map.data[tgt_x + tgt_y * p.map.tile_width];
			while (tgt_tile == 0)
			{
				tgt_x += d_x;
				tgt_y += d_y;
				tgt_tile = p.map.data[tgt_x + tgt_y * p.map.tile_width];
			}
			// We found the wall, now back it up one.
			tgt_x -= d_x;
			tgt_y -= d_y;
			this.movement_path = this.find_path(tgt_x, tgt_y);
			this.set_next_direction();
		}
	}

	this.process_green = function()
	{
		var distance_from_player = Math.sqrt(Math.pow(p.player.map_x - this.map_x,
				2) + Math.pow(p.player.map_y - this.map_y, 2));
		if (distance_from_player <= 7)
		{
			var tgt = [ p.player.map_x, p.player.map_y ];
			this.old_mode = this.mode;
			this.mode = GHOST_CHASE;
		}
		else
		{
			var tgt = [ Math.floor(Math.random() * (p.map.tile_width - 2)) + 1,
					Math.round(Math.random() * (p.map.tile_height - 2)) + 1 ];
			tgt = this.normalize_coords(tgt);
		}
		if (this.on_boundry)
		{
			this.movement_path = this.find_path(tgt[0], tgt[1]);
			this.set_next_direction();
		}
	}

	this.process_orange = function()
	{
		if (typeof(this.goal) == 'undefined' || this.goal == null)
		{
			this.goal = [ Math.floor(Math.random() * (p.map.tile_width - 2)) + 1,
					Math.floor(Math.random() * (p.map.tile_height - 2)) + 1 ];
			this.goal = this.normalize_coords(this.goal);
		}
		else
		{
			if (this.on_boundry)
			{
				if (this.goal[0] == this.map_x && this.goal[1] == this.map_y)
				{
					this.goal = null;
				}
				else
				{
					this.movement_path = this.find_path(this.goal[0], this.goal[1]);
					this.set_next_direction();
				}
			}
		}
	}

	this.process_pink = function()
	{
		if (this.on_boundry)
		{
			var run_away_coords = this.get_run_away_coords();
			this.movement_path = this.find_path(run_away_coords[0],
					run_away_coords[1]);
			this.set_next_direction();
		}
	}

	this.render = function(c)
	{
		var ctx = c.getContext('2d');
		var srcX = 0;

		if (this.eaten)
		{
			ctx.globalAlpha = 0.25;
		}
		else
		{
			ctx.globalAlpha = 1.0;
		}
		if (p.player.power)
		{
			srcX = 34 * !this.blink;
		}
		ctx.drawImage(this.image, srcX, 0, 34, 34, this.x + 8, this.y + 3,
				34, 34);
		ctx.globalAlpha = 1;
	}
}

Ghost.prototype = new GameObject();
Ghost.ghost_num = 0;

function Player()
{
	GameObject.call(this);
	this.map_x = 11;
	this.map_y = 9;
	this.convert_coord_map_to_screen();
	this.open = false;
	this.last_open_change = 0;
	this.direction = DIRECTION_LEFT; 
	this.next_direction = DIRECTION_LEFT;
	this.speed = 5;
	this.image = new Image();
	this.image.src = 'doge_sprite.png';
	// Is the power pill effect active?
	this.power = false;
	// When did the power pill effect activate?
	this.power_time = 0;
	// How long should the power pill effect last? (ms)
	this.power_duration = 8000;
	// How many ghosts have I eaten this go?
	this.ghosts_eaten = 0;
	// Am I dead?
	this.dead = false;

	this._base_render = this.render;
	this._base_process = this.process;

	this.process = function()
	{
		// Process power pill.
		if (this.power)
		{
			if (Date.now() >= this.power_time + this.power_duration)
			{
				this.power = false;
				this.ghosts_eaten = 0;
				for (var i = 0 ; i < p.ghosts.length; ++i)
				{
					p.ghosts[i].blink = false;
				}
			}
		}

		// The mouth open animation
		if (Date.now() >= this.last_open_change + 150)
		{
			this.last_open_change = Date.now();
			this.open = !this.open;
		}

		// Pac the dot that's on this square
		var dot_local = Math.round(this.x / 34) + Math.round(this.y / 34)
				* p.map.tile_width;
		var dot_here = p.map.dots[dot_local];
		if (dot_here == 0)
		{
			p.map.dots[dot_local] = 1;
			p.map.total_dots -= 1;
			p.score += 10;
		}
		else if (dot_here == 2) // Power pill!
		{
			p.player.power = true;
			p.player.power_time = Date.now();
			p.map.dots[dot_local] = 1;
			p.map.total_dots -= 1;
			p.score += 50;
		}
		if (p.map.total_dots == 0)
		{
			var old_level = p.level;
			var old_score = p.score;
			PacDoge.call(p);
			p.score = old_score;
			p.level = old_level + 1;
			p.animations = [ new VictoryAnimation(p.canvas) ];
		}

		this._base_process();
	}

	this.render = function(canvas)
	{
		if (!this.power)
		{
			this.direction += 4 * this.open;
			this._base_render(canvas);
			this.direction -= 4 * this.open;
		}
		else
		{
			var workspace = document.createElement('canvas');
			var wctx = workspace.getContext('2d');
			var wimg_data = null;

			workspace.setAttribute('width', '34');
			workspace.setAttribute('height', '34');

			wctx.fillStyle = "#ffffff";
			wctx.fillRect(0,0,34,34);
			wctx.drawImage(this.image, (this.direction + 4 * this.open) * 34, 0,
					34, 34, 0, 0, 34, 34);

			wimg_data = wctx.getImageData(0, 0, 34, 34);
			for (var y = 0; y < 34; ++y)
			{
				for (var x = 0; x < 34; ++x)
				{
					var delta_wave = Math.cos((Date.now() + y * 8 + x) / 100)
							* 64 + 127;
					if (wimg_data.data[(x * 4) + (y * 34) * 4] != 255 &&
							wimg_data.data[(x * 4) + (y * 34) * 4 + 1] != 255 &&
							wimg_data.data[(x * 4) + (y * 34) * 4 + 2] != 255)
					{
						wimg_data.data[(x * 4) + (y * 34) * 4] =
								255 - wimg_data.data[(x * 4) + (y * 34) * 4] + delta_wave;
						wimg_data.data[(x * 4) + (y * 34) * 4 + 1] =
								255 - wimg_data.data[(x * 4) + (y * 34) * 4] + delta_wave;
						//wimg_data.data[(x * 4) + (y * 34) * 4 + 2] =
						//		255 + wimg_data.data[(x * 4) + (y * 34) * 4] + delta_wave % 255;
					}
				}
			}
			var ctx = canvas.getContext('2d');
			ctx.putImageData(wimg_data, this.x + 8, this.y + 3);
		}
	}
}

Player.prototype = new GameObject();

function PacDoge()
{
	Ghost.ghost_num = 0;
	this.player = new Player();
	this.ghosts = [new Ghost(), new Ghost(), new Ghost(), new Ghost()];
	this.score = 0;
	this.level = 1;
	this.map = new Map();
	this.canvas = document.getElementsByTagName('canvas')[0];
	this.ctx = null;
	this.game_running = true;
	this.lives = 3;
	this.animations = [ new StartGameAnimation(this.canvas) ];

	this.render = function()
	{
		if (this.canvas == null)
		{
			this.canvas = document.getElementsByTagName('canvas')[0];
		}
		if (this.ctx == null)
		{
			this.ctx = this.canvas.getContext('2d');
		}
		this.ctx.fillStyle = "#000000";
		this.ctx.fillRect(0, 0, this.canvas.width, 20);
		this.ctx.fillRect(0, 0, 20, this.canvas.height);
		this.ctx.fillRect(this.canvas.width - 20, 0, 20, this.canvas.height);
		this.ctx.fillRect(0, this.canvas.height - 20, this.canvas.width, 20);
		this.map.render(this.canvas);
		this.player.render(this.canvas);
		for (var i = 0; i < 4; ++i)
		{
			this.ghosts[i].render(this.canvas);
		}
		for (var i = 0; i < this.animations.length; ++i)
		{
			this.animations[i].render(this.ctx);
		}
		this.ctx.font = "12pt ComicSansMS";
		this.ctx.textBaseline = "top";
		this.ctx.textAlign = "right";
		this.ctx.fillStyle = "#ffffff";
		this.ctx.fillText(this.score + "", this.canvas.width,
				0);
	}

	this.process = function()
	{
		var blocking = false;
		for (var i = 0; i < this.animations.length; ++i)
		{
			if (this.animations[i].done)
			{
				this.animations.splice(i, 1);
				--i;
				continue;
			}
			if (this.animations[i] instanceof BlockingAnimation)
			{
				blocking = true;
				this.animations[i].processNextFrame();
				break;
			}
			this.animations[i].processNextFrame();
		}
		if (!blocking)
		{
			this.map.process();
			this.player.process();
			for (var i = 0; i < this.ghosts.length; ++i)
			{
				this.ghosts[i].process();
			}
		}
	}

	this.loop_iterate = function()
	{
		if (this.game_running)
		{
			var start_time = Date.now();
			this.process();
			this.render();
			// simple framerate limiter.
			var next_frame_time = start_time + 33;
			var time_to_wait = next_frame_time - Date.now();
			// debug_update_directions();
			setTimeout("p.loop_iterate();", time_to_wait);
		}
	}
}

function do_init()
{
	document.body.onkeydown = on_key_press;
	p = new PacDoge();
	p.render();
	p.game_running = true;
	p.loop_iterate();
}

function debug_update_directions()
{
	var var_names = ["L", "U", "R", "D"];
	debug_update('direction', var_names[p.player.direction])
	debug_update('next_direction', var_names[p.player.next_direction])
}

function on_key_press(e)
{
	// UP
	if (e.which == 38)
	{
		p.player.next_direction = DIRECTION_UP;
	}
	// DOWN
	else if (e.which == 40)
	{
		p.player.next_direction = DIRECTION_DOWN;
	}
	// LEFT
	else if (e.which == 37)
	{
		p.player.next_direction = DIRECTION_LEFT;
	}
	// RIGHT
	else if (e.which == 39)
	{
		p.player.next_direction = DIRECTION_RIGHT;
	}
	else if (e.which == 32)
	{
		if (p.animations[0] instanceof SpaceBarFullScreenAnimation)
		{
			p.animations.splice(0, 1);
			p.game_running = true;
		}
	}
	else
	{
		return true;
	}
	return false;
}

function on_key_up(e)
{
	p.player.next_direction = p.player.direction;
}
