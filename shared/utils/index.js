export function capitalize (word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

export const renderIf = predicate => elem => {
  return predicate ? elem : null
}

export function isGuessCorrect (history, nBack, guess) {
  return history[history.length - 1 - nBack][guess] === history[history.length - 1][guess]
}

export function missedAMatch (history, nBack, modes, guessed) {
  if (history.length - 1 < nBack) {
    return false
  }
  return (isGuessCorrect(history, nBack, 'position') && !guessed.position && modes.position) ||
    (isGuessCorrect(history, nBack, 'color') && !guessed.color && modes.color) ||
    (isGuessCorrect(history, nBack, 'audio') && !guessed.audio && modes.audio)
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
