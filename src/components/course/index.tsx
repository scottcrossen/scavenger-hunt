import React = require('react');
import { withCourse, CourseProps } from './with-course';
import { queryForCourse } from './query-course';
import { courseIdFromUrl, CourseIdProps } from './course-from-url';
import CourseItem from './item';
import CourseHome from './home';

export const Course = (
  props: CourseProps & CourseIdProps,
): React.ReactElement => {
  if (props.item) {
    return <CourseItem {...props} />;
  } else {
    return <CourseHome {...props} />;
  }
};

const WrappedCourse: React.ComponentType<{}> = courseIdFromUrl(
  queryForCourse(withCourse(Course)),
);

export default WrappedCourse;
