/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { KeyCode, KeyMod } from 'vs/base/common/keyCodes';
import { escapeRegExpCharacters } from 'vs/base/common/strings';
import { ICodeEditor } from 'vs/editor/browser/editorBrowser';
import { EditorAction, EditorCommand, ServicesAccessor } from 'vs/editor/browser/editorExtensions';
import { EditorContextKeys } from 'vs/editor/common/editorContextKeys';
import { MessageController } from 'vs/editor/contrib/message/messageController';
import * as nls from 'vs/nls';
import { ContextKeyExpr } from 'vs/platform/contextkey/common/contextkey';
import { KeybindingWeight } from 'vs/platform/keybinding/common/keybindingsRegistry';
import { CodeActionController } from './codeActionController';
import { SUPPORTED_CODE_ACTIONS } from './codeActionModel';
import { CodeActionAutoApply, CodeActionFilter, CodeActionKind } from './codeActionTrigger';

function contextKeyForSupportedActions(kind: CodeActionKind) {
	return ContextKeyExpr.regex(
		SUPPORTED_CODE_ACTIONS.keys()[0],
		new RegExp('(\\s|^)' + escapeRegExpCharacters(kind.value) + '\\b'));
}

function showCodeActionsForEditorSelection(
	editor: ICodeEditor,
	notAvailableMessage: string,
	filter?: CodeActionFilter,
	autoApply?: CodeActionAutoApply
) {
	if (!editor.hasModel()) {
		return;
	}

	const controller = CodeActionController.get(editor);
	if (!controller) {
		return;
	}

	const pos = editor.getPosition();
	controller.triggerFromEditorSelection(filter, autoApply).then(codeActions => {
		if (!codeActions || !codeActions.length) {
			MessageController.get(editor).showMessage(notAvailableMessage, pos);
		}
	});
}

export class QuickFixAction extends EditorAction {

	static readonly Id = 'editor.action.quickFix';

