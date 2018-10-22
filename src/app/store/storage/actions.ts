import {
  ZtoReply,
  ZtoAction,
  ZtoRequest,
  sequencedFactory,
  loadingStopFactory,
  loadingStartFactory,
  mergeHeaders,
  sourceFactory
} from '../zto-store/models';

// ACTIONS TEMPLATE:

export enum StorageActionTypes {
  ClearReply = '[Storage] Clear Reply',
  ClearRequest = '[Storage] Clear Request',
  SaveReply = '[Storage] Save Reply',
  SaveRequest = '[Storage] Save Request',
  LoadReply = '[Storage] Load Reply',
  LoadRequest = '[Storage] Load Request',
  FirstLoadRequest = '[Storage] First Load Request',
  FirstLoadReply = '[Storage] First Load Reply',
  DeleteReply = '[Storage] Delete Reply',
  DeleteRequest = '[Storage] Delete Request',
}
export class StorageClearReply extends ZtoReply {
  constructor(public payload: {}, action: ZtoAction) {
    super(StorageActionTypes.ClearReply, action, loadingStopFactory(action.header));
  }
}
export class StorageClearRequest extends ZtoRequest {
  constructor() {
    super(
      StorageActionTypes.ClearRequest,
      loadingStartFactory(StorageActionTypes.ClearRequest, `Clearing storage ...`),
    );
  }
}
export class StorageSaveReply extends ZtoReply {
  constructor(
    public payload: {
      storage: {
        [id: string]: string;
      };
    },
    action: ZtoAction
  ) {
    super(StorageActionTypes.SaveReply, action, loadingStopFactory(action.header));
  }
}
export class StorageSaveRequest extends ZtoRequest {
  constructor(
    public payload: {
      storage: {
        [id: string]: string;
      };
    }
  ) {
    super(
      StorageActionTypes.SaveRequest,
      loadingStartFactory(StorageActionTypes.DeleteRequest, `Saving storage ${
        Object.keys(payload.storage).toString()
      } ...`),
    );
  }
}
export class StorageFirstLoadReply extends ZtoReply {
  constructor(
    public payload: {
      storage: {
        [id: string]: string;
      };
    },
    action: ZtoAction
  ) {
    super(StorageActionTypes.FirstLoadReply, action, sequencedFactory(action.header));
  }
}
export class StorageFirstLoadRequest extends ZtoRequest {
  constructor(public action: ZtoAction, source?: string) {
    super(StorageActionTypes.FirstLoadRequest, mergeHeaders(
      sequencedFactory(action.header),
      sourceFactory(source ? source : action.type),
    ));
  }
}
export class StorageLoadReply extends ZtoReply {
  constructor(
    public payload: {
      storage: {
        [id: string]: string;
      };
    },
    action: ZtoAction
  ) {
    super(StorageActionTypes.LoadReply, action, loadingStopFactory(action.header));
  }
}
export class StorageLoadRequest extends ZtoRequest {
  constructor(source: string) {
    super(StorageActionTypes.LoadRequest, mergeHeaders(
      loadingStartFactory(StorageActionTypes.LoadRequest, 'Loading Storage ...'),
      sourceFactory(source),
    ));
  }
}
export class StorageDeleteReply extends ZtoReply {
  constructor(
    public payload: {
      key: string
    },
    action: ZtoAction
  ) {
    super(StorageActionTypes.DeleteReply, action, loadingStopFactory(action.header));
  }
}
export class StorageDeleteRequest extends ZtoRequest {
  constructor(
    public payload: {
      key: string
    },
  ) {
    super(
      StorageActionTypes.DeleteRequest,
      loadingStartFactory(StorageActionTypes.DeleteRequest, `Deleting item ${payload.key} ...`),
    );
  }
}
export type StorageActions =
  | StorageClearReply
  | StorageClearRequest
  | StorageSaveReply
  | StorageSaveRequest
  | StorageLoadReply
  | StorageLoadRequest
  | StorageDeleteReply
  | StorageDeleteRequest;
