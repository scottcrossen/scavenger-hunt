import { PositionProps, withPosition } from './with-position';
import React = require('react');

export const DebugPosition = withPosition((props: PositionProps) => (
  <div>
    Latitude: {props.position.latitude} longitude: {props.position.longitude}
  </div>
));