	constructor() {
		super({
			id: QuickFixAction.Id,
			label: nls.localize('quickfix.trigger.label', "Quick Fix..."),
			alias: 'Quick Fix',
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyCode.US_DOT,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.quickFix.noneMessage', "No code actions available"));
	}
}


class CodeActionCommandArgs {
	public static fromUser(arg: any, defaults: { kind: CodeActionKind, apply: CodeActionAutoApply }): CodeActionCommandArgs {
		if (!arg || typeof arg !== 'object') {
			return new CodeActionCommandArgs(defaults.kind, defaults.apply, false);
		}
		return new CodeActionCommandArgs(
			CodeActionCommandArgs.getKindFromUser(arg, defaults.kind),
			CodeActionCommandArgs.getApplyFromUser(arg, defaults.apply),
			CodeActionCommandArgs.getPreferredUser(arg));
	}

	private static getApplyFromUser(arg: any, defaultAutoApply: CodeActionAutoApply) {
		switch (typeof arg.apply === 'string' ? arg.apply.toLowerCase() : '') {
			case 'first': return CodeActionAutoApply.First;
			case 'never': return CodeActionAutoApply.Never;
			case 'ifsingle': return CodeActionAutoApply.IfSingle;
			default: return defaultAutoApply;
		}
	}

	private static getKindFromUser(arg: any, defaultKind: CodeActionKind) {
		return typeof arg.kind === 'string'
			? new CodeActionKind(arg.kind)
			: defaultKind;
	}

	private static getPreferredUser(arg: any): boolean {
		return typeof arg.preferred === 'boolean'
			? arg.preferred
			: false;
	}

	private constructor(
		public readonly kind: CodeActionKind,
		public readonly apply: CodeActionAutoApply,
		public readonly preferred: boolean,
	) { }
}

export class CodeActionCommand extends EditorCommand {

	static readonly Id = 'editor.action.codeAction';

	constructor() {
		super({
			id: CodeActionCommand.Id,
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			description: {
				description: `Trigger a code action`,
				args: [{
					name: 'args',
					schema: {
						'type': 'object',
						'required': ['kind'],
						'properties': {
							'kind': {
								'type': 'string'
							},
							'apply': {
								'type': 'string',
								'default': 'ifSingle',
								'enum': ['first', 'ifSingle', 'never']
							}
						}
					}
				}]
			}
		});
	}

	public runEditorCommand(_accessor: ServicesAccessor, editor: ICodeEditor, userArg: any) {
		const args = CodeActionCommandArgs.fromUser(userArg, {
			kind: CodeActionKind.Empty,
			apply: CodeActionAutoApply.IfSingle,
		});
		return showCodeActionsForEditorSelection(editor, nls.localize('editor.action.quickFix.noneMessage', "No code actions available"),
			{
				kind: args.kind,
				includeSourceActions: true,
				onlyIncludePreferredActions: args.preferred,
			},
			args.apply);
	}
}


export class RefactorAction extends EditorAction {

	static readonly Id = 'editor.action.refactor';

	constructor() {
		super({
			id: RefactorAction.Id,
			label: nls.localize('refactor.label', "Refactor..."),
			alias: 'Refactor',
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KEY_R,
				mac: {
					primary: KeyMod.WinCtrl | KeyMod.Shift | KeyCode.KEY_R
				},
				weight: KeybindingWeight.EditorContrib
			},
			menuOpts: {
				group: '1_modification',
				order: 2,
				when: ContextKeyExpr.and(
					EditorContextKeys.writable,
					contextKeyForSupportedActions(CodeActionKind.Refactor)),
			},
			description: {
				description: 'Refactor...',
				args: [{
					name: 'args',
					schema: {
						'type': 'object',
						'properties': {
							'kind': {
								'type': 'string'
							},
							'apply': {
								'type': 'string',
								'default': 'never',
								'enum': ['first', 'ifSingle', 'never']
							}
						}
					}
				}]
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, userArg: any): void {
		const args = CodeActionCommandArgs.fromUser(userArg, {
			kind: CodeActionKind.Refactor,
			apply: CodeActionAutoApply.Never
		});
		return showCodeActionsForEditorSelection(editor,
			nls.localize('editor.action.refactor.noneMessage', "No refactorings available"),
			{
				kind: CodeActionKind.Refactor.contains(args.kind) ? args.kind : CodeActionKind.Empty,
				onlyIncludePreferredActions: args.preferred,
			},
			args.apply);
	}
}


export class SourceAction extends EditorAction {

	static readonly Id = 'editor.action.sourceAction';

	constructor() {
		super({
			id: SourceAction.Id,
			label: nls.localize('source.label', "Source Action..."),
			alias: 'Source Action',
			precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasCodeActionsProvider),
			menuOpts: {
				group: '1_modification',
				order: 2.1,
				when: ContextKeyExpr.and(
					EditorContextKeys.writable,
					contextKeyForSupportedActions(CodeActionKind.Source)),
			},
			description: {
				description: 'Source Action...',
				args: [{
					name: 'args',
					schema: {
						'type': 'object',
						'properties': {
							'kind': {
								'type': 'string'
							},
							'apply': {
								'type': 'string',
								'default': 'never',
								'enum': ['first', 'ifSingle', 'never']
							}
						}
					}
				}]
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor, userArg: any): void {
		const args = CodeActionCommandArgs.fromUser(userArg, {
			kind: CodeActionKind.Source,
			apply: CodeActionAutoApply.Never
		});
		return showCodeActionsForEditorSelection(editor,
			nls.localize('editor.action.source.noneMessage', "No source actions available"),
			{
				kind: CodeActionKind.Source.contains(args.kind) ? args.kind : CodeActionKind.Empty,
				includeSourceActions: true,
				onlyIncludePreferredActions: args.preferred,
			},
			args.apply);
	}
}

export class OrganizeImportsAction extends EditorAction {

	static readonly Id = 'editor.action.organizeImports';

	constructor() {
		super({
			id: OrganizeImportsAction.Id,
			label: nls.localize('organizeImports.label', "Organize Imports"),
			alias: 'Organize Imports',
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				contextKeyForSupportedActions(CodeActionKind.SourceOrganizeImports)),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Shift | KeyMod.Alt | KeyCode.KEY_O,
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return showCodeActionsForEditorSelection(editor,
			nls.localize('editor.action.organize.noneMessage', "No organize imports action available"),
			{ kind: CodeActionKind.SourceOrganizeImports, includeSourceActions: true },
			CodeActionAutoApply.IfSingle);
	}
}

export class FixAllAction extends EditorAction {

	static readonly Id = 'editor.action.fixAll';

	constructor() {
		super({
			id: FixAllAction.Id,
			label: nls.localize('fixAll.label', "Fix All"),
			alias: 'Fix All',
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				contextKeyForSupportedActions(CodeActionKind.SourceFixAll))
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return showCodeActionsForEditorSelection(editor,
			nls.localize('fixAll.noneMessage', "No fix all action available"),
			{ kind: CodeActionKind.SourceFixAll, includeSourceActions: true },
			CodeActionAutoApply.IfSingle);
	}
}

export class AutoFixAction extends EditorAction {

	static readonly Id = 'editor.action.autoFix';

	constructor() {
		super({
			id: AutoFixAction.Id,
			label: nls.localize('autoFix.label', "Auto Fix..."),
			alias: 'Auto Fix',
			precondition: ContextKeyExpr.and(
				EditorContextKeys.writable,
				contextKeyForSupportedActions(CodeActionKind.QuickFix)),
			kbOpts: {
				kbExpr: EditorContextKeys.editorTextFocus,
				primary: KeyMod.Alt | KeyMod.Shift | KeyCode.US_DOT,
				mac: {
					primary: KeyMod.CtrlCmd | KeyMod.Alt | KeyCode.US_DOT
				},
				weight: KeybindingWeight.EditorContrib
			}
		});
	}

	public run(_accessor: ServicesAccessor, editor: ICodeEditor): void {
		return showCodeActionsForEditorSelection(editor,
			nls.localize('editor.action.autoFix.noneMessage', "No auto fixes available"),
			{
				kind: CodeActionKind.QuickFix,
				onlyIncludePreferredActions: true
			},
			CodeActionAutoApply.IfSingle);
	}
}
