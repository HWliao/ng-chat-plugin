import * as isError from 'invariant';
import * as isWarning from 'warning';
import * as g from 'global';

export const global: Window = g;
export const reflect: any = global['Reflect'];

export const META_DESIGN_TYPE = 'design:type';
export const META_DESIGN_PARAMTYPES = 'design:paramtypes';
export const META_DESGIN_RETURNTYPE = 'design:returntype';
export const META_STORE_NSFACTORY = '@@store:nsFactory';
export const META_STORE_ACTION = '@@store:action';
export const META_STORE_SELECT = '@@store:select';

export const invariant: (condition: boolean, format: string) => void = isError;
export const warning: (condition: boolean, format: string) => void = isWarning;
