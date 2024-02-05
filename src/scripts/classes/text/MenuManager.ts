import { initializeDivElement, wrapWithTransition } from '../../util/util'
import OverlayManager from './OverlayManager'

export default class MenuManager {
  overlayManager: OverlayManager

  root: HTMLDivElement
  menuContainer: HTMLDivElement

  optionsRoot: HTMLDivElement
  helpRoot!: HTMLDivElement

  constructor(overlayManager: OverlayManager) {
    this.overlayManager = overlayManager

    this.root = initializeDivElement(
      true,
      {
        inset: '0px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      this.overlayManager.canvas
    )

    this.menuContainer = initializeDivElement(
      false,
      {
        // background: 'red',
        userSelect: 'none',
        paddingLeft: '40px',
        paddingRight: '40px',
        color: 'white',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '5%',
        alignItems: 'center',
        height: '50%',
      },
      this.root
    )
    this.menuContainer.style.visibility = 'inherit'
    this.initializeMenuElements()
    this.initializeHelpElements()

    this.optionsRoot = initializeDivElement(
      true,
      {
        inset: '0px',
      },
      this.root
    )
  }

  initializeMenuElements() {
    const title = initializeDivElement(
      false,
      {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        height: '20%',
        fontSizeFillHeight: '1',
      },
      this.menuContainer
    )
    title.classList.add('mainTitle')
    title.textContent = 'The Memory Assessment'
    title.style.visibility = 'inherit'

    const playButton = this.createButton(
      false,
      'Start Game',
      this.menuContainer
    )
    const howButton = this.createButton(
      false,
      'How to Play',
      this.menuContainer
    )

    playButton.addEventListener('click', () => {
      wrapWithTransition(this.overlayManager.levelManager, () => {
        this.overlayManager.levelManager.loadTwoStageLevel(1)
      })
      this.overlayManager.levelManager.space.renderer.domElement.requestPointerLock()
    })

    howButton.addEventListener('click', () => {
      this.openHelp()
    })
  }

  initializeHelpElements() {
    this.helpRoot = initializeDivElement(
      false,
      {
        position: 'absolute',
        inset: '0',
        pointerEvents: 'auto',
        cursor: 'pointer',
      },
      this.root
    )
    this.helpRoot.addEventListener('click', () => {
      this.closeHelp()
    })

    const margins = initializeDivElement(
      false,
      {
        position: 'absolute',
        left: '0',
        right: '0',
        top: '20%',
        bottom: '20%',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      this.helpRoot,
      true
    )

    const helpContainer = initializeDivElement(
      false,
      {
        background: 'blue',
        height: '100%',
        width: 'auto',
        pointerEvents: 'auto',
        userSelect: 'none',
        cursor: 'auto',
      },
      margins,
      true
    )
    helpContainer.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    const topContainer = initializeDivElement(
      false,
      {
        background: 'tomato',
        height: '43%',
        display: 'flex',
        pointerEvents: 'none',
      },
      helpContainer,
      true
    )
    // topContainer.textContent = 'im the top container'

    const horizDivider = initializeDivElement(
      false,
      { height: '4%', poitnerEvents: 'none' },
      helpContainer,
      true
    )

    const botContainer = initializeDivElement(
      false,
      {
        background: 'cyan',
        height: '53%',
        pointerEvents: 'none',
      },
      helpContainer,
      true
    )
    botContainer.textContent = 'im the bot container'

    const moveContainer = initializeDivElement(
      false,
      { background: 'brown', height: '100%' },
      topContainer,
      true
    )

    const vertDivider = initializeDivElement(
      false,
      { height: '100%' },
      topContainer,
      true
    )

    const pickContainer = initializeDivElement(
      false,
      { background: 'sienna', height: '100%' },
      topContainer,
      true
    )

    const moveKeysContainer = initializeDivElement(
      false,
      { height: '100%' },
      moveContainer,
      true
    )

    for (const char of ['w', 'a', 's', 'd']) {
      this.initializeSvgElement(moveKeysContainer, `keyboard_${char}`, 50)
    }
  }

  initializeSvgElement(
    parent: HTMLElement,
    fileName: string,
    heightPct: number
  ) {
    const elm = document.createElement('img')
    const resizeFunc = () => {
      elm.style.height = parent.offsetHeight * (heightPct / 100) + 'px'
    }
    resizeFunc()
    window.addEventListener('resize', resizeFunc)
    elm.style.height = elm.src = `/assets/icons/${fileName}.svg`
    parent.appendChild(elm)
  }

  openHelp() {
    this.helpRoot.style.visibility = 'visible'
  }

  closeHelp() {
    this.helpRoot.style.visibility = 'hidden'
  }

  createButton(
    doDefaultStyles: boolean = true,
    text: string,
    parent?: HTMLElement
  ) {
    const button = initializeDivElement(
      doDefaultStyles,
      {
        background: 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '9999px',
        width: '70%',
        height: '14%',
        fontSizeFillHeight: '0.6',
      },
      parent
    )
    button.classList.add('menuButton')
    button.style.visibility = 'inherit'
    button.style.pointerEvents = 'auto'
    button.style.cursor = 'pointer'
    button.style.userSelect = 'none'
    button.textContent = text
    return button
  }
}
