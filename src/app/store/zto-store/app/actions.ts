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
  SequenceHeader
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
  header: ZtoHeader = correlationHeader(
    {correlationType: AppActionTypes.initialize},
    sequenceHeader(
      {sequenceIndex: 0, sequenceLength: 3},
      startAsyncHeader({
        loaderContent: 'Initializing App ...',
      }),
    )
  );
}
export class AppInitialized implements ZtoAction<undefined> {
  type = AppActionTypes.initialized;
  header: ZtoHeader;
  constructor(correlation: CorrelationHeader, sequence: SequenceHeader = {}) {
    this.header = correlatedHeader(correlation, sequencedHeader({
      sequenceId: sequence.sequenceId,
      sequenceIndex: sequence.sequenceLength,
      sequenceLength: sequence.sequenceLength
    }, stopAsyncHeader(trackedHeader())));
  }
}
export class AppCheckNetworkStatus implements ZtoAction<undefined> {
  type = AppActionTypes.checkNetworkStatus;
  header: ZtoHeader;
  constructor(sequence: SequenceHeader = {}, startLoader: boolean = true) {
    this.header = correlationHeader(
      {correlationType: AppActionTypes.checkNetworkStatus},
      sequencedHeader(
        {sequenceId: sequence.sequenceId, sequenceLength: sequence.sequenceLength, sequenceIndex: 1},
        startLoader ? startAsyncHeader({
          loaderContent: 'Checking network status ...',
        }) : undefined,
      ),
    );
  }
}
export class AppOnline implements ZtoAction<undefined> {
  type = AppActionTypes.online;
  header: ZtoHeader;
  constructor(correlation: CorrelationHeader, sequence: SequenceHeader = {}, stopLoader: boolean = true) {
    this.header = correlatedHeader(correlation, trackedHeader(sequencedHeader(
      {sequenceId: sequence.sequenceId, sequenceLength: sequence.sequenceLength, sequenceIndex: 2},
      stopLoader ? stopAsyncHeader() : undefined
    )));
  }
}
export class AppOffline implements ZtoAction<undefined> {
  type = AppActionTypes.offline;
  header: ZtoHeader;
  constructor(correlation: CorrelationHeader, sequence: SequenceHeader = {}, stopLoader: boolean = true) {
    this.header = correlatedHeader(correlation, trackedHeader(sequencedHeader(
      {sequenceId: sequence.sequenceId, sequenceLength: sequence.sequenceLength, sequenceIndex: 2},
      stopLoader ? stopAsyncHeader() : undefined
    )));
  }
}
export type AppActions = AppName
|AppVersion
|AppLang
|AppCheckNetworkStatus
|AppOnline
|AppOffline
|AppInitialize
|AppInitialized;
