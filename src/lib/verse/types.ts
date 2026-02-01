// src/lib/verse/types.ts

export type TranslationCode = "WEB";

export type VerseRef = {
  reference: string; // e.g. "John 3:16"
  translation: TranslationCode; // "WEB"
};

export type VerseTextResult = {
  reference: string;
  translation: TranslationCode;
  text: string;
  sourceUrl?: string;
};
