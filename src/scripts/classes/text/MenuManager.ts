import { initializeDivElement, wrapWithTransition } from '../../util/util'
import OverlayManager from './OverlayManager'

export default class MenuManager {
  overlayManager: OverlayManager

  root: HTMLDivElement
  menuContainer: HTMLDivElement

  optionsRoot: HTMLDivElement

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
    title.textContent = 'Much to Match'
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
        width: '100%',
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
