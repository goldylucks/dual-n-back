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

export function missedAMatch (history, nBack, positionGuessed, colorGuessed, audioGuessed) {
  if (history.length - 1 < nBack) {
    return false
  }
  return (isPositionMatch(history, nBack) && !positionGuessed) ||
    (isColorMatch(history, nBack) && !colorGuessed) ||
    (isAudioMatch(history, nBack) && !audioGuessed)
}
