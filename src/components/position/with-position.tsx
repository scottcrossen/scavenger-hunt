import { GlobalState } from '../../state/root-reducer';
import { withPolling } from '../util/with-polling';
import { loadPosition, PositionState, Location } from '../../state/position';
import { connect } from 'react-redux';
import React = require('react');
import { Loading, PositionNotEnabled } from '../error';

export interface PositionProps {
  position: Location;
}

export const withPosition = <P extends object>(
  Component: React.ComponentType<P & PositionProps>,
): React.ComponentType<P> => {
  const mapStateToProps = (
    state: GlobalState,
  ): { position: PositionState } => ({
    position: state.position,
  });
  const wrapper: React.ComponentType<{ position: PositionState }> = (
    props: P & { position: PositionState },
  ) => {
    if (props.position.blocked === null) {
      return <Loading />;
    } else if (props.position.blocked || props.position.location === null) {
      return <PositionNotEnabled />;
    } else {
      return <Component {...props} position={props.position.location} />;
    }
  };
  return withPolling(loadPosition)(connect(mapStateToProps)(wrapper));
};
