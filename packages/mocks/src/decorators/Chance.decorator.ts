import { getChanceInstance } from "@/utils/chance-instance";
import { JSONValue, Mock } from "@acquire/core";

/* -------------------------------------------------------------------------- */
/*                              Chance decorators                             */
/* -------------------------------------------------------------------------- */

/* --------------------------------- Basics --------------------------------- */
export function MockBool(opts?: { likelihood: number }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.bool(opts));
}

export function MockFalsy(opts?: {
  pool: (false | null | 0 | "")[];
}): PropertyDecorator {
  return Mock(
    async () =>
      (await getChanceInstance())?.falsy({
        pool: opts?.pool ?? [false, null, 0, ""]
      }) as false | null | 0 | ""
  );
}

export function MockCharacter(
  opts?: Partial<Chance.CharacterOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.character(opts));
}

export function MockFloating(opts?: {
  min?: number;
  max?: number;
  fixed?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.floating(opts));
}

export function MockInteger(opts?: Chance.IntegerOptions): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.integer(opts));
}

export function MockLetter(opts?: {
  casing: "lower" | "upper";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.letter(opts));
}

export function MockNatural(opts?: {
  min?: number;
  max?: number;
  exclude?: number[];
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.natural(opts));
}

export function MockString(
  opts?: Partial<Chance.StringOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.string(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* ---------------------------------- Text ---------------------------------- */
export function MockParagraph(opts?: {
  sentences?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.paragraph(opts));
}

export function MockSentence(
  opts?: Partial<Chance.SentenceOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.sentence(opts));
}

export function MockSyllable(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.syllable());
}

export function MockWord(
  opts?: Partial<Chance.WordOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.word(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* --------------------------------- Person --------------------------------- */
export function MockAge(opts?: {
  type?: "child" | "teen" | "adult" | "senior";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.age(opts));
}

export function MockBirthday(opts?: {
  type?: "child" | "teen" | "adult" | "senior";
  american?: boolean;
}): PropertyDecorator {
  return Mock(
    async () =>
      (await getChanceInstance())?.birthday({ string: true, ...opts }) as
        | string
        | undefined
  );
}

export function MockCF(opts?: {
  first?: string;
  last?: string;
  gender?: "Male" | "Female";
  birthday?: Date;
  city?: string;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.cf(opts));
}

export function MockCPF(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.cpf());
}

export function MockSSN(opts?: {
  ssnFour?: boolean;
  dashes?: boolean;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.ssn(opts));
}

export function MockFirstName(
  opts?: Partial<Chance.FirstNameOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.first(opts));
}

export function MockLastName(opts?: Chance.LastNameOptions): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.last(opts));
}

export function MockName(
  opts?: Partial<Chance.NameOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.name(opts));
}

export function MockGender(opts?: {
  extraGenders?: string[];
}): PropertyDecorator {
  return Mock(async () =>
    // extraGenders is missing from the type bindings, but can be found in the official documentation
    (
      (await getChanceInstance())?.gender as (opts?: {
        extraGenders?: string[];
      }) => string
    )(opts)
  );
}

export function MockPrefix(
  opts?: Partial<Chance.PrefixOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.prefix(opts));
}

export function MockSuffix(opts?: Chance.SuffixOptions): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.suffix(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* ---------------------------------- Thing --------------------------------- */
export function MockAnimal(opts?: {
  type?: "ocean" | "desert" | "grassland" | "forest" | "farm" | "pet" | "zoo";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.animal(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* --------------------------------- Mobile --------------------------------- */
export function MockAndroidId(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.android_id());
}

export function MockAppleToken(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.apple_token());
}

export function MockBlackBerryDevicePin(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.bb_pin());
}

export function MockWindowsPhone7ANID(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.wp7_anid());
}

export function MockWindowsPhone8ANID2(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.wp8_anid2());
}
/* -------------------------------------------------------------------------- */
/*/
/* ----------------------------------- Web ---------------------------------- */
export function MockAvatar(opts?: {
  protocol?: "http" | "https";
  email?: string;
  fileExtension?: "bmp" | "gif" | "jpg" | "png";
  size?: number;
  fallback?:
    | "404" // Return 404 if not found
    | "mm" // Mystery man
    | "identicon" // Geometric pattern based on hash
    | "monsterid" // A generated monster icon
    | "wavatar" // A generated face
    | "retro" // 8-bit icon
    | "blank"; // A transparent png
  rating?: "g" | "pg" | "r" | "x";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.avatar(opts));
}

export function MockColor(opts?: {
  format?: "hex" | "shorthex" | "rgb" | "0x";
  grayscale?: boolean;
  casing?: "upper" | "lower";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.color(opts));
}

export function MockCompany(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.company());
}

export function MockDomain(opts?: { tld?: string }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.domain(opts));
}

export function MockEmail(
  opts?: Partial<Chance.EmailOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.email(opts));
}

export function MockFacebookId(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.fbid());
}

export function MockGoogleAnalytics(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.google_analytics());
}

export function MockHashtag(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.hashtag());
}

export function MockIp(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.ip());
}

export function MockIpv6(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.ipv6());
}

export function MockKlout(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.klout());
}

export function MockProfession(opts?: { rank?: boolean }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.profession(opts));
}

export function MockTopLevelDomain(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.tld());
}

export function MockTwitterHandle(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.twitter());
}

export function MockUrl(opts?: Partial<Chance.UrlOptions>): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.url(opts));
}

export function MockMacAddress(
  opts?: Partial<Chance.MacOptions>
): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.mac_address(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* -------------------------------- Location -------------------------------- */
export function MockAddress(opts?: {
  short_suffix?: boolean;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.address(opts));
}

export function MockAltitude(opts?: {
  max?: number;
  fixed?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.altitude(opts));
}

export function MockAreaCode(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.areacode());
}

