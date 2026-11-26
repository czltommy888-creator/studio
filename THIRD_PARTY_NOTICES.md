# Image Trail sources

Adapted distance threshold, cached pointer interpolation and reveal / fade animation sequence from Codrops ImageTrailEffects, demo.js.

Copyright 2019 Codrops
https://github.com/codrops/ImageTrailEffects/blob/master/js/demo.js
https://tympanus.net/codrops/2019/08/07/image-trail-effects/

The original JavaScript header states MIT license. The repository README also supplies the following integration terms, retained here in full.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

“This resource can be used freely if integrated or build upon in personal or commercial projects such as websites, web apps and web templates intended for sale. It is not allowed to take the resource "as-is" and sell it, redistribute, re-publish it, or sell "pluginized" versions of it. Free plugins built using this resource should have a visible mention and link to the original work. Always consider the licenses of all included libraries, scripts and images used.”

https://github.com/codrops/ImageTrailEffects#license

CHEN_STUDIO integrates the animation into its portfolio with React lifecycle cleanup, GSAP 3, a fixed pool of eight nodes, decoded thumbnail preloading, category-aware data, and a Canvas heat field. The reference project's photographs and bundled older libraries are omitted.

Olivier Larose's tutorial was evaluated as an interaction reference. Its repository did not show an explicit license. No source or imagery was copied.
https://blog.olivierlarose.com/tutorials/mouse-image-gallery
https://github.com/olivierlarose/mouse-image-gallery

GSAP is installed through npm. Its package license is retained in node_modules/gsap/LICENSE.

## Data and deployment

The existing usePublishedPortfolio hook supplies the same filtered published works to the archive and trail. In dynamic mode, /api/works supplies published rows, /api/events triggers refreshes and a 20 second polling fallback reconnects. Existing /media/:id/thumb endpoints supply thumbnails. The module sends no pointer data or analytics.

The local Node / SQLite service supports live publishing. GitHub Pages is a static export and receives the latest published snapshot when redeployed. It cannot host the existing API. For public live synchronization, host the existing Node service and first-edition frontend together with the existing proxy routes. No backend or admin changes were made by this upgrade.
