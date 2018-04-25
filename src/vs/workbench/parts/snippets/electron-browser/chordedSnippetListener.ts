/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

'use strict';

import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { Disposable } from 'vs/base/common/lifecycle';
import { IKeyboardEvent } from 'vs/base/browser/keyboardEvent';
import { KeyCode } from 'vs/base/common/keyCodes';

export class ChordedSnippetListener extends Disposable {
	private _activeKeys = {};
	private _chord = null;
	constructor(
		private _editor: ICodeEditor,
		private _onDetect: (length: number) => void
	) {
		super();
		this._register(_editor.onKeyDown(e => this.onKeyDown(e)));
		this._register(_editor.onKeyUp(e => this.onKeyUp(e)));
	}
	onKeyDown(e: IKeyboardEvent) {
		if (!this._allowed(e)) {
			return;
		}
		this._activeKeys[e.keyCode] = true;
		this._update();
	}
	onKeyUp(e: IKeyboardEvent) {
		if (!this._allowed(e)) {
			return;
		}
		delete this._activeKeys[e.keyCode];
		this._update();
	}
	_allowed(e: IKeyboardEvent): boolean {
		return (e.keyCode >= KeyCode.KEY_A && e.keyCode <= KeyCode.KEY_Z) ||
			(e.keyCode >= KeyCode.KEY_0 && e.keyCode <= KeyCode.KEY_9) ||
			e.keyCode === KeyCode.US_SEMICOLON ||
			e.keyCode === KeyCode.US_EQUAL ||
			e.keyCode === KeyCode.US_COMMA ||
			e.keyCode === KeyCode.US_MINUS ||
			e.keyCode === KeyCode.US_DOT ||
			e.keyCode === KeyCode.US_SLASH ||
			e.keyCode === KeyCode.US_OPEN_SQUARE_BRACKET ||
			e.keyCode === KeyCode.US_BACKSLASH ||
			e.keyCode === KeyCode.US_CLOSE_SQUARE_BRACKET ||
			e.keyCode === KeyCode.US_QUOTE;
	}
	private _update() {
		const column = this._editor.getPosition().column;
		const count = Object.keys(this._activeKeys).length;
		if (count > 0 && !this._chord) {
			this._chord = {
				length: count,
				startColumn: column
			};
		}
		if (this._chord) {
			this._chord.length = Math.max(this._chord.length, count);
			if (!count) {
				if (column - this._chord.startColumn === this._chord.length) {
					this._onDetect(this._chord.length);
				}
				this._chord = null;
			}
		}
	}
}
