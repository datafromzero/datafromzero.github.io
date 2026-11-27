// SPEC D42: the SQL editor (CodeMirror 6 with the SQL language package). Loaded on the first focus or Run of a block,
// never before; until then the block shows a plain textarea. Colors come from CSS variables (`--sql-*`, defined in
// src/styles/sql-runner.css for both themes), so the editor follows the site theme with no JavaScript for it.
import { Compartment, EditorState, Prec } from '@codemirror/state';
import { EditorView, drawSelection, highlightActiveLine, keymap, lineNumbers, placeholder } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentLess, indentMore } from '@codemirror/commands';
import { HighlightStyle, indentOnInput, syntaxHighlighting } from '@codemirror/language';
import { PostgreSQL, sql } from '@codemirror/lang-sql';
import { acceptCompletion, autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete';
import { tags as t } from '@lezer/highlight';

export interface Editor {
	get(): string;
	set(text: string): void;
	/** Adds a statement after what is there (or replaces a blank or comment-only editor). */
	add(text: string): void;
	focus(): void;
	/** Moves the caret to the end of the text. */
	end(): void;
}

const highlight = HighlightStyle.define([
	{ tag: [t.keyword, t.operatorKeyword, t.modifier], color: 'var(--sql-kw)' },
	{ tag: [t.string, t.special(t.string)], color: 'var(--sql-str)' },
	{ tag: [t.number, t.bool, t.null], color: 'var(--sql-num)' },
	{ tag: [t.lineComment, t.blockComment], color: 'var(--sql-com)', fontStyle: 'italic' },
	{ tag: [t.standard(t.name), t.function(t.variableName), t.typeName], color: 'var(--sql-fn)' },
	{ tag: [t.operator, t.punctuation, t.separator], color: 'var(--sql-op)' },
]);

const theme = EditorView.theme({
	'&': { color: 'var(--fg)', backgroundColor: 'transparent', fontSize: '0.8125rem', height: '100%' },
	'&.cm-focused': { outline: '2px solid var(--fg)', outlineOffset: '-2px' },
	'.cm-scroller': { fontFamily: 'var(--font-mono)', lineHeight: '1.6', overflow: 'auto' },
	'.cm-content': { padding: '0.75rem 0', caretColor: 'var(--fg)' },
	'.cm-line': { padding: '0 1rem 0 0.5rem' },
	'.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--fg)' },
	'.cm-gutters': { backgroundColor: 'transparent', color: 'var(--mute)', border: 'none', paddingLeft: '0.25rem' },
	'.cm-lineNumbers .cm-gutterElement': { padding: '0 0.5rem 0 0.25rem', minWidth: '1.5rem' },
	'.cm-activeLine': { backgroundColor: 'color-mix(in srgb, var(--fg) 6%, transparent)' },
	'.cm-selectionBackground, &.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground': {
		backgroundColor: 'color-mix(in srgb, var(--fg) 24%, transparent)',
	},
	'.cm-placeholder': { color: 'var(--mute)' },
	'.cm-tooltip': { border: '1px solid var(--dim)', backgroundColor: 'var(--bg)', color: 'var(--fg)', borderRadius: 'var(--radius-panel)' },
	'.cm-tooltip-autocomplete > ul': { fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' },
	'.cm-tooltip-autocomplete ul li[aria-selected]': { backgroundColor: 'var(--fg)', color: 'var(--bg)' },
	'.cm-completionDetail': { color: 'var(--mute)' },
});

export function mountEditor(
	parent: HTMLElement,
	opts: { doc: string; caret?: number; schema: Record<string, string[]>; label: string; onRun: () => void; onChange: () => void; onFocus?: () => void },
): Editor {
	// Tab indents, but must never trap a keyboard user: Escape, then Tab, moves focus on (WCAG 2.1.2).
	let leave = false;
	const tab = (run: (v: EditorView) => boolean) => (v: EditorView) => (leave ? false : run(v));
	const lang = new Compartment();
	const view = new EditorView({
		parent,
		state: EditorState.create({
			doc: opts.doc,
			selection: { anchor: Math.min(opts.caret ?? opts.doc.length, opts.doc.length) },
			extensions: [
				lineNumbers(),
				history(),
				drawSelection(),
				highlightActiveLine(),
				indentOnInput(),
				closeBrackets(),
				autocompletion({ activateOnTyping: true, icons: false, defaultKeymap: false }),
				lang.of(sql({ dialect: PostgreSQL, schema: opts.schema, upperCaseKeywords: true })),
				syntaxHighlighting(highlight),
				placeholder('Write your query here'),
				theme,
				EditorView.contentAttributes.of({ 'aria-label': opts.label, spellcheck: 'false', autocapitalize: 'off' }),
				EditorView.updateListener.of((u) => u.docChanged && opts.onChange()),
				EditorView.domEventHandlers({
					keydown(e) {
						if (e.key !== 'Escape' && e.key !== 'Tab' && !['Shift', 'Control', 'Meta', 'Alt'].includes(e.key)) leave = false;
					},
					focus() {
						leave = false;
						opts.onFocus?.();
					},
				}),
				Prec.highest(
					keymap.of([
						{
							key: 'Mod-Enter',
							run: () => {
								opts.onRun();
								return true;
							},
						},
					]),
				),
				keymap.of([
					...closeBracketsKeymap,
					// Enter always makes a new line (on a phone the suggestion list is nearly always open while typing and
					// Enter used to accept it, gluing "orders" to the next word). A suggestion is accepted with Tab, a tap
					// or the arrow keys then Tab; Escape closes the list.
					...completionKeymap.filter((k) => k.key !== 'Enter'),
					{ key: 'Tab', run: acceptCompletion },
					{ key: 'Tab', run: tab(indentMore), shift: tab(indentLess) },
					{
						key: 'Escape',
						run: () => {
							leave = true;
							return false;
						},
					},
					...defaultKeymap,
					...historyKeymap,
				]),
			],
		}),
	});
	const set = (text: string) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } });
	const end = () => view.dispatch({ selection: { anchor: view.state.doc.length }, scrollIntoView: true });
	return {
		get: () => view.state.doc.toString(),
		set,
		add(text) {
			const cur = view.state.doc.toString();
			const blank = !cur.replace(/--[^\n]*|\/\*[\s\S]*?\*\//g, '').trim();
			set(blank ? text : `${cur.replace(/\s+$/, '')}\n\n${text}`);
			end();
		},
		focus: () => view.focus(),
		end,
	};
}
