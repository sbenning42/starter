import {
  ZtoAction,
  ZtoHeader,
  uniqueHeader,
  correlationHeader,
  CorrelationHeader,
  correlatedHeader,
  trackedHeader,
  startAsyncHeader,
  stopAsyncHeader,
  sequenceHeader,
  sequencedHeader,
  SequenceHeader,
  mergeHeaders
} from '../zto-helpers';

export enum AppActionTypes {
  name = '[app] name document',
  version = '[app] version document',
  lang = '[app] lang document',
  checkNetworkStatus = '[app] check network status command',
  online = '[app] online event',
  offline = '[app] offline event',
  initialize = '[app] initialize command',
  initialized = '[app] initialized event',
  localStorageFetch = '[app] local storage fetch command',
  localStorageFetched = '[app] local storage fetched event',
  localStorageDocument = '[app] local storage documment',
  localStorageSave = '[app] local storage save command',
  localStorageSaved = '[app] local storage saved event',
}
export class AppName implements ZtoAction<{name: string}> {
  type = AppActionTypes.name;
  header: ZtoHeader = uniqueHeader();
  constructor(public payload: {name: string}) {}
}
export class AppVersion implements ZtoAction<{version: string}> {
  type = AppActionTypes.version;
  header: ZtoHeader = uniqueHeader();
  constructor(public payload: {version: string}) {}
}
export class AppLang implements ZtoAction<{lang: string}> {
  type = AppActionTypes.lang;
  header: ZtoHeader = uniqueHeader();
  constructor(public payload: {lang: string}) {}
}
export class AppInitialize implements ZtoAction<undefined> {
  type = AppActionTypes.initialize;
  header: ZtoHeader = mergeHeaders(
    correlationHeader({correlationType: AppActionTypes.initialize}),
    sequenceHeader({sequenceIndex: 0, sequenceLength: 5}),
    startAsyncHeader({loaderContent: 'Initializing App ...'})
  );
}
export class AppInitialized implements ZtoAction<undefined> {
  type = AppActionTypes.initialized;
  header: ZtoHeader;
  constructor(header: ZtoHeader) {
    this.header = mergeHeaders(
      correlatedHeader(header.correlation),
      sequencedHeader({...header.sequence, sequenceIndex: header.sequence.sequenceLength}),
      stopAsyncHeader(),
      trackedHeader(),
    );
  }
}
export class AppCheckNetworkStatus implements ZtoAction<undefined> {
  type = AppActionTypes.checkNetworkStatus;
  header: ZtoHeader;
  constructor(header: ZtoHeader, startLoader: boolean = true) {
    this.header = mergeHeaders(
      correlationHeader({correlationType: AppActionTypes.checkNetworkStatus}),
      sequencedHeader({...header.sequence, sequenceIndex: 1}),
      trackedHeader(),
      startLoader ? startAsyncHeader({loaderContent: 'Checking network status ...'}) : undefined,
    );
  }
}
export class AppOnline implements ZtoAction<undefined> {
  type = AppActionTypes.online;
  header: ZtoHeader;
  constructor(header: ZtoHeader, stopLoader: boolean = true) {
    this.header = mergeHeaders(
      correlatedHeader(header.correlation),
      sequencedHeader({...header.sequence, sequenceIndex: 2}),
      trackedHeader(),
      stopLoader ? stopAsyncHeader() : undefined,
    );
  }
}
export class AppOffline implements ZtoAction<undefined> {
  type = AppActionTypes.offline;
  header: ZtoHeader;
  constructor(header: ZtoHeader, stopLoader: boolean = true) {
    this.header = mergeHeaders(
      correlatedHeader(header.correlation),
      sequencedHeader({...header.sequence, sequenceIndex: 2}),
      trackedHeader(),
      stopLoader ? stopAsyncHeader() : undefined,
    );
  }
}
export class AppLsFetch implements ZtoAction<undefined> {
  type = AppActionTypes.localStorageFetch;
  header: ZtoHeader;
  constructor(header: ZtoHeader) {
    this.header = mergeHeaders(
      correlationHeader({correlationType: AppActionTypes.localStorageFetch}),
      sequencedHeader({...header.sequence, sequenceIndex: 3})
    );
  }
}
export class AppLsFetched implements ZtoAction<{storage: {[key: string]: string}}> {
  type = AppActionTypes.localStorageFetched;
  header: ZtoHeader;
  constructor(
    public payload: {storage: {[key: string]: string}},
    header: ZtoHeader,
  ) {
    this.header = mergeHeaders(
      correlatedHeader(header.correlation),
      sequencedHeader({...header.sequence, sequenceIndex: 4}),
      trackedHeader(),
    );
  }
}
export class AppLsDocument implements ZtoAction<{storage: {[key: string]: string}}> {
  type = AppActionTypes.localStorageDocument;
  header: ZtoHeader;
  constructor(
    public payload: {storage: {[key: string]: string}},
    header: ZtoHeader,
  ) {
    this.header = mergeHeaders(
      uniqueHeader(),
      header && header.correlation ? correlatedHeader(header.correlation) : undefined,
    );
  }
}
export class AppLsSave implements ZtoAction<{storage: {[key: string]: string}}> {
  type = AppActionTypes.localStorageSave;
  header: ZtoHeader = correlationHeader({correlationType: AppActionTypes.localStorageSave});
  constructor(public payload: {storage: {[key: string]: string}}) {}
}
export class AppLsSaved implements ZtoAction<{storage: {[key: string]: string}}> {
  type = AppActionTypes.localStorageSaved;
  header: ZtoHeader;
  constructor(
    public payload: {storage: {[key: string]: string}},
    header: ZtoHeader,
  ) {
    this.header = mergeHeaders(
      correlatedHeader(header.correlation),
      trackedHeader(),
    );
  }
}
export type AppActions = AppName
|AppVersion
|AppLang
|AppCheckNetworkStatus
|AppOnline
|AppOffline
|AppInitialize
|AppInitialized
|AppLsFetch
|AppLsFetched
|AppLsDocument
|AppLsSave
|AppLsSaved;
