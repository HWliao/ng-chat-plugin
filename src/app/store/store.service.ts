import { Inject, Injectable, InjectionToken } from '@angular/core';
import {
  applyMiddleware,
  combineReducers,
  compose,
  createStore,
  Reducer,
  ReducersMapObject,
  Store,
  StoreEnhancer
} from 'redux';
import produce from 'immer';
import { Entity, EntityState, ReducerEnhancer, State, StoreOptions } from './types';

/**
 * StoreOptions的注入令牌
 * @type {InjectionToken<StoreOptions>}
 */
export const StoreOptionsToken = new InjectionToken<StoreOptions>('store_ops');

/**
 * 初始实体单元
 */
export const entiy: Entity<{ count: number }> = {
  namespace: '@@store',
  state: { count: 0 },
  actionDraftMap: {
    UPDATE: (state: { count: number }) => state.count += 1
  }
};
/**
 * namepace和action type之间的分隔符
 * @type {string}
 */
export const DELIMITER = '/';

/**
 * store服务
 */
@Injectable()
export class StoreService {
  /**
   * store所有实体单元
   */
  private readonly _entities: Entity<EntityState>[] = [entiy];
  private readonly _store: Store<State>;

  private readonly _extraReducers: ReducersMapObject;
  private _entityReducers: ReducersMapObject = {};

  constructor(@Inject(StoreOptionsToken) storeOps: StoreOptions) {
    const {
      reducerEnhancer = returnSelf,
      extraReducers = {},
      initState = {},
      middleware = [],
      extraEnhancers = [],
      devtool = true
    } = storeOps;
    this._extraReducers = Object.assign({}, extraReducers);
    this._entityReducers = Object.assign({}, this.getReducer(entiy));

    const enhancers: StoreEnhancer<State>[] = [
      applyMiddleware(...middleware),
      ...extraEnhancers,
      openDevtool(devtool)
    ];

    this._store = createStore<State>(
      createReducer({ ...this._entityReducers, ...this._extraReducers }, reducerEnhancer),
      initState,
      compose(...enhancers)
    );
  }

  getReducer(entity: Entity<EntityState>): ReducersMapObject {
    const { namespace, state: entityState, actionDraftMap } = entity;
    if (this._extraReducers[namespace]) {
      throw new Error(`namespace:${namespace} 在extraReducers中已经存在!`);
    }
    if (this._entityReducers[namespace]) {
      throw new Error(`namespace:${namespace} 在entityReducers中已经存在!`);
    }
    // 给action type加上namespace
    const actionNsDraftMap = prefixNamepace(entity);

    const reducer: Reducer<State> = (state = entityState, action) => {
      // state的边界函数,immer中draft函数
      const draft = actionNsDraftMap[action.type];
      if (draft) {
        return produce(state, (draftState) => {
          draft.apply(draftState, [draftState]);
        });
      }
      return state;
    };
    return { [entity.namespace]: reducer };
  }
}

/**
 * 创建rootReducer
 * @param {ReducerEnhancer} reducerEnhancer
 * @param {ReducersMapObject} reducers
 * @return {Reducer<any>}
 */
function createReducer<S extends State = State>(reducers: ReducersMapObject, reducerEnhancer: ReducerEnhancer<S>): Reducer<S> {
  return reducerEnhancer(combineReducers(reducers));
}

/**
 * 开启redux Devtool
 * @param {boolean} open
 * @return {StoreEnhancer<S>}
 */
function openDevtool<S extends State = State>(open: boolean): StoreEnhancer<S> {
  if (open && window.__REDUX_DEVTOOLS_EXTENSION__) {
    return window.__REDUX_DEVTOOLS_EXTENSION__(window.__REDUX_DEVTOOLS_EXTENSION__OPTIONS);
  }
  return returnSelf;
}

function prefixNamepace(entity: Entity<EntityState>) {
  const { namespace, actionDraftMap } = entity;
  return Object.keys(actionDraftMap).reduce((curr, key) => {
    const type = `${namespace}${DELIMITER}${key}`;
    curr[type] = actionDraftMap[key];
    return curr;
  }, {});
}

export const returnSelf = m => m;
export const noop = () => {
};

