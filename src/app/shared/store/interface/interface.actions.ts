export class SetMenuCompact {
  static readonly type = '[interface] set menu compact';
  constructor(public payload: boolean) {}
}

export class ToggleMenuCompact {
  static readonly type = '[interface] toggle menu compact';
  constructor() {}
}
