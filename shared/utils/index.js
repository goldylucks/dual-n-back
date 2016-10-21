export function capitalize (word) {
  return word[0].toUpperCase() + word.slice(1).toLowerCase()
}

export const renderIf = predicate => elem => {
  return predicate ? elem : null
}
