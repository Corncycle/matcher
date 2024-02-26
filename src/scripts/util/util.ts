import LevelManager from '../classes/LevelManager'
import SpaceManager from '../classes/Space'

export const clamp = (x: number, min: number, max: number) => {
  return Math.min(Math.max(x, min), max)
}

export interface BooleanDirection {
  left: boolean
  right: boolean
  forward: boolean
  back: boolean
}

export function initializeDivElement(
  doDefaultStyles: boolean = true,
  options: { [key: string]: string } = {},
  parent?: HTMLElement,
  inheritVisibility?: boolean
) {
  const out = document.createElement('div')
  if (doDefaultStyles) {
    out.style.position = 'absolute'
    out.classList.add('overlayText')
  }
  if (!inheritVisibility) {
    out.style.visibility = 'hidden'
  }

  for (const opt in options) {
    if (opt !== 'fontSizeFillHeight') {
      out.style[opt as any] = options[opt]
    }
  }

  if (parent) {
    parent.appendChild(out)
  }

  if ('fontSizeFillHeight' in options) {
    const resizeFunc = (e?: any, forcedOffsetHeight?: number) => {
      out.style.fontSize = `${
        parseFloat(options.fontSizeFillHeight) * out.offsetHeight
      }px`
      out.style.lineHeight = `${
        parseFloat(options.fontSizeFillHeight) * out.offsetHeight
      }px`
    }
    window.addEventListener('resize', resizeFunc)
    resizeFunc(undefined, parent ? parent.offsetHeight : undefined)
  }
  return out
}

export function initializeTransitionElement(
  extraStyles: { [key: string]: string } = {},
  parent?: HTMLElement,
  baseClassName?: string
) {
  const out = document.createElement('div')
  if (baseClassName) {
    out.classList.add(baseClassName)
  }
  out.style.visibility = 'hidden'
  out.style.position = 'absolute'
  out.style.top = '0px'
  out.style.left = '0px'
  out.style.right = '0px'
  out.style.background = 'black'

  for (const opt in extraStyles) {
    if (opt !== 'fontSizeFillHeight') {
      out.style[opt as any] = extraStyles[opt]
    }
  }

  if (parent) {
    parent.appendChild(out)
  }

  return out
}

export function roughSizeOfObject(object: any) {
  var objectList = []
  var stack = [object]
  var bytes = 0

  while (stack.length) {
    var value = stack.pop()

    if (typeof value === 'boolean') {
      bytes += 4
    } else if (typeof value === 'string') {
      bytes += value.length * 2
    } else if (typeof value === 'number') {
      bytes += 8
    } else if (typeof value === 'object' && objectList.indexOf(value) === -1) {
      objectList.push(value)

      for (var i in value) {
        if (!['cssRules', 'rules', 'responseXML'].includes(i)) {
          stack.push(value[i])
        }
      }
    }
  }
  return bytes / 1000000
}

export function wrapWithTransition(lm: LevelManager, fn: Function) {
  lm.overlayManager.slideOut()
  setTimeout(() => {
    fn()
    setTimeout(() => {
      lm.overlayManager.fadeIn()
    }, 200)
  }, 800)
}
