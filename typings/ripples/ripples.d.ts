// Type definitions for Bootstrap Material Design Ripples.js
// Project: https://github.com/FezVrasta/bootstrap-material-design
// Definitions by: Robert Parker <https://github.com/hsrob/>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="../jquery/jquery.d.ts"/>
interface MaterialOptions{
	withRipples : string,
	inputElements : string,
	checkboxElements : string,
	radioElements : string	
}

interface Material {
	/**
	 * Calls ripples(), input(), checkbox(), and radio()
	 */
	init() : void,
	/**
	 * Apply ripples.js to the default elements
	 */
	ripples() : void,
	/**
	 * Enable the MD styles for text inputs, and other kinds of inputs (number, email, file, etc.)
	 */
	input() : void,
	/**
	 * Enable the MD styles for checkboxes (remember to follow the markup guidelines)
	 * @example <div class="radio/checkbox radio-primary">
				    <label>
				        <input type="radio/checkbox" checked>
				        Option one is this
				    </label>
				</div>
	 */
	checkbox() : void,
	radio() : void
}

interface JQueryStatic {
	material : Material;
}

declare module "ripples" {
}
