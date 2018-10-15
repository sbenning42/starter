import {
  ZtoAction,
  ZtoHeader,
  correlationHeader,
  mergeHeaders,
  startAsyncHeader,
  correlatedHeader,
  stopAsyncHeader,
  sequencedHeader,
  uniqueHeader,
  trackedHeader
} from '../zto-helpers';

export enum ZtohubActionTypes {
  themesFetch = '[ztohub] themes fetch command',
  themesFetched = '[ztohub] themes fetched event',
  themes = '[ztohub] themes document',
  filtersFetch = '[ztohub] filters fetch command',
  filtersFetched = '[ztohub] filters fetched event',
  filters = '[ztohub] filters document',
}

export class ZtohubThemesFetch implements ZtoAction<undefined> {
  type = ZtohubActionTypes.themesFetch;
  header: ZtoHeader;
  constructor(header: ZtoHeader, loaderStart: boolean = true) {
    this.header = mergeHeaders(
      correlationHeader({correlationType: ZtohubActionTypes.themesFetch}),
      sequencedHeader({...header.sequence, sequenceIndex: 5}),
      loaderStart ? startAsyncHeader({loaderContent: 'Fetching zto hub themes ...'}) : undefined,
    );
  }
}
export class ZtohubThemesFetched implements ZtoAction<{themes: any[]}> {
  type = ZtohubActionTypes.themesFetched;
  header: ZtoHeader;
  constructor(public payload: {themes: any[]}, header: ZtoHeader, loaderStop: boolean = true) {
    this.header = mergeHeaders(
      trackedHeader(),
      correlatedHeader(header.correlation),
      sequencedHeader({...header.sequence, sequenceIndex: 6}),
      loaderStop ? stopAsyncHeader() : undefined,
    );
  }
}
export class ZtohubThemes implements ZtoAction<{themes: any[]}> {
  type = ZtohubActionTypes.themes;
  header: ZtoHeader;
  constructor(public payload: {themes: any[]}, header: ZtoHeader) {
    this.header = mergeHeaders(
      uniqueHeader(),
      correlatedHeader(header.correlation),
    );
  }
}
export class ZtohubFiltersFetch implements ZtoAction<undefined> {
  type = ZtohubActionTypes.filtersFetch;
  header: ZtoHeader;
  constructor(header: ZtoHeader, loaderStart: boolean = true) {
    this.header = mergeHeaders(
      correlationHeader({correlationType: ZtohubActionTypes.filtersFetch}),
      sequencedHeader({...header.sequence, sequenceIndex: 7}),
      loaderStart ? startAsyncHeader({loaderContent: 'Fetching zto hub filters ...'}) : undefined,
    );
  }
}
export class ZtohubFiltersFetched implements ZtoAction<{filters: any[]}> {
  type = ZtohubActionTypes.filtersFetched;
  header: ZtoHeader;
  constructor(public payload: {filters: any[]}, header: ZtoHeader, loaderStop: boolean = true) {
    this.header = mergeHeaders(
      trackedHeader(),
      correlatedHeader(header.correlation),
      sequencedHeader({...header.sequence, sequenceIndex: 8}),
      loaderStop ? stopAsyncHeader() : undefined,
    );
  }
}
export class ZtohubFilters implements ZtoAction<{filters: any[]}> {
  type = ZtohubActionTypes.filters;
  header: ZtoHeader;
  constructor(public payload: {filters: any[]}, header: ZtoHeader) {
    this.header = mergeHeaders(
      uniqueHeader(),
      correlatedHeader(header.correlation),
    );
  }
}
export type ZtohubActions = ZtohubThemesFetch
|ZtohubThemesFetched
|ZtohubThemes
|ZtohubFiltersFetch
|ZtohubFiltersFetched
|ZtohubFilters;
