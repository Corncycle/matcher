import {
  appleGroup,
  bananaGroup,
  mangoGroup,
  orangeGroup,
  watermelonGroup,
} from './objects'
import { statue2 } from './props'

const models = () => [
  appleGroup,
  bananaGroup,
  mangoGroup,
  orangeGroup,
  watermelonGroup,
  statue2,
]

const numModels = models().length

export const modelLoadingScreen = (onFinished: Function) => {
  const interval = setInterval(() => {
    let count = 0
    for (const model of models()) {
      if (model) {
        count += 1
      }
    }
    if (count >= numModels) {
      onFinished()
      clearInterval(interval)
    }
  }, 100)
}
