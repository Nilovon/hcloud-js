/**
 * Runs the read-only examples one after another.
 *
 *   bun run dev
 */
for (const example of ["01-quickstart", "02-pagination", "03-error-handling", "05-observability"]) {
  console.log(`\n=== ${example} ===\n`);
  await import(`./${example}.ts`);
}
