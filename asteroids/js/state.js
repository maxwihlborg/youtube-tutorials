/**
 * State class, super clas not meant to be used directly
 */
var State = Class.extend({

	/**	
	 * Contstrutor
	 * 
	 * @param  {Game} game manager for the state
	 */
	init: function(game) {
		// create field to state manager
		this.game = game;
	},

	/**
	 * React to pressed keys, called before the update  method
	 * 
	 * @param  {InputHandeler} input keeps track of all pressed keys
	 */
	handleInputs: function(input) {
		return void 0;
	},

	/**	
	 * Called when state is updated
	 */
	update: function() {
		return void 0;
	},

	/**
	 * Render the state to a canavas
	 * 
	 * @param  {context2d} ctx augmented drawing context
	 */
	render: function(ctx) {
		return void 0;
	}
});