import { Middleware, Reducer, ReducersMapObject, StoreEnhancer } from 'redux';
import { strictEqual } from 'assert';
import { stringDistance } from 'codelyzer/util/utils';

/**
 * state数据接口
 */
export interface State {
  [extraProps: string]: any;
}

/**
 * reducer增强函数
 */
export type ReducerEnhancer<S extends State = State> = (reducer: Reducer<S>) => Reducer<S>;

/**
 * store 配置接口
 */
export interface StoreOptions<S extends State = State> {
  /**
   * root reducer 增强
   */
  reducerEnhancer: ReducerEnhancer<S>;
  /**
   * 额外的reducer
   * 使用redux 函数式的方式扩充store中reducer
   * 用于不支持自动扫描的场景,加入reducer
   */
  extraReducers: ReducersMapObject;
  /**
   * 初始状态
   */
  initState: S;
  /**
   * redux中间件
   */
  middleware: Middleware[];
  /**
   * 额外的reduxstore增强函数
   */
  extraEnhancers: StoreEnhancer<S>[];
  /**
   * 是否开启redux devtool
   */
  devtool: boolean;

  [key: string]: any;
}

/**
 * 实体总状态定义
 */
export type EntityState = { [key: string]: any } | any[];

/**
 * store存储中基础实体单元
 */
export interface Entity<S extends EntityState> {
  /**
   * 命名空间
   */
  namespace: string;
  /**
   * 状态树,用于定义并初始化namespace下的state
   */
  state: S;
  /**
   * action和draft之间映射
   */
  actionDraftMap: {
    [key: string]: DraftInterface;
  };
}

/**
 * draft函数接口
 * 1.必须为纯函数
 * 2.实际调用时,参数+1
 * 3.返回值没有意义
 */
export type DraftInterface = (...args: any[]) => any;
