# text format wizard

*this project is under construction, feel free to use at [quasar.name](https://quasar.name/text-format-wizard)*

## what this

text format issues begone!
gone are the days of ad-ridden poor-quality online tools! now you can do it in one place and in a more powerful manner.

## what about cyberchef?

i had no idea that cyberchef existed before making this<br>
this is not a replacement for cyberchef nor a competitor

## try now

it can be found at [quasar.name/text-format-wizard](https://quasar.name/text-format-wizard/)<br>
if it's not working, it's because my server crashed probably<br>
you can try cloning, running `npm i`, and then `npm run dev` and going to `http://localhost:5173` instead

## cool packages that i used

- uses [svelte](https://svelte.dev/), a front-end component framework
- uses [svrollbar](https://github.com/daylilyfield/svrollbar), a scrollbar component for svelte
- uses [svelte-css-vars](https://github.com/kaisermann/svelte-css-vars) for dynamic css in svelte
- uses [fuse.js](https://fusejs.io/) for quick module finder
- uses [jsbn](https://github.com/andyperlitch/jsbn) for RSA Module's big numbers

## why text format "wizard"?

when i think of this project i think of imagemagick (the logo of it) but text formatting edition

## todo:
- keyboard shortcuts for everything like vim
- custom modules w/ github oauth integration
- save recipe in localstorage
- fix calculate being not defined in custom JS function (by nonobvious method)
- similarly to above, bundle necessary functions when custom JS
- better type checking because this uses typescript
- create more docs (not fun)
- settings page
- custom menu for clear all modules are you sure
- be able to drag around the stuff
- ability to pause the thing and have a run button to do it manually
- selectors/filters for module frame (e.g. popular, misc, ctf)
- unit tests ughhhh
- preset selecter (e.g. encrypt hex, instead of just "hex module")

## module ideas:
- execute if condition
- keep nth line
- CRT module
