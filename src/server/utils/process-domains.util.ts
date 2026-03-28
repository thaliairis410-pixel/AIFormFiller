export default function processDomains(domains: string) {
  return Array.from(
    domains.matchAll(/[a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)*$/gm),
  ).map((match) => `https://${match[0]}`);
}
