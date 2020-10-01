import * as React from 'react';
import { connect, ConnectedComponent } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

type LoadingAction<State, ActionType> = () => ThunkAction<
  void,
  State,
  unknown,
  Action<ActionType>
>;

interface WithPollingProps<State, ActionType> {
  loadingAction: LoadingAction<State, ActionType>;
}

export const withLoading = <State, ActionType>(
  loadingAction: LoadingAction<State, ActionType>,
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
      componentDidMount(): void {
        this.props.loadingAction();
      }
      render(): React.ReactElement {
        return <Component {...(this.props as P)} />;
      }
    };
  const mapStateToProps = (): {} => ({});
  const mapDispatchToProps = { loadingAction };
  return connect(mapStateToProps, mapDispatchToProps)(wrapper());
};
