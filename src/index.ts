type RemoveTrailingSlashes<T extends string> = T extends `${infer U}/`
  ? RemoveTrailingSlashes<U>
  : T;
type RemoveLeadingSlashes<T extends string> = T extends `/${infer U}`
  ? RemoveLeadingSlashes<U>
  : T;

type JoinParts<Parts extends string[]> = Parts extends [
  infer First,
  ...infer Rest
]
  ? First extends string
    ? Rest extends string[]
      ? First extends ""
        ? `${JoinParts<Rest>}`
        : `${RemoveTrailingSlashes<First>}/${RemoveLeadingSlashes<
            JoinParts<Rest>
          >}`
      : never
    : never
  : "";

type ValidInitialSlash = "/" | `//${string}`;

type ProcessInitialSlash<T extends string> = T extends ValidInitialSlash
  ? T
  : T extends `/${string}`
  ? `/${RemoveLeadingSlashes<T>}`
  : T;

type IsValidScheme<T extends string> = T extends `${string}/:${string}`
  ? false
  : T extends `${string}:`
  ? true
  : T extends `${string}:${infer Rest}/`
  ? RemoveTrailingSlashes<Rest> extends ""
    ? true
    : false
  : false;

type MergeFirstTwoIfFirstIsScheme<T extends string[]> = T extends [
  infer First,
  infer Second,
  ...infer Rest
]
  ? First extends string
    ? IsValidScheme<First> extends true
      ? [`${First}${Second & string}`, ...Rest]
      : T
    : T
  : T;

type _ProcessProtocol<T extends string> = T extends `${string}/:${string}`
  ? T
  : T extends `file:///${infer R}`
  ? `file:///${RemoveLeadingSlashes<R>}`
  : T extends `${infer Protocol}:${infer Rest}`
  ? `${Protocol}://${RemoveLeadingSlashes<Rest>}`
  : T;

type ProcessProtocol<T extends string[]> = T extends [
  infer First,
  ...infer Rest
]
  ? First extends string
    ? [_ProcessProtocol<First>, ...Rest]
    : T
  : T;

type Symbols = "?" | "&" | "#";

type ProcessSymbolsWithSlash<T extends string> =
  T extends `${string}/${Symbols}${string}`
    ? T extends `${infer P}/${infer S}${infer R}`
      ? S extends Symbols
        ? T extends `${infer P}/#!${infer R}`
          ? `${P}/#!${ProcessSymbolsWithSlash<R>}`
          : ProcessSymbolsWithSlash<`${P}${S}${R}`>
        : `${P}/${ProcessSymbolsWithSlash<`${S}${R}`>}`
      : T
    : T;

type ProcessQuery<T extends string> = T extends `${infer P}?${infer R}`
  ? `${P}?${TurnQueryToAmpersand<R>}`
  : T;
type TurnQueryToAmpersand<T extends string> = T extends `${infer P}?${infer R}`
  ? TurnQueryToAmpersand<`${P}&${R}`>
  : T;

type ProcessSymbols<T extends string> = ProcessQuery<
  ProcessSymbolsWithSlash<T>
>;

type PreserveTrailingSlashIfPresent<
  T extends string[],
  U extends string
> = T extends [...string[], infer Last]
  ? Last extends `${string}/`
    ? `${RemoveTrailingSlashes<U>}/`
    : RemoveTrailingSlashes<U>
  : RemoveTrailingSlashes<U>;

export type UrlJoin<T extends string[]> = ProcessInitialSlash<
  PreserveTrailingSlashIfPresent<
    T,
    ProcessSymbols<JoinParts<ProcessProtocol<MergeFirstTwoIfFirstIsScheme<T>>>>
  >
>;
