export function parseMiniConf(src: string): Record<string, string> {
    const lines = src.split('\n')
    const ret: Record<string, string> = {}

    for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('#')) {
            continue
        }

        const idx = trimmed.indexOf('=')
        if (idx < 0) {
            continue
        }

        ret[trimmed.slice(0, idx)] = trimmed.slice(idx + 1)
    }

    return ret
}