export function MockCity(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.city());
}

export function MockCoordinates(opts?: { fixed?: number }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.coordinates(opts));
}

export function MockCountry(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.country());
}

export function MockDepth(opts?: {
  min?: number;
  fixed?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.depth(opts));
}

export function MockGeohash(opts?: { length?: number }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.geohash(opts));
}

export function MockLatitude(opts?: {
  min?: number;
  max?: number;
  fixed?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.latitude(opts));
}

export function MockLocale(opts?: { region: true }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.locale(opts));
}

export function MockLongitude(opts?: {
  min?: number;
  max?: number;
  fixed?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.longitude(opts));
}

export function MockPhone(opts?: {
  formatted?: boolean;
  country?: "us" | "uk" | "fr";
  mobile?: boolean;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.phone(opts));
}

export function MockPostal(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.postal());
}

export function MockPostcode(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.postcode());
}

export function MockProvince(opts?: {
  full?: boolean;
  country?: "ca" | "it";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.province(opts));
}

export function MockState(opts?: {
  full?: boolean;
  territories?: boolean;
  armed_forces?: boolean;
  us_states_and_dc?: boolean;
  country?: "us" | "it" | "mx" | "uk";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.state(opts));
}

export function MockStreet(opts?: {
  short_suffix?: boolean;
  syllables?: number;
  country?: "us" | "it";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.street(opts));
}

export function MockZip(opts?: { plusfour?: boolean }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.zip(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* ---------------------------------- Time ---------------------------------- */
export function MockAmPm(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.ampm());
}

export function MockDate(
  opts?: Omit<Chance.DateOptions, "string">
): PropertyDecorator {
  return Mock(async () =>
    JSON.stringify((await getChanceInstance())?.date(opts!))
  );
}

export function MockHammertime(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.hammertime());
}

export function MockHour(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.hour());
}

export function MockMillisecond(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.millisecond());
}

export function MockMinute(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.minute());
}

export function MockMonth(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.month());
}

export function MockSecond(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.second());
}

export function MockTimestamp(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.timestamp());
}

export function MockTimeZone(opts: {
  value: keyof Chance.Timezone;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.timezone()[opts.value]);
}

export function MockWeekday(opts?: {
  weekday_only?: boolean;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.weekday(opts!));
}

export function MockYear(opts?: {
  min?: number;
  max?: number;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.year(opts));
}
/* -------------------------------------------------------------------------- */
/*/
/* --------------------------------- Finance -------------------------------- */
export function MockCreditCard(opts?: {
  type?:
    | "American Express"
    | "amex"
    | "Bankcard"
    | "bankcard"
    | "China UnionPay"
    | "chinaunion"
    | "Diners Club Carte Blanche"
    | "dccarte"
    | "Diners Club enRoute"
    | "dcenroute"
    | "Diners Club International"
    | "dcintl"
    | "Diners Club United States & Canada"
    | "dcusc"
    | "Discover Card"
    | "discover"
    | "InstaPayment"
    | "instapay"
    | "JCB"
    | "jcb"
    | "Laser"
    | "laser"
    | "Maestro"
    | "maestro"
    | "Mastercard"
    | "mc"
    | "Solo"
    | "solo"
    | "Switch"
    | "switch"
    | "Visa"
    | "visa"
    | "Visa Electron"
    | "electron";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.cc(opts));
}

export function MockCreditCardType(opts: {
  value: keyof Chance.CreditCardType;
}): PropertyDecorator {
  return Mock(
    async () =>
      (
        (await getChanceInstance())?.cc_type({
          raw: true
        }) as Chance.CreditCardType
      )[opts.value]
  );
}

export function MockCurrency(opts: {
  type: keyof Chance.Currency;
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.currency()[opts.type]);
}

export function MockDollar(opts?: { max?: number }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.dollar(opts));
}

export function MockEuro(opts?: { max?: number }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.euro(opts));
}

export function MockCreditCardExpiration(opts: {
  type: keyof Chance.CreditCardExpiration;
}): PropertyDecorator {
  return Mock(
    async () =>
      ((await getChanceInstance())?.exp(opts) as Chance.CreditCardExpiration)[
        opts.type
      ]
  );
}
/* -------------------------------------------------------------------------- */
/*/
/* ------------------------------ Miscellaneous ----------------------------- */
export function MockCoin(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.coin());
}

export function MockDice4(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d4());
}

export function MockDice6(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d6());
}

export function MockDice8(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d8());
}

export function MockDice10(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d10());
}

export function MockDice12(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d12());
}

export function MockDice30(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d30());
}

export function MockDice100(): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.d100());
}

export function MockGUID(opts?: { version: 4 | 5 }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.guid(opts));
}

export function MockHash(opts?: {
  length?: number;
  casing?: "upper" | "lower";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.hash(opts));
}

export function MockRadio(opts?: {
  side?: "east" | "west";
}): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.radio(opts));
}

export function MockTV(opts?: { side?: "east" | "west" }): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.tv(opts));
}

export function MockRPG(opts: {
  rolls: `${number}#${4 | 6 | 8 | 10 | 12 | 30 | 100}`;
}): PropertyDecorator {
  return Mock(async () =>
    (await getChanceInstance())?.rpg(opts.rolls, { sum: true })
  );
}
/* -------------------------------------------------------------------------- */
/*/
/* --------------------------------- Helpers -------------------------------- */
export function MockPick(values: JSONValue[]): PropertyDecorator {
  return Mock(async () => (await getChanceInstance())?.pickone(values));
}
/* -------------------------------------------------------------------------- */
