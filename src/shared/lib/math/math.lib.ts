export function getRandomNumber(config: { min: number; max: number }) {
  const min = Math.ceil(config.min)
  const max = Math.floor(config.max)

  return Math.floor(Math.random() * (max - min + 1)) + min
}
