import * as React from 'react';
import { useParams } from 'react-router-dom';

export interface CourseIdProps {
  item: string | null;
  course: string;
}

export const courseIdFromUrl = <P extends object>(
  Component: React.ComponentType<P & CourseIdProps>,
): React.ComponentType<P> => {
  return (props: P): React.ReactElement => {
    const { item, course } = useParams();
    if (!course) {
      return <div>Malformed URL</div>;
    } else {
      return <Component {...props} course={course} item={item || null} />;
    }
  };
};
