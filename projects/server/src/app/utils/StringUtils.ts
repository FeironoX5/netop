export class StringUtils {
  static buildPage(
    sections: { title: string; text: string }[],
  ): string {
    return sections
      .map(
        (section) =>
          `${section.title.toUpperCase()}\n${StringUtils.buildIndented(section.text)}`,
      )
      .join('\n\n');
  }

  static buildIndented(
    s: string,
    level: number = 1,
  ): string {
    return s
      .split('\n')
      .map((line) => `${'  '.repeat(level)}${line}`)
      .join('\n');
  }

  static buildList(
    items: string[],
    level: number = 1,
  ): string {
    return items
      .map((item) =>
        StringUtils.buildIndented(`- ${item}`, level),
      )
      .join('\n');
  }
}
