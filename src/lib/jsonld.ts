/** Строка для вставки в <script type="application/ld+json"> без breakout через </script>. */
export function jsonLdSerialization(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
