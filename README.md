# matcher

## A Memory Assessment

This is the repo for my game "A Memory Assessment" ([live](https://corncycle.com/a-memory-assessment)), built using [three.js](https://threejs.org/) for rendering, [cannon.js](https://schteppe.github.io/cannon.js/) for physics, and [howler.js](https://howlerjs.com/) for audio. This project was built in Typescript (with Typescript-relevant forks of the previously mentioned libraries), with a directory structure scaffolded by following some of the [three.js Typescript tutorials](https://sbcode.net/threejs/) at [sbcode.net](https://sbcode.net/).

By entering `window.DEV_COMMANDS()` into the console of your browser, you can enable dev commands by pressing some new keys. These commands are as follows:

`m` - Load the menu

`[` - Show `cannon.js` bodies

`]` - Move the camera outside of the room (only when viewing the menu)

`t` - Trigger the slide-out animation

`y` - Trigger the fade-in animation

`z` - Show `three.js` stats panel

`1, 2, etc...` - Load the level for the given number (timers may get misconfigured by forcibly loading levels in quick succession)

# Assets

All assets used in this project are used under the CC0 license, and attributed here:

### Textures

[Calacatta Cremo Marble](https://cc0-textures.com/t/st-calacatta-cremo-marble), from [cc-0-textures.com](https://cc0-textures.com/)

[Fabric 111](https://cc0-textures.com/t/st-fabric-111), from [cc-0-textures.com](https://cc0-textures.com/)

[Decorative Wallpaper 17](https://cc0-textures.com/t/st-decorative-wallpaper-17), from [cc-0-textures.com](https://cc0-textures.com/)

[Wallpaper 12](https://cc0-textures.com/t/st-wallpaper-12), from [cc-0-textures.com](https://cc0-textures.com/)

[Wallpaper 9](https://cc0-textures.com/t/st-wallpaper-9), from [cc-0-textures.com](https://cc0-textures.com/)

Many textures from the [Tiny Texture Pack 2](https://screamingbrainstudios.itch.io/tiny-texture-pack-2), by Screaming Brain Studios

[Red Carpet](https://purepng.com/photo/20996/objects-carpet), from [purepng.com](https://purepng.com/)

[Blue Carpet](https://purepng.com/photo/20985/objects-carpet), from [purepng.com](https://purepng.com/)

### Models

[Fruit Models](https://styloo.itch.io/food), by styloo

[Minotaur Bust Statue](https://sketchfab.com/3d-models/43450-nma-minotaur-279c632816374d0c89e78709155ed037), a scan of [a statue found in Plaka, Athens](https://www.namuseum.gr/en/monthly_artefact/the-face-of-the-beast-asterion-the-minotaur/). Scanned by the group "Scan The World."

[Armchair](https://poly.pizza/m/myd1WSucAz), by CreativeTrio

[Couch](https://poly.pizza/m/ZAezzWDcmU), by CreativeTrio

[Dresser](https://poly.pizza/m/Ud8QR8Ku9e), by CreativeTrio

[Grandfathers Clock](https://poly.pizza/m/09YKIkFZnA), by CreativeTrio

[Chandelier](https://poly.pizza/m/RPLTkXHOOM), by CreativeTrio

[Night Stand](https://poly.pizza/m/9LI73c5uFA), by Quaternius

[Light Stand](https://poly.pizza/m/9L6lLUl9sD), by Quaternius

### Audio

[Jersey Bounce Cover](https://www.youtube.com/watch?v=dXOk56jyc7Y), by New York Lounge Quartett (this does not fall under the CC0 license)

Various sound effects from [The Essential Retro Video Game Sound Effects Collection](https://opengameart.org/content/512-sound-effects-8-bit-style), by Juhani Junkala

### Miscellaneous

[Character Animations](https://dani-maccari.itch.io/player-animations-tim), by DANI MACCARI (for use in the "How to Play" menu)

[Fruit Icons](https://iconduck.com/sets/food-icons/categories/fruit), by Jordan Irwin (for use in the "How to Play" menu)

# Building Locally

To build and edit this game locally, first make sure to have npm and a Node.js runtime installed. You will probably also need Typescript globally installed in npm. Then clone this repository and run `npm install` in the root directory.

Run `npm run dev` to host the game at `http://localhost:8080/`, and files will be live-reloaded upon saving.

Run `npm run build` to build a minified `bundle.js` of the game in the `dist` directory.
