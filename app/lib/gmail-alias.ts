/**
 * Gmail Alias Generator
 *
 * Generates email aliases from a base Gmail address using three techniques:
 * 1. Dot trick — Gmail ignores dots in the username (j.ohndoe@gmail.com = johndoe@gmail.com)
 * 2. Plus trick — username+tag@gmail.com routes to username@gmail.com
 * 3. Googlemail swap — @googlemail.com = @gmail.com
 */

export interface GmailAlias {
  address: string;
  type: "dot" | "plus" | "googlemail";
  label: string;
}

/**
 * Parse a Gmail address into username and domain.
 * Returns null if the input is not a valid Gmail address.
 */
export function parseGmailAddress(input: string): { username: string; domain: string } | null {
  const trimmed = input.trim().toLowerCase();
  // Match patterns: user@gmail.com, user@googlemail.com, user+tag@gmail.com
  const match = trimmed.match(/^([a-z0-9.]+(?:\+[a-z0-9]+)?)@(gmail\.com|googlemail\.com)$/);
  if (!match) return null;

  let username = match[1];
  const domain = match[2];

  // Strip any existing plus tag for base username extraction
  const plusIndex = username.indexOf("+");
  if (plusIndex !== -1) {
    username = username.slice(0, plusIndex);
  }

  // Strip all dots to get the canonical username
  const canonical = username.replace(/\./g, "");

  if (canonical.length === 0 || canonical.length > 64) return null;

  return { username: canonical, domain };
}

/**
 * Strip dots and plus tags from a Gmail username to get the canonical form.
 */
export function canonicalUsername(username: string): string {
  return username.replace(/\./g, "").split("+")[0].toLowerCase();
}

/**
 * Generate all valid dot-trick variations of a Gmail username.
 *
 * For a username of length n, there are 2^(n-1) possible dot placements.
 * We cap at a reasonable limit to avoid overwhelming output.
 */
export function generateDotVariations(username: string, maxResults = 64): string[] {
  const chars = username.split("");
  const n = chars.length;

  if (n <= 1) return [username];

  // Total possible variations: 2^(n-1)
  const totalVariations = 1 << (n - 1); // 2^(n-1)

  // If too many, sample evenly; otherwise generate all
  const results: string[] = [];
  const seen = new Set<string>();

  if (totalVariations <= maxResults) {
    // Generate all variations
    for (let mask = 0; mask < totalVariations; mask++) {
      let result = chars[0];
      for (let i = 1; i < n; i++) {
        if (mask & (1 << (i - 1))) {
          result += ".";
        }
        result += chars[i];
      }
      const key = result.replace(/\./g, "");
      if (!seen.has(key)) {
        seen.add(key);
        results.push(result);
      }
    }
  } else {
    // Sample evenly across the space
    const step = Math.floor(totalVariations / maxResults);
    for (let i = 0; i < totalVariations && results.length < maxResults; i += step) {
      let result = chars[0];
      for (let j = 1; j < n; j++) {
        if (i & (1 << (j - 1))) {
          result += ".";
        }
        result += chars[j];
      }
      const key = result.replace(/\./g, "");
      if (!seen.has(key)) {
        seen.add(key);
        results.push(result);
      }
    }
  }

  return results;
}

/**
 * Generate plus-addressed aliases with common labels.
 */
export function generatePlusAliases(
  username: string,
  customTags: string[] = []
): GmailAlias[] {
  const defaultTags = [
    "signup",
    "newsletter",
    "shopping",
    "social",
    "work",
    "test",
    "dev",
    "spam",
    "random",
    "temp",
  ];

  const allTags = [...new Set([...customTags, ...defaultTags])];

  return allTags.map((tag) => ({
    address: `${username}+${tag}@gmail.com`,
    type: "plus" as const,
    label: `+${tag}`,
  }));
}

/**
 * Generate the Googlemail swap variant.
 */
export function generateGooglemailSwap(username: string): GmailAlias[] {
  return [
    {
      address: `${username}@googlemail.com`,
      type: "googlemail" as const,
      label: "googlemail.com",
    },
  ];
}

/**
 * Count how many total unique aliases are possible from a base username.
 */
export function countTotalAliases(username: string): number {
  const n = username.length;
  const dotVariations = n <= 1 ? 1 : 1 << (n - 1);
  // Plus aliases are unlimited (arbitrary tags), but we count the default set
  const plusAliases = 10; // default tag count
  const googlemail = 1;
  return dotVariations + plusAliases + googlemail;
}

/**
 * Generate all aliases for a given Gmail address.
 * Returns dot variations (capped), plus aliases, and Googlemail swap.
 */
export function generateAllAliases(
  input: string,
  customTags: string[] = [],
  maxDotResults = 64
): {
  parsed: { username: string; domain: string };
  dotAliases: GmailAlias[];
  plusAliases: GmailAlias[];
  googlemailAliases: GmailAlias[];
  totalCount: number;
} | null {
  const parsed = parseGmailAddress(input);
  if (!parsed) return null;

  const dotVariations = generateDotVariations(parsed.username, maxDotResults);
  const dotAliases: GmailAlias[] = dotVariations.map((v) => ({
    address: `${v}@gmail.com`,
    type: "dot" as const,
    label: "dot trick",
  }));

  const plusAliases = generatePlusAliases(parsed.username, customTags);
  const googlemailAliases = generateGooglemailSwap(parsed.username);

  return {
    parsed,
    dotAliases,
    plusAliases,
    googlemailAliases,
    totalCount: countTotalAliases(parsed.username),
  };
}
