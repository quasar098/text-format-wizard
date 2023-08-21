# text format wizard

*this project is under construction (feels like it always will be), but feel free to use at [quasar.name](https://quasar.name/text-format-wizard)*

## what this

text format issues begone!
gone are the days of ad-ridden poor-quality online tools! now you can do it in one place and in a more powerful manner.

## what about cyberchef?

i had no idea that cyberchef existed before making this<br>
this is not a replacement for cyberchef

## try now

it can be found at [quasar.name/text-format-wizard](https://quasar.name/text-format-wizard/)<br>
if it's not working, it's because my server crashed probably<br>
you can try cloning, running `npm i`, and then `npm run dev` and going to `http://localhost:5173` instead

## cool packages that i used

- uses [svelte](https://svelte.dev/), a front-end component framework
- uses [svrollbar](https://github.com/daylilyfield/svrollbar), a scrollbar component for svelte
- uses [svelte-css-vars](https://github.com/kaisermann/svelte-css-vars) for dynamic css in svelte
- uses [svelte-visibility-change](https://github.com/metonym/svelte-visibility-change) to detect visibility changes
- uses [fuse.js](https://fusejs.io/) for quick module finder
- uses [jsbn](https://github.com/andyperlitch/jsbn) for RSA Module's big numbers

## why text format "wizard"?

when i think of this project i think of imagemagick (the logo of it) but text formatting edition

## todo:
- custom modules w/ github oauth integration
- save recipe in localstorage
- fix calculate being not defined in custom JS function (by nonobvious method)
- similarly to above, bundle necessary functions when custom JS
- better type checking because this uses typescript
- create more docs (not fun)
- custom menu for clear all modules are you sure
- be able to drag around the stuff
- ability to pause the thing and have a run button to do it manually
- unit tests ughhhhghhhh dont want to do it (boring)
- change url fragment linking to work with other things like settings page, input text, etc
- changelog for users to know what changes

## module ideas:
- CRT module
- octal encoding
- ascii caesar shift
- substitution cipher
