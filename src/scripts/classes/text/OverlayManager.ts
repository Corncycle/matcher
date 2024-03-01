import {
  initializeDivElement,
  initializeTransitionElement,
} from '../../util/util'
import LevelManager from '../LevelManager'
import MenuManager from './MenuManager'
import WiggleableText from './WiggleableText'

export enum OverlayModes {
  NONE = 'none',
  COUNTDOWN = 'countdown',
  INFO = 'info',
  INCORRECT = 'incorrect',
  CORRECT = 'correct',
  MAIN_MENU = 'main_menu',
  OPTIONS = 'options',
}

export default class OverlayManager {
  levelManager: LevelManager

  canvas: HTMLDivElement

  vignetteElm: HTMLDivElement

  headerWT: WiggleableText
  headerElm: HTMLDivElement
  countdownElm: HTMLDivElement

  incorrectWT: WiggleableText
  incorrectElm: HTMLDivElement

  correctWT: WiggleableText
  correctElm: HTMLDivElement

  grabElm: HTMLDivElement
  dropElm: HTMLDivElement
  skipElm: HTMLDivElement

  menuManager: MenuManager
  menuElm: HTMLDivElement

  slideTransElm: HTMLDivElement
  fadeTransElm: HTMLDivElement

  loadingModelsElm: HTMLDivElement
  loadingModelsText: HTMLDivElement

  volumeElm: HTMLDivElement

  // used to block mouse interactions
  blockerElm: HTMLDivElement

  countdownSound: Howl
  urgentCountdownSound: Howl

  constructor(levelManager: LevelManager) {
    this.levelManager = levelManager

    this.canvas = document.createElement('div')
    this.canvas.style.position = 'absolute'
    this.canvas.style.top = '0'
    this.canvas.style.width = '100%'
    this.canvas.style.zIndex = '0'
    this.canvas.style.pointerEvents = 'none'

    this.canvas.style.height =
      document.querySelector('.matcher-container')?.clientHeight + 'px'
    window.addEventListener('resize', () => {
      this.canvas.style.height =
        document.querySelector('.matcher-container')?.clientHeight + 'px'
    })

    document.querySelector('.matcher-container')?.appendChild(this.canvas)

    const headerCnt = this.initializeElement(
      true,
      { width: '100%', height: '8%', top: '5%', visibility: 'hidden' },
      true
    )
    this.headerElm = this.initializeElement(
      false,
      {
        height: '100%',
        textAlign: 'center',
        color: 'red',
        fontSizeFillHeight: '1',
        visibility: 'inherit',
      },
      false,
      headerCnt
    )
    this.headerWT = new WiggleableText(headerCnt, this.headerElm)

    this.headerElm.classList.add('gradientText', 'textOutlineMedium')
    this.setText(this.headerElm, 'Memorize!')

    const incorrectCnt = this.initializeElement(
      true,
      { width: '100%', height: '12%', top: '44%', visibility: 'hidden' },
      true
    )
    this.incorrectElm = this.initializeElement(
      false,
      {
        height: '100%',
        textAlign: 'center',
        color: 'red',
        fontSizeFillHeight: '1',
        visibility: 'inherit',
      },
      false,
      incorrectCnt
    )
    this.incorrectWT = new WiggleableText(incorrectCnt, this.incorrectElm)

    this.incorrectElm.classList.add('gradientTextRed', 'textOutlineMedium')
    this.setText(this.incorrectElm, "That's not a match!")

    const correctCnt = this.initializeElement(
      true,
      { width: '100%', height: '12%', top: '44%', visibility: 'hidden' },
      true
    )
    this.correctElm = this.initializeElement(
      false,
      {
        height: '100%',
        textAlign: 'center',
        color: 'red',
        fontSizeFillHeight: '1',
        visibility: 'inherit',
      },
      false,
      correctCnt
    )
    this.correctWT = new WiggleableText(correctCnt, this.correctElm)

    this.correctElm.classList.add('gradientTextGreen', 'textOutlineMedium')
    this.setText(this.correctElm, 'Well done!')

    this.countdownElm = this.initializeElement(true, {
      top: '15%',
      width: '100%',
      height: '10%',
      textAlign: 'center',
      color: 'white',
      fontSizeFillHeight: '1',
    })
    this.setText(this.countdownElm, '10')
    this.countdownElm.classList.add('textOutlineMedium')

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

    this.volumeElm = this.initializeElement(false, {
      margin: '10px',
      height: '8%',
      fontSizeFillHeight: '1',
      position: 'absolute',
      right: '0',
      top: '0',
      cursor: 'pointer',
      pointerEvents: 'auto',
      color: 'white',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      userSelect: 'none',
    })

    this.volumeElm.classList.add('material-symbols-rounded')
    this.volumeElm.innerText = 'volume_up'
    this.volumeElm.style.visibility = 'visible'
    this.volumeElm.addEventListener('click', () => {
      this.toggleVolume()
    })

    this.menuManager = new MenuManager(this)
    this.menuElm = this.menuManager.root

    this.vignetteElm = this.initializeElement(true, {
      inset: '0',
      boxShadow: 'inset 0 0 40px 10px rgb(0, 0, 0, 0.3)',
    })
    this.showElm(this.vignetteElm)

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

    this.countdownSound = new Howl({
      src: ['assets/audio/sfx_sounds_damage1.wav'],
      volume: 0.14,
      rate: 0.9,
    })

    this.urgentCountdownSound = new Howl({
      src: ['assets/audio/sfx_sounds_interaction12.wav'],
      volume: 0.12,
    })
  }

