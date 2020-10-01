import * as React from 'react';
import * as styles from './styles.scss';
import { Switch, Route } from 'react-router-dom';
import Splash from './splash';
import { DebugPosition } from './position/debug-position';
import Course from './course';

export default function App(): React.ReactElement {
  return (
    <div>
      <Switch>
        <Route path="/debug">
          <DebugPosition />
        </Route>
        <Route path="/courses/:course/items/:item">
          <Course />
        </Route>
        <Route path="/courses/:course">
          <Course />
        </Route>
        <Route path="/">
          <Splash />
        </Route>
      </Switch>
      <style>{styles}</style>
    </div>
  );
}
