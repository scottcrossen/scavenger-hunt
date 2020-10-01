import { Action } from 'redux';
import { Location } from './position';
import { ThunkAction } from 'redux-thunk';
import { GlobalState } from './root-reducer';

export interface HuntItem {
  id: string;
  hint: string;
  location: Location;
  description: string;
  proximity: number;
}

export interface HuntCourse {
  title: string;
  description: string;
  items: HuntItem[];
}

export interface HuntState {
  courses: { [id: string]: HuntCourse | null };
}

enum HuntActionType {
  UPSERT = 'UPSERT_HUNT',
}

interface HuntAction extends Action<HuntActionType> {
  type: HuntActionType;
}

interface UpsertHuntCourse extends HuntAction {
  type: HuntActionType.UPSERT;
  id: string;
  course: HuntCourse | null;
}

export function huntReducer(
  state: HuntState = { courses: {} },
  action: HuntAction,
): HuntState {
  switch (action.type) {
    case HuntActionType.UPSERT: {
      const castedAction = action as UpsertHuntCourse;
      if (castedAction.course && castedAction.course.items.length) {
        state.courses[castedAction.id] = castedAction.course;
      } else {
        state.courses[castedAction.id] = null;
      }
      return { ...state };
    }
    default: {
      return state;
    }
  }
}

const upsertCourseAction = (
  id: string,
  course: HuntCourse | null,
): UpsertHuntCourse => ({
  type: HuntActionType.UPSERT,
  id,
  course,
});

const BASE_URL =
  'https://firestore.googleapis.com/v1/projects/scavenger-hunt-1/databases/(default)/documents/courses/';

const hasNullValues = (
  object: { [s: string]: unknown } | ArrayLike<unknown>,
): boolean => {
  if (typeof object === 'object') {
    return Object.values(object).some(hasNullValues);
  } else if (object === null || object === undefined) {
    return true;
  } else {
    return false;
  }
};

type FirestoreCourseFields = {
  id: { stringValue: string };
  hint: { stringValue: string };
  description: { stringValue: string };
  location: {
    mapValue: {
      fields: {
        latitude: { doubleValue?: number; integerValue: number };
        longitude: { doubleValue?: number; integerValue: number };
      };
    };
  };
  proximity: { integerValue: number };
};

export const loadCourse = (
  courseId: string,
): (() => ThunkAction<void, GlobalState, unknown, Action<HuntActionType>>) => {
  return () => (dispatch, getState): void => {
    if (!courseId) {
      return;
    }
    if (getState().hunt.courses[courseId] !== undefined) {
      return;
    }
    fetch(BASE_URL + courseId)
      .then((result) =>
        result
          .json()
          .then((response) => response.fields)
          .then((document) => ({
            title: document.title.stringValue,
            description: document.description.stringValue,
            items: document.items.arrayValue.values
              .map(
                (item: { mapValue: { fields: FirestoreCourseFields } }) =>
                  item.mapValue.fields,
              )
              .map((item: FirestoreCourseFields) => ({
                id: item.id.stringValue,
                hint: item.hint.stringValue,
                description: item.description.stringValue,
                location: {
                  latitude: Number(
                    item.location.mapValue.fields.latitude.doubleValue ||
                      item.location.mapValue.fields.longitude.integerValue,
                  ),
                  longitude: Number(
                    item.location.mapValue.fields.longitude.doubleValue ||
                      item.location.mapValue.fields.longitude.integerValue,
                  ),
                },
                proximity: Number(item.proximity.integerValue),
              })),
          }))
          .then((course) => {
            if (hasNullValues(course)) {
              return Promise.reject(
                `Object did not have all necessary keys: ${JSON.stringify(
                  course,
                )}`,
              );
            } else {
              return Promise.resolve(course as HuntCourse);
            }
          })
          .then((course: HuntCourse) => {
            if (course.items.length) {
              return Promise.resolve(course);
            } else {
              return Promise.reject('Course did not include any items.');
            }
          })
          .then((course: HuntCourse) =>
            dispatch(upsertCourseAction(courseId, course)),
          )
          .catch((error) => {
            console.log(`Error while loading course from backend: ${error}`);
            return Promise.reject('error');
          }),
      )
      .catch(() => dispatch(upsertCourseAction(courseId, null)));
  };
};
