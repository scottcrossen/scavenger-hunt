import React = require('react');
import { loadCourse } from '../../state/hunt';
import { withLoading } from '../util/with-loading';
import { CourseIdProps } from './course-from-url';

export const queryForCourse = <P extends object>(
  Component: React.ComponentType<P & CourseIdProps>,
): React.ComponentType<P & CourseIdProps> => {
  const QueryForCourse = (props: P & CourseIdProps): React.ReactElement => {
    const NewComponent = withLoading(loadCourse(props.course))(Component);
    return <NewComponent {...props} />;
  };
  return QueryForCourse;
};
