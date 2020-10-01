import React = require('react');
import { GlobalState } from '../../state/root-reducer';
import { HuntCourse, HuntItem } from '../../state/hunt';
import { connect } from 'react-redux';
import { Location } from '../../state/position';
import { NotFound, Loading } from '../error';
import Splash from '../splash';
import { CourseIdProps } from './course-from-url';

export interface CourseProps {
  title: string;
  description: string;
  current: {
    hint: string;
    location: Location;
    proximity: number;
    description: string;
  };
  next: {
    id: string;
  } | null;
}

export const withCourse = <P extends object>(
  Component: React.ComponentType<P & CourseIdProps & CourseProps>,
): React.ComponentType<P & CourseIdProps> => {
  const wrapper: React.ComponentType<{
    hunt: HuntCourse | null | undefined;
  }> = (props: P & CourseIdProps & { hunt: HuntCourse | null | undefined }) => {
    if (
      props.hunt &&
      props.item !== null &&
      props.hunt.items.every((item) => item.id !== props.item)
    ) {
      return <NotFound />;
    } else if (props.hunt === null) {
      return <Splash invalidCourse />;
    } else if (props.hunt === undefined) {
      return <Loading />;
    }
    let currentItem: null | HuntItem = null;
    let nextItem: undefined | null | HuntItem = props.item ? undefined : null;
    for (const item of props.hunt.items) {
      if (props.item && item.id === props.item) {
        currentItem = item;
      }
      if (nextItem === null) {
        nextItem = item;
        break;
      } else if (props.item && item.id === props.item) {
        nextItem = null;
      }
    }
    const courseProps = {
      title: props.hunt.title,
      description: props.hunt.description,
      current: currentItem || null,
      next: nextItem || null,
    };
    return <Component {...props} {...courseProps} />;
  };
  return (props: P & CourseIdProps): React.ReactElement => {
    const mapStateToProps = (
      state: GlobalState,
    ): { hunt: HuntCourse | null | undefined } => ({
      hunt: state.hunt.courses[props.course],
    });
    const Output = connect(mapStateToProps)(wrapper);
    return <Output {...props} />;
  };
};
