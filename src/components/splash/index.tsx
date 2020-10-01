import {
  Button,
  Card,
  CardContent,
  Typography,
  CardActions,
  TextField,
  withStyles,
} from '@material-ui/core';
import React = require('react');
import { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { loadCourse } from '../../state/hunt';
import { connect } from 'react-redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { GlobalState } from '../../state/root-reducer';

const VALIDATE_INPUT = /^[a-z0-9]*$/;

interface Props {
  classes: { [key: string]: string };
  invalidCourse?: boolean;
  loadCourse: <State, ActionType>(
    courseId: string,
  ) => ThunkAction<void, State, unknown, Action<ActionType>>;
}

interface State {
  searchInput: string;
  searchError: boolean;
}

class Splash extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { searchInput: '', searchError: false };
  }
  render(): React.ReactElement {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <Card className={classes.root}>
          <CardContent>
            <Typography
              variant="h6"
              className={classes.title}
              color="textSecondary"
            >
              Find your scavenger hunt
            </Typography>
            <TextField
              label="Enter code"
              variant="outlined"
              error={this.state.searchError || this.props.invalidCourse}
              InputProps={{ type: 'search' }}
              onChange={this.handleInputChange}
              className={classes.input}
            />
          </CardContent>
          <CardActions>
            <Link to={'/courses/' + this.state.searchInput.toLowerCase()}>
              <Button color="primary">Load</Button>
            </Link>
          </CardActions>
        </Card>
      </div>
    );
  }

  handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    const newValue = event.target.value;
    if (newValue.match(VALIDATE_INPUT)) {
      this.setState(() => ({ searchInput: newValue, searchError: false }));
      this.props.loadCourse(newValue.toLowerCase());
    } else {
      this.setState(() => ({ searchInput: newValue, searchError: true }));
    }
  };
}

const mapStateToProps = (): {} => ({});
const mapDispatchToProps = <ActionType extends {}>(
  dispatch: ThunkDispatch<GlobalState, unknown, Action<ActionType>>,
): { loadCourse: (courseId: string) => void } => ({
  loadCourse: (courseId: string): void => dispatch(loadCourse(courseId)()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(
  withStyles({
    container: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      paddingTop: 52,
      paddingBottom: 52,
    },
    root: {
      width: 400,
    },
    title: {
      marginBottom: 12,
    },
    input: {
      width: '100%',
    },
  })(Splash),
);
