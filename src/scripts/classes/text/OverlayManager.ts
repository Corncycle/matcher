import * as THREE from 'three'
import {
  CSS2DObject,
  CSS2DRenderer,
} from 'three/examples/jsm/renderers/CSS2DRenderer'

export enum OverlayModes {
  COUNTDOWN = 'countdown',
  INFO = 'info',
  MAIN_MENU = 'main_menu',
  OPTIONS = 'options',
}

export default class OverlayManager {
  canvas: HTMLDivElement

  headerElm: HTMLDivElement
  countdownElm: HTMLDivElement

  constructor() {
    this.canvas = document.createElement('div')
    this.canvas.style.position = 'absolute'
    this.canvas.style.inset = '0'
    this.canvas.style.pointerEvents = 'none'

    document.body.appendChild(this.canvas)

    this.headerElm = this.initializeElement(true, {
      top: '5%',
      width: '100%',
      height: '5%',
      textAlign: 'center',
      color: 'white',
      fontSizeFillHeight: '',
    })
    this.setText(this.headerElm, 'Memorize the locations of the objects!')

    this.countdownElm = this.initializeElement(true, {
      top: '15%',
      width: '100%',
      height: '10%',
      textAlign: 'center',
      color: 'white',
      fontSizeFillHeight: '',
    })
    this.setText(this.countdownElm, '10')
  }

  setMode(mode: OverlayModes) {
    this.hideElm(this.headerElm)
    this.hideElm(this.countdownElm)

    switch (mode) {
      case OverlayModes.COUNTDOWN:
        this.showElm(this.headerElm)
        this.showElm(this.countdownElm)
        return
      case OverlayModes.INFO:
        this.showElm(this.headerElm)
      default:
        return
    }
  }

  initializeElement(
    doDefaultStyles: boolean = true,
    options: { [key: string]: string } = {}
  ) {
    const out = document.createElement('div')
    out.classList.add('overlayText')
    out.style.position = 'absolute'
    out.style.visibility = 'hidden'

    for (const opt in options) {
      if (opt !== 'fontSizeFillHeight') {
        out.style[opt as any] = options[opt]
      }
    }
    this.canvas.appendChild(out)

    if ('fontSizeFillHeight' in options) {
      const resizeFunc = () => {
        out.style.fontSize = `${out.offsetHeight}px`
        out.style.lineHeight = `${out.offsetHeight}px`
        console.log('resize')
      }
      window.addEventListener('resize', resizeFunc)
      resizeFunc()
    }

    return out
  }

  showElm(elm: HTMLElement) {
    elm.style.visibility = 'visible'
  }

  hideElm(elm: HTMLElement) {
    elm.style.visibility = 'hidden'
  }

  setText(elm: HTMLElement, text: string) {
    elm.textContent = text
  }
}
