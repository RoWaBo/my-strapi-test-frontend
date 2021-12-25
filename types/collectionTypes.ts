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
  };
  id: number;
}
