/**
 * Changes the white background color to black and the black letters to white on background change
 */
'use strict'

function handleEvent(event) {
  let x = document.querySelector("#menu")
  x.style.display = "none";
  event.preventDefault()
}

let link = document.querySelector("#menu")
link.addEventListener('click', handleEvent)