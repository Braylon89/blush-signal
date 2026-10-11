# BLUSH // SIGNAL

A little browser synth by Braylon. Pink and chrome on the outside; mellow, woozy, slightly fuzzy sounds on the inside.

**[Play the synth →](https://braylon89.github.io/blush-signal/)**

## Make a sound

Tap the piano keys or use **A W S E D F T G Y H U J K O L P ;** on your computer keyboard. Hold more than one key to play together. Choose single notes, minor 7 chords, or major 7 chords. Change octaves for lower bass or higher keys.

Four original presets explore hazy bedroom-pop textures:

- **Pink Haze** — detuned analog chords with chorus and a warm room
- **Bedroom Keys** — soft triangle keys, tape wobble, and gentle saturation
- **Slow Orbit** — a slowly opening pad with a long tail
- **Fuzzy Heart** — rounded square-wave bass with a lower sine oscillator

Drag the chrome dials up or down, use the sliders below them, or adjust them with the arrow keys. Tone, detune, fade-in, tail, chorus, tape, fuzz, room, echo, and volume change the sound.

## Make a loop

Tap the grid to choose one note per step. Tap it again to remove it. Change the root, tempo, and swing, or use **Surprise me** for a new melody. Play Loop starts the 16-step pattern. Space toggles the loop when the page is focused outside a form control. Escape or All Notes Off stops it. Playback stops when you leave the tab.

**Save my sound** keeps your patch and pattern on this device. **Export WAV** makes a stereo WAV with four repeats and the effect tail, ready to use elsewhere. Export renders locally in your browser.

No samples, plugins, microphone access, accounts, or build dependencies. All sound is synthesized with Web Audio. Nothing plays until you tap a key or Play Loop.

## Run locally

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767`. The same static files work on GitHub Pages.

- `engine.mjs` — notes, chord voicings, swing timing, saved-data normalization, and WAV encoding
- `audio.mjs` — oscillators, envelopes, effects, polyphony, and offline audio export
- `synth.mjs` — keyboard, sequencer, controls, and visualizer
- `index.html` / `style.css` — the little sound machine
