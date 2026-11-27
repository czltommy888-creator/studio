# CHEN lanyard

The native model is bundled from the owner's `D:/作品集/CHEN-lanyard/Lanyard.jsx`
and its supplied Three.js modules. The original project is unchanged.

`model.js` externalizes React and its JSX runtime to reuse the website's React.
Its renderer uses an alpha channel and no scene background. Cleanup also releases
the WebGL context after disposing resources. `model.css` is scoped to the overlay
through an inline style that unmounts with it. The entry spring is in
`../contact-card.css` and starts when the canvas mounts, including on first load.

The original front and back artwork remain in `front.png` and `back.png`.
Three.js is MIT licensed; see `THREE-LICENSE.txt`.
