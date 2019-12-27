/**
 * Changes the white background color to black and the black letters to white on background change
 */
'use strict'

function handleEvent(event) {
  let x = document.querySelector("#menu")
  x.style.display = "none";
  event.preventDefault()
}

let menu = document.querySelector('input[value="START"]');
menu.addEventListener('click', handleEvent)