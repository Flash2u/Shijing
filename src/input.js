import events from 'events';
import InputHandler from './input_handler';
import Cursor from './cursor';

class Input extends events.EventEmitter {

	constructor(renderer) {
		super();

		this.ctx = renderer.ctx;
		this.renderer = renderer;
		this.cursor = renderer.caret;
		this.inputHandler = new InputHandler(this);
		this.mousedown = false;
		this.dragging = false;

		renderer.selection.addCursor(this.cursor);

		this.cursor.on('update', function() {
			this.inputHandler.setCursorPosition(this.cursor.caret.x, this.cursor.caret.y);
			this.inputHandler.focus();
		}.bind(this));

		// Set cursor position
		var newCursor = new Cursor(renderer);
		this.ctx.$origin[0].addEventListener('mousedown', function(e) {
			this.cursor.setEnd(null, null);
			this.cursor.setPositionByAxis(e.clientX, e.clientY);
			this.cursor.show();
			this.mousedown = true;
		}.bind(this), false);

		this.ctx.$origin[0].addEventListener('mousemove', function(e) {
			if (this.mousedown) {
				this.dragging = true;
				this.emit('dragging');
				newCursor.setPositionByAxis(e.clientX, e.clientY);
				this.cursor.setEnd(newCursor.startNode, newCursor.startOffset);
			}
		}.bind(this), false);

		this.ctx.$origin[0].addEventListener('mouseup', function(e) {
			this.mousedown = false;
			this.dragging = false;
			console.log(newCursor.startNode, newCursor.startOffset);
			this.cursor.show();
		}.bind(this), false);
	}
}

export default Input;
