import { initializeDivElement } from '../../util/util'
import LevelManager from '../LevelManager'
import MenuManager from './MenuManager'

export enum OverlayModes {
  NONE = 'none',
  COUNTDOWN = 'countdown',
  INFO = 'info',
  MAIN_MENU = 'main_menu',
  OPTIONS = 'options',
}

export default class OverlayManager {
  levelManager: LevelManager

  canvas: HTMLDivElement

  headerElm: HTMLDivElement
  countdownElm: HTMLDivElement

  menuManager: MenuManager
  menuElm: HTMLDivElement

  constructor(levelManager: LevelManager) {
    this.levelManager = levelManager

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
      fontSizeFillHeight: '1',
    })
    this.setText(this.headerElm, 'Memorize!')

    this.countdownElm = this.initializeElement(true, {
      top: '15%',
      width: '100%',
      height: '10%',
      textAlign: 'center',
      color: 'white',
      fontSizeFillHeight: '1',
    })
    this.setText(this.countdownElm, '10')

    this.menuManager = new MenuManager(this)
    this.menuElm = this.menuManager.root
  }

  setMode(mode: OverlayModes) {
    this.hideElm(this.headerElm)
    this.hideElm(this.countdownElm)
    this.hideElm(this.menuElm)

    switch (mode) {
      case OverlayModes.COUNTDOWN:
        this.showElm(this.headerElm)
        this.showElm(this.countdownElm)
        return
      case OverlayModes.INFO:
        this.showElm(this.headerElm)
        return
      case OverlayModes.MAIN_MENU:
        this.showElm(this.menuElm)
        return
      case OverlayModes.NONE:
        return
      default:
        return
    }
  }

  initializeElement(
    doDefaultStyles: boolean = true,
    options: { [key: string]: string } = {}
  ) {
    const out = initializeDivElement(doDefaultStyles, options, this.canvas)
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
