// lower bound inclusive, upper bound exclusive
export function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}

export function randomFloat(min, max) {
    return Math.random() * (max - min) + min
}
