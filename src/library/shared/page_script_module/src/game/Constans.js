
const ExplosionType = {
    SMALL: 'SMALL',
    MIDDLE: 'MIDDLE',
    LARGE: 'LARGE'
}

const ShakeType = {
    SMALL: { magnitude: 0.002, duration: 0.2, wiggles: 3 },
    MIDDLE: { magnitude: 0.004, duration: 0.6, wiggles: 6 },
    LARGE: { magnitude: 0.006, duration: 0.8, wiggles: 8 }
}

export default {
    ExplosionType,
    ShakeType
}