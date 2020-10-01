import React = require('react');

export const Loading = (): React.ReactElement => <div>Loading</div>;

export const NotFound = (): React.ReactElement => <div>Page not found</div>;

export const PositionNotEnabled = (): React.ReactElement => (
  <div>Position API not enabled</div>
);
