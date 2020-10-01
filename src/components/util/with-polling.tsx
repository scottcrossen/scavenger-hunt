import * as React from 'react';
import { connect, ConnectedComponent } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

type PollingAction<State, ActionType> = () => ThunkAction<
  void,
  State,
  unknown,
  Action<ActionType>
>;

interface WithPollingProps<State, ActionType> {
  pollingAction: PollingAction<State, ActionType>;
}

export const withPolling = <State, ActionType>(
  pollingAction: PollingAction<State, ActionType>,
  duration = 2000,
) => <P extends object>(
  Component: React.ComponentType<P>,
): ConnectedComponent<
  React.ComponentType<WithPollingProps<State, ActionType>>,
  Pick<WithPollingProps<State, ActionType>, never>
> => {
  const wrapper: () => React.ComponentType<
    WithPollingProps<State, ActionType>
  > = () =>
    class WithPolling extends React.Component<
      P & WithPollingProps<State, ActionType>
    > {
      dataPolling: NodeJS.Timeout;
      componentDidMount(): void {
        this.props.pollingAction();
        this.dataPolling = setInterval(this.props.pollingAction, duration);
      }
      componentWillUnmount(): void {
        clearInterval(this.dataPolling);
      }
      render(): React.ReactElement {
        return <Component {...(this.props as P)} />;
      }
    };
  const mapStateToProps = (): {} => ({});
  const mapDispatchToProps = { pollingAction };
  return connect(mapStateToProps, mapDispatchToProps)(wrapper());
};