  setMode(mode: OverlayModes) {
    this.hideElm(this.headerWT.container)
    this.hideElm(this.countdownElm)
    this.hideElm(this.menuElm)
    this.hideElm(this.incorrectWT.container)
    this.hideElm(this.correctWT.container)

    switch (mode) {
      case OverlayModes.COUNTDOWN:
        this.setText(this.headerElm, 'Memorize!')
        this.showElm(this.headerWT.container)
        this.headerWT.wiggle(400)
        // this.showElm(this.countdownElm) // countdownElm should be shown by splashing it
        return
      case OverlayModes.INFO:
        this.setText(this.headerElm, 'Match!')
        this.headerWT.wiggle(400)
        this.showElm(this.headerWT.container)
        return
      case OverlayModes.MAIN_MENU:
        this.showElm(this.menuElm)
        return
      case OverlayModes.NONE:
        return
      case OverlayModes.INCORRECT:
        this.showElm(this.headerWT.container)
        this.incorrectWT.wiggle(0)
        this.showElm(this.incorrectWT.container)
        return
      case OverlayModes.CORRECT:
        this.showElm(this.headerWT.container)
        this.correctWT.wiggle(0)
        this.showElm(this.correctWT.container)
        return
      default:
        return
    }
  }

  initializeElement(
    doDefaultStyles: boolean = true,
    options: { [key: string]: string } = {},
    appendToCanvas: boolean = true,
    overrideParent?: HTMLElement
  ) {
    const out = initializeDivElement(
      doDefaultStyles,
      options,
      appendToCanvas ? this.canvas : overrideParent ? overrideParent : undefined
    )
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
    imgElm.src = 'assets/icons/' + img

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

  splashText(elm: HTMLElement, text?: string) {
    if (text) {
      this.setText(elm, text)
    }
    elm.classList.remove('splash')

    // magic: see https://css-tricks.com/restart-css-animation/
    void elm.offsetWidth

    elm.classList.add('splash')
  }

  splashCountdown(time: number) {
    if (!this.levelManager.muted) {
      if (time <= 3) {
        this.urgentCountdownSound.play()
      } else {
        this.countdownSound.play()
      }
    }
    this.showElm(this.countdownElm)
    this.setText(this.countdownElm, time.toString())
    this.countdownElm.classList.remove('splash')
    void this.countdownElm.offsetWidth
    this.countdownElm.classList.add('splash')
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

  toggleVolume() {
    if (this.volumeElm.innerText === 'volume_up') {
      this.volumeElm.innerText = 'volume_mute'
      this.levelManager.pauseAudio()
    } else {
      this.volumeElm.innerText = 'volume_up'
      this.levelManager.playAudio()
    }
  }
}
