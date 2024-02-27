import {
  appleGroup,
  bananaGroup,
  mangoGroup,
  orangeGroup,
  watermelonGroup,
} from './objects'
import {
  armchair,
  armchairBlue,
  armchairPink,
  chandelier,
  couch,
  dresser,
  dresserWashed,
  grandfatherClock,
  lamp,
  nightstand,
  nightstandWashed,
  statue2,
} from './props'

const models = () => [
  appleGroup,
  bananaGroup,
  mangoGroup,
  orangeGroup,
  watermelonGroup,
  statue2,
  armchair,
  couch,
  dresser,
  grandfatherClock,
  chandelier,
  armchairBlue,
  nightstand,
  lamp,
  armchairPink,
  dresserWashed,
  nightstandWashed,
]

const numModels = models().length

// there's almost certainly a Promise.all way to do this instead of this hack
// but it works so
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
