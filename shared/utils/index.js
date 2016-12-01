export function capitalize (word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

export const renderIf = predicate => elem => {
  return predicate ? elem : null
}

export function isColorMatch (history, nBack) {
  return history[history.length - 1 - nBack].activeSquareColor === history[history.length - 1].activeSquareColor
}

export function isPositionMatch (history, nBack) {
  return history[history.length - 1 - nBack].activeSquareIdx === history[history.length - 1].activeSquareIdx
}

export function isAudioMatch (history, nBack) {
  return history[history.length - 1 - nBack].activeAudioLetter === history[history.length - 1].activeAudioLetter
}

export function missedAMatch (history, nBack, modes, positionGuessed, colorGuessed, audioGuessed) {
  if (history.length - 1 < nBack) {
    return false
  }
  return (isPositionMatch(history, nBack) && !positionGuessed && modes.position) ||
    (isColorMatch(history, nBack) && !colorGuessed && modes.color) ||
    (isAudioMatch(history, nBack) && !audioGuessed && modes.audio)
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
