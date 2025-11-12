declare module 'https://jslib.k6.io/k6-utils/1.2.0/index.js' {
  /**
   * Returns a random item from an array
   */
  export function randomItem<T>(array: T[]): T;

  /**
   * Returns a random string of specified length
   */
  export function randomString(length: number, charset?: string): string;

  /**
   * Returns a random integer between min and max (inclusive)
   */
  export function randomIntBetween(min: number, max: number): number;

  /**
   * Finds an item in an array based on a property value
   */
  export function findBetween(content: string, left: string, right: string, repeat?: boolean): string | string[];

  /**
   * Normalizes a URL by removing trailing slashes
   */
  export function normalizeURL(url: string): string;

  /**
   * Returns a random element from the arguments
   */
  export function randomChoice<T>(...args: T[]): T;

  /**
   * Generates a UUID v4
   */
  export function uuidv4(): string;
}
