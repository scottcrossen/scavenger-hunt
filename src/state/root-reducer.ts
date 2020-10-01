import { combineReducers } from 'redux';
import { positionReducer, PositionState } from './position';
import { huntReducer, HuntState } from './hunt';

export const rootReducer = combineReducers({
  position: positionReducer,
  hunt: huntReducer,
});

export interface GlobalState {
  position: PositionState;
  hunt: HuntState;
}
