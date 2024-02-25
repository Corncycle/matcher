import {
  initializeDivElement,
  initializeTransitionElement,
} from '../../util/util'
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

  grabElm: HTMLDivElement
  dropElm: HTMLDivElement
  skipElm: HTMLDivElement

  menuManager: MenuManager
  menuElm: HTMLDivElement

  slideTransElm: HTMLDivElement
  fadeTransElm: HTMLDivElement

  loadingModelsElm: HTMLDivElement
  loadingModelsText: HTMLDivElement

  // used to block mouse interactions
  blockerElm: HTMLDivElement

  constructor(levelManager: LevelManager) {
    this.levelManager = levelManager

    this.canvas = document.createElement('div')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.width = '100%'
    this.canvas.style.zIndex = '0'
    this.canvas.style.pointerEvents = 'none'
    this.canvas.style.height = document.body.clientHeight + 'px'
    window.addEventListener('resize', () => {
      this.canvas.style.height = document.body.clientHeight + 'px'
    })

    document.body.appendChild(this.canvas)

    this.headerElm = this.initializeElement(true, {
      top: '5%',
      width: '100%',
      height: '8%',
      textAlign: 'center',
      color: 'white',
      fontSizeFillHeight: '1',
    })
    this.headerElm.classList.add('gradientText', 'textOutlineMedium')
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

    this.grabElm = this.initializeInputSuggestionElement(
      'Grab',
      'keyboard_e_outline.svg'
    )
    this.dropElm = this.initializeInputSuggestionElement(
      'Drop',
      'keyboard_e.svg'
    )
    this.skipElm = this.initializeInputSuggestionElement(
      'Skip',
      'keyboard_shift_outline.svg'
    )

    this.menuManager = new MenuManager(this)
    this.menuElm = this.menuManager.root

    this.slideTransElm = initializeTransitionElement(
      {},
      this.canvas,
      'slideOutBase'
    )
    this.fadeTransElm = initializeTransitionElement(
      { bottom: '0px' },
      this.canvas,
      'fadeInBase'
    )

    this.loadingModelsElm = initializeTransitionElement(
      {
        bottom: '0px',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      this.canvas,
      'loadingModelsElm'
    )
    // this.loadingModelsElm.innerText = 'Loading models...'
    this.showElm(this.loadingModelsElm)

    this.loadingModelsText = initializeDivElement(
      false,
      {},
      this.loadingModelsElm,
      true
    )
    this.loadingModelsText.innerText = 'Loading models...'
    this.loadingModelsText.classList.add('loadingModelsText')

    this.blockerElm = this.initializeElement(false, {
      inset: '0',
      position: 'absolute',
      pointerEvents: 'auto',
    })
    this.showElm(this.blockerElm)
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

  initializeInputSuggestionElement(text: string, img: string) {
    const root = initializeDivElement(
      false,
      {
        position: 'absolute',
        bottom: '0',
        left: '1%',
        height: '18%',
        // background: 'Red',
        display: 'flex',
        alignItems: 'center',
        gap: '5%',
        opacity: '80%',
      },
      this.canvas
    )

    const textElm = initializeDivElement(
      false,
      {
        height: '40%',
        fontSizeFillHeight: '1',
        color: 'white',
      },
      root,
      true
    )
    textElm.classList.add('inputSuggestion')
    this.setText(textElm, text)

    const imgElm = document.createElement('img')
    if (text === 'Skip') {
      imgElm.style.height = '100%'
    } else {
      imgElm.style.height = '50%'
    }
    imgElm.src = '/assets/icons/' + img

    root.append(imgElm, textElm)
    return root
  }

  showElm(elm: HTMLElement) {
    elm.style.visibility = 'visible'
  }

  hideElm(elm: HTMLElement) {
    elm.style.visibility = 'hidden'
  }

  setText(elm: HTMLElement, text: string) {
    elm.textContent = text
    elm.dataset.text = text
  }

  slideOut() {
    this.hideElm(this.fadeTransElm)
    this.fadeTransElm.classList.remove('fadeIn')
    this.showElm(this.slideTransElm)
    this.slideTransElm.classList.add('slideOut')
    this.showElm(this.blockerElm)
  }

  fadeIn() {
    this.hideElm(this.slideTransElm)
    this.slideTransElm.classList.remove('slideOut')
    this.showElm(this.fadeTransElm)
    this.fadeTransElm.classList.add('fadeIn')
    this.hideElm(this.blockerElm)
  }

  endLoading() {
    this.loadingModelsElm.classList.add('fadeIn')
    this.loadingModelsElm.innerText = ''
    this.hideElm(this.blockerElm)
    this.hideElm(this.loadingModelsText)
  }

  suggestSkip() {
    this.hideElm(this.grabElm)
    this.hideElm(this.dropElm)
    this.showElm(this.skipElm)
    this.skipElm.style.opacity = '20%'
  }

  suggestGrab() {
    this.showElm(this.grabElm)
    this.hideElm(this.dropElm)
    this.hideElm(this.skipElm)
  }

  suggestDrop() {
    this.hideElm(this.grabElm)
    this.showElm(this.dropElm)
    this.hideElm(this.skipElm)
  }

  suggestNone() {
    this.hideElm(this.grabElm)
    this.hideElm(this.dropElm)
    this.hideElm(this.skipElm)
  }
}
