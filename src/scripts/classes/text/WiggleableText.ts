export default class WiggleableText {
  container: HTMLDivElement
  text: HTMLDivElement

  constructor(container: HTMLDivElement, text: HTMLDivElement) {
    this.container = container
    this.text = text
  }

  wiggle(delay: number = 0) {
    setTimeout(() => {
      this.text.classList.remove('wiggle')
      this.container.classList.remove('grow')

      // magic: see https://css-tricks.com/restart-css-animation/
      void this.text.offsetWidth
      void this.container.offsetWidth

      this.text.classList.add('wiggle')
      this.container.classList.add('grow')
    }, delay)
  }
}
