import { SUPPORTED_MODES } from '../constants'

export function capitalize (word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

export const renderIf = predicate => elem => {
  return predicate ? elem : null
}

export function isMatch (history, nBack, mode) {
  return history[history.length - 1 - nBack][mode] === history[history.length - 1][mode]
}

export function missedAMatch (history, nBack, modes, guessed) {
  if (history.length - 1 < nBack) {
    return false
  }
  return SUPPORTED_MODES.filter(mode => isMatch(history, nBack, mode) && !guessed[mode] && modes[mode])
}

export function getBestScore (modes, nBack, bestScores) {
  return bestScores[getBestScoreKey(modes, nBack)] || 0
}

export function updateBestScores (modes, nBack, bestScores, score) {
  bestScores = Object.assign({}, bestScores)
  bestScores[getBestScoreKey(modes, nBack)] = score
  return bestScores
}

export function getBestScoreKey (modes, nBack) {
  let activeModes = ''
  if (modes.audio) { activeModes += 'audio' }
  if (modes.position) { activeModes += 'position' }
  if (modes.color) { activeModes += 'color' }
  return activeModes + nBack
}

export function isGuessDisabled (history, nBack, status) {
  return history.length - 1 < nBack || status !== 'active'
}
