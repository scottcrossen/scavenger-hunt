import React = require('react');
import { CourseProps } from './with-course';
import { CourseIdProps } from './course-from-url';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  Button,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { PositionProps, withPosition } from '../position/with-position';
import { distance } from '../../state/position';

type Props = PositionProps &
  CourseProps &
  CourseIdProps & { classes: { [key: string]: string } };

type State = { reachedEnd: boolean };

class CourseItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { reachedEnd: false };
  }
  page1(distanceAway: number): React.ReactElement {
    return (
      <Card className={this.props.classes.root}>
        <CardContent>
          <Typography
            variant="h6"
            className={this.props.classes.title}
            color="textSecondary"
          >
            {this.props.title}
          </Typography>
          <Typography
            variant="body1"
            className={this.props.classes.description}
            color="textSecondary"
          >
            Distance:{' '}
            {distanceAway > 1000
              ? Math.floor(distanceAway / 1000)
              : Math.floor(distanceAway)}{' '}
            {distanceAway > 1000
              ? 'kilometer' + (Math.floor(distanceAway / 1000) === 1 ? '' : 's')
              : 'meter' + (Math.floor(distanceAway) === 1 ? '' : 's')}
          </Typography>
          <Typography
            variant="body1"
            className={this.props.classes.description}
            color="textSecondary"
          >
            Hint: {this.props.current.hint}
          </Typography>
        </CardContent>
      </Card>
    );
  }
  page2(): React.ReactElement {
    const button = this.props.next ? (
      <Link to={`/courses/${this.props.course}/items/${this.props.next.id}`}>
        <Button color="primary">Next</Button>
      </Link>
    ) : (
      <Button onClick={this.setReachedEnd} color="primary">
        Next
      </Button>
    );
    return (
      <Card className={this.props.classes.root}>
        <CardContent>
          <Typography
            variant="h6"
            className={this.props.classes.title}
            color="textSecondary"
          >
            You found the clue!
          </Typography>
          <Typography
            variant="body1"
            className={this.props.classes.description}
            color="textSecondary"
          >
            {this.props.current.description}
          </Typography>
        </CardContent>
        <CardActions>{button}</CardActions>
      </Card>
    );
  }
  page3(): React.ReactElement {
    return (
      <Card className={this.props.classes.root}>
        <CardContent>
          <Typography
            variant="h6"
            className={this.props.classes.title}
            color="textSecondary"
          >
            Congratulations!
          </Typography>
          <Typography
            variant="body1"
            className={this.props.classes.description}
            color="textSecondary"
          >
            You&apos;ve made it to the end of the scavenger hunt!
          </Typography>
        </CardContent>
        <CardActions>
          <Link to={`/`}>
            <Button color="primary">Home</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
  setReachedEnd = (): void => {
    this.setState(() => ({ reachedEnd: true }));
  };
  render(): React.ReactElement {
    const distanceAway = distance(
      this.props.position,
      this.props.current.location,
    );
    let currentPage;
    if (distanceAway > this.props.current.proximity) {
      currentPage = this.page1(distanceAway);
    } else if (!this.state.reachedEnd) {
      currentPage = this.page2();
    } else {
      currentPage = this.page3();
    }
    return <div className={this.props.classes.container}>{currentPage}</div>;
  }
}

export default withStyles({
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
})(withPosition(CourseItem));
