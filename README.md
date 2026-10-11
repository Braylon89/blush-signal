# BLUSH // SIGNAL

A little beat machine by Braylon. Pink and chrome on the outside; hazy synths, deep 808s, and dusty drums on the inside.

**[Make a beat →](https://braylon89.github.io/blush-signal/)**

## Start anywhere

Press **Play** and tap the 16-step grid. Each row is a separate sound: Dream keys, 808 bass, kick, snare, hi-hat, and clap. Layer them, change each volume, or use **M** to mute and **S** to solo. Hazy Starter and Dusty Bounce give you something to change; Empty Canvas starts fresh. Select a melodic row and a step, then choose its pitch below the grid. The four original synth presets are Pink Haze, Bedroom Keys, Slow Orbit, and Fuzzy Heart.

For a no-keyboard option, choose **Playground**. Tap or drag across the glowing bubbles to play musical notes. Use the Dream, Low End, Heartbeat, and Sparkle switches to shape the backing beat. **New star loop** starts the backing beat and writes your bubble taps into a visible 16-step melody. **Finish loop** keeps that melody repeating. **Record jam** captures the live mix; finish the take, listen back, and save it as WAV or MP3. The Write My Stars switch can also add notes to an existing loop. You can also play the synth with A S D F G H J K.

## Shape and combine sounds

Each row has its own **filter, fuzz, reverb, and tempo-synced echo**. Select its name to edit the effects, even while the beat plays. The 808 has a separate tail and grit control.

**Import sound** adds your own audio as a new row. Up to four imported sounds, 25 MB per file, with a maximum source length of two minutes. Audio decoding depends on your browser's supported formats; WAV and MP3 are good starting points. Imported rows have playback length (up to eight seconds), pitch, effects, and a Replace File option. Imports and saved projects stay on your device. They are never uploaded. **Save loop** saves the project and its imported files together in IndexedDB; Load Saved restores them. Your previous synth-only saved patch can also be loaded.

## Playback, recording, and export

- **Speed / BPM** changes the tempo from 50 to 160 BPM. Swing changes the groove.
- **Play for** chooses Forever, 1/4/8 loops, or a time limit from 0.1 to 30 minutes. Forever continues until you stop it; playback can continue in a background tab, subject to browser suspension or device sleep.
- **Record** captures the mixed audio and live playing without microphone access. Finish Take creates a playback preview. Save the take as WAV or MP3 with the format selector.
- **Export** renders 1, 4, or 8 repeats of all audible rows and their effects, including an effect tail. WAV is stereo PCM; MP3 is stereo at 192 kbps. Recorded takes retain the audio context's sample rate; rendered loops use 44.1 kHz.
- Space starts/stops playback outside form controls. Escape stops playback and recording.

All synthesis, effects, recording, import decoding, and export happen in the browser. There are no accounts or paid services.

## Run locally

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

Open `http://127.0.0.1:8767`. The static files also run on GitHub Pages. No build or install step is needed.

`beats.mjs` handles the layered project, scheduling data, validation, and saved-patch migration. `groove.mjs` mixes the synth, generated drums, 808, imported audio, and per-row effects. `audio.mjs` and `engine.mjs` contain the original synth and sound helpers. `synth.mjs` handles the interface, playback, recording, import, and project storage.

## MP3 encoder attribution

MP3 export uses the **unmodified [lamejs 1.2.1](https://github.com/zhuker/lamejs)** browser bundle, distributed separately as `lame.min.js` and used in `mp3-worker.js`. LAME is licensed under the LGPL. See `LICENSE-lamejs.txt` and `COPYING-lamejs.txt`. Upstream source is available from the linked repository and [LAME](https://lame.sourceforge.net/). The app's interface and synthesis code are separate from the encoder.
