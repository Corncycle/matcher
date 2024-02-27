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
        inset: '0',
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
        whiteSpace: 'nowrap',
        height: '24%',
        fontSizeFillHeight: '1',
      },
      this.menuContainer
    )
    title.classList.add('mainTitle', 'textOutlineLarge', 'gradientText')
    this.overlayManager.setText(title, 'A Memory Assessment')
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
      this.overlayManager.levelManager.space.safeRequestPointerLock()
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
        zIndex: '1',
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
        cursor: 'auto',
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
        top: '15%',
        bottom: '15%',
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      this.helpRoot,
      true
    )

    const imgContainer = document.createElement('div')
    imgContainer.style.backgroundImage = "url('assets/help-bg.png')"
    // imgContainer.style.background = 'grey'
    imgContainer.style.pointerEvents = 'auto'
    imgContainer.style.cursor = 'auto'
    imgContainer.style.height = '100%'
    imgContainer.style.aspectRatio = '1000 / 720'
    imgContainer.style.display = 'flex'
    imgContainer.style.position = 'relative'
    imgContainer.style.justifyContent = 'center'
    imgContainer.style.userSelect = 'none'
    imgContainer.style.border = '4px solid var(--charcoal)'
    imgContainer.style.borderRadius = '30px'
    imgContainer.addEventListener('click', (e) => {
      e.stopPropagation()
    })

    margins.appendChild(imgContainer)
    const nn = document.createElement('img')
    nn.style.position = 'absolute'
    nn.style.width = '100%'
    nn.style.height = '100%'
    nn.style.pointerEvents = 'none'
    nn.style.imageRendering = 'pixelated'
    nn.src = 'assets/help-nn.png'
    nn.draggable = false

    const aa = document.createElement('img')
    aa.style.position = 'absolute'
    aa.style.width = '100%'
    aa.style.height = '100%'
    aa.src = 'assets/help-aa.png'
    aa.style.pointerEvents = 'none'
    aa.draggable = false

    const closeButton = this.createButton(
      false,
      'X',
      imgContainer,
      '0.6',
      '5%',
      `${(5 * 1000) / 720}%`
    )
    closeButton.style.position = 'absolute'
    closeButton.style.top = '1%'
    closeButton.style.right = `1%`
    closeButton.classList.add('closeButton')
    closeButton.addEventListener('click', () => {
      this.closeHelp()
    })

    imgContainer.appendChild(nn)
    imgContainer.appendChild(aa)
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
    parent?: HTMLElement,
    fontSizeFillHeight: string = '0.6',
    width: string = '50%',
    height: string = '14%'
  ) {
    const button = initializeDivElement(
      doDefaultStyles,
      {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '9999px',
        width: width,
        height: height,
        fontSizeFillHeight: fontSizeFillHeight,
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
