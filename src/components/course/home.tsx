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

type Props = CourseProps &
  CourseIdProps & { classes: { [key: string]: string } };
type State = { page: number };

class CourseHome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { page: 0 };
  }
  page1(): React.ReactElement {
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
            {this.props.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button onClick={this.nextPage} color="primary">
            Next
          </Button>
        </CardActions>
      </Card>
    );
  }
  page2(): React.ReactElement {
    return (
      <Card className={this.props.classes.root}>
        <CardContent>
          <Typography
            variant="h6"
            className={this.props.classes.title}
            color="textSecondary"
          >
            How it works
          </Typography>
          <Typography
            variant="body1"
            className={this.props.classes.description}
            color="textSecondary"
          >
            You will be given a hint. Go to the location of the hint to get the
            next clue!
          </Typography>
        </CardContent>
        <CardActions>
          <Link
            to={`/courses/${this.props.course}/items/${this.props.next.id}`}
          >
            <Button color="primary">Next</Button>
          </Link>
        </CardActions>
      </Card>
    );
  }
  render(): React.ReactElement {
    const currentPage = this.state.page === 0 ? this.page1() : this.page2();
    return <div className={this.props.classes.container}>{currentPage}</div>;
  }
  nextPage = (): void => {
    this.setState(() => ({ page: 1 }));
  };
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
})(CourseHome);
