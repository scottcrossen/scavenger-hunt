import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

export const distance = (loc1: Location, loc2: Location): number => {
  const R = 6371e3;
  const φ1 = (loc1.latitude * Math.PI) / 180;
  const φ2 = (loc2.latitude * Math.PI) / 180;
  const Δφ = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const Δλ = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PositionState {
  location: Location | null;
  blocked: boolean | null;
}

enum PositionActionType {
  UPDATE = 'UPDATE_POSITION',
  BLOCKED = 'BLOCK_POSITION',
}

interface PositionAction extends Action<PositionActionType> {
  type: PositionActionType;
}

interface UpdatePositionAction extends PositionAction {
  type: PositionActionType.UPDATE;
  location: Location;
}

interface BlockPositionAction extends PositionAction {
  type: PositionActionType.BLOCKED;
}

const updatePositionAction = (position: Position): UpdatePositionAction => ({
  type: PositionActionType.UPDATE,
  location: {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  },
});

const blockPositionAction = (): BlockPositionAction => ({
  type: PositionActionType.BLOCKED,
});

export function positionReducer(
  state: PositionState = { location: null, blocked: null },
  action: PositionAction,
): PositionState {
  switch (action.type) {
    case PositionActionType.UPDATE:
      return Object.assign({}, state, {
        location: (action as UpdatePositionAction).location,
        blocked: false,
      });
    case PositionActionType.BLOCKED:
      return Object.assign({}, state, { location: null, blocked: true });
    default:
      return state;
  }
}

export const loadPosition = (): ThunkAction<
  void,
  PositionState,
  unknown,
  Action<PositionActionType>
> => (dispatch): void => {
  navigator.geolocation.getCurrentPosition(
    (position) => dispatch(updatePositionAction(position)),
    () => dispatch(blockPositionAction()),
  );
};
