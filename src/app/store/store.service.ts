import { Injectable } from '@angular/core';
import { combineReducers, compose, createStore, Store } from 'redux';

const NAMESPACE_SEP = '/';
// Internal model to update global state when do unmodel
const dvaModel = {
  namespace: '@@dva',
  state: 0,
  reducers: {
    UPDATE(state) {
      return state + 1;
    }
  }
};

@Injectable()
export class StoreService {

  private _models: any[] = [dvaModel];
  private readonly _store: Store<any>;


  constructor() {
    const reducers = this.createReducer();
    const enhancers = [];
    this._store = createStore(reducers, {}, compose(...enhancers));
  }

  private createReducer(initReducers: any = {}) {
    const reducers = {};
    for (const m of this._models) {
      reducers[m.namespace] = this.getReducer(m.reducers, m.state);
    }
    return combineReducers({
      ...initReducers,
      ...reducers,
      ...(this._store ? this._store['asyncReducers'] : {})
    });
  }

  private getReducer(reducers: any, state: any): any {
    return this.handleActions(reducers || {}, state);
  }

  private handleActions(handlers: any, defaultState: any): any {
    const reducers = Object.keys(handlers).map(type => this.handleAction(type, handlers[type]));
    const reducer = this.reduceReducers(...reducers);
    return (state = defaultState, action) => reducer(state, action);
  }

  private handleAction(actionType, reducer = identify) {
    return (state, action) => {
      const { type } = action;
      if (type && actionType !== type) {
        return state;
      }
      return reducer(state, action);
    };
  }

  private reduceReducers(...reducers) {
    return (previous, current) =>
      reducers.reduce(
        (p, r) => r(p, current),
        previous,
      );
  }

  model(model: any) {
    this._models.push(model);
    const store = this._store;
    if (model.reducers) {
      store['asyncReducers'][model.namespace] = this.getReducer(model.reducers, model.state);
      store.replaceReducer(this.createReducer());
    }
  }

  unmodel() {
  }
}

function identify(value, ...args) {
  return value;
}

