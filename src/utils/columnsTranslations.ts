type Translations = Record<string, string>;

function beautifyName(column: string): string {
  // Exemplo: "createdAt" → "Created At" / "solicitation_result" → "Solicitation Result"
  const spaced = column
    .replace(/([a-z])([A-Z])/g, "$1 $2") // separa camelCase
    .replace(/_/g, " "); // separa snake_case
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function mapColumns(translations: Translations, value: string) {
  return translations[value] || beautifyName(value);
}
