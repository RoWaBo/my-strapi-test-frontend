import { EventInfo } from './components';

export interface MediaImage {
  data: {
    attributes: {
      alternativeText: string;
      url: string;
    };
  };
}

export interface Article {
  attributes: {
    description: string;
    title: string;
    image?: MediaImage;
  };
  id: number;
}

export interface Course {
  attributes: {
    title: string;
    description?: string;
    course_event?: EventInfo[];
    sort_course_events_by_newest_date: null | boolean;
  };
  id: number;
}
