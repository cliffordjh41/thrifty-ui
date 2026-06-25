# Changelog

All notable changes to thrifty-ui are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/); versions follow semver.

## [0.1.0] — 2026-06-25

First public release.

### Added

- **`usePanelChrome`** — the host-agnostic panel-chrome primitive ("one panel,
  four hosts"): a panel's header/footer hoists into a host's slot when the host
  supplies `onHeader`/`onFooter`, or renders inline otherwise.
- **Shell** — `SlidableColumn` (draggable, off-edge-hideable columns),
  `ColumnToolBar`, `Sheet`, `Drawer`, `Popup`, `SlidingPanels`.
- **Theming** — `ThemeScope` / `useThemeRoot`, `ColorPanel` (with Undo +
  copy-CSS), `StylePanel`, `TypographyPanel`, `EffectsPanel`, `themeToCss`,
  `DEFAULT_THEME`, `THEME_PRESETS`, `generateTheme`.
- **Radix wrappers** — Dialog, AlertDialog, Popover, HoverCard, Select,
  Combobox, DropdownMenu, ContextMenu, Menubar, NavigationMenu, Tabs, Toolbar,
  Toggle, Form, and more.
- **Hooks** — `useAudioPlayer` (+ `subscribeFrequency`), `useAnchoredZoom`,
  `useMouseParallax`, `useSwipeDismiss`, `useRovingTabindex`,
  `useFocusOnChange`, `useViewTransition`, `usePanelChrome`.
- **`MusicPlayerPanel`** — showcase panel exercising the chrome primitive over
  the audio singleton + theme-coupled FFT visualizer.
- **Claude Code authoring stack** — `.claude/` rules + a `panel-from-template`
  skill for scaffolding panels against the chrome contract.

[0.1.0]: https://github.com/cliffordjh41/thrifty-ui/releases/tag/v0.1.0
