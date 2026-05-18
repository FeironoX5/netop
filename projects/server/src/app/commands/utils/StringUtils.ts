export namespace StringUtils {
  export function buildPage(sections: { title: string; text: string }[]): string {
    return sections
      .map((section) => `${section.title.toUpperCase()}\n${buildIndented(section.text)}`)
      .join('\n\n');
  }

  export function buildIndented(s: string, level: number = 1): string {
    return s
      .split('\n')
      .map((line) => `${'  '.repeat(level)}${line}`)
      .join('\n');
  }

  export function buildList(items: string[], level: number = 1): string {
    return items.map((item) => buildIndented(`-${item}`, level)).join('\n');
  }
}
