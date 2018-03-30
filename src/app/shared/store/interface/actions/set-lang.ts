export class InterfaceSetLanguage {
  readonly type = '[Interface] Set language';
  constructor(public payload: string) {}
}

export class InterfaceLanguageLoadSuccess {
  readonly type = '[Interface] Language load complete';
  constructor() {}
}
