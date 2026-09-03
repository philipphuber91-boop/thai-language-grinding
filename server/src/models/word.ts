export interface Word {
  id: string;
  thai: string;
  romanization?: string;
  meanings: WordMeaning[];
}

export interface WordMeaning {
  id: string;
  german: string;
  context?: string;
}
