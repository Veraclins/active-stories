import { AuthController } from './controllers/AuthController';
import { StoryController } from 'controllers/StoryController';

export interface Route {
  method: string;
  route: string;
  controller: Object;
  action: string;
  type: string;
}

export const Routes: Route[] = [
  {
    method: 'post',
    route: '/signup',
    controller: AuthController,
    action: 'signup',
    type: 'public',
  },
  {
    method: 'post',
    route: '/login',
    controller: AuthController,
    action: 'login',
    type: 'public',
  },
  {
    method: 'post',
    route: '/admin-login',
    controller: AuthController,
    action: 'login',
    type: 'public',
  },
  {
    method: 'post',
    route: '/createStory',
    controller: StoryController,
    action: 'createStory',
    type: 'protected',
  },
  {
    method: 'get',
    route: '/getStories',
    controller: StoryController,
    action: 'getStories',
    type: 'protected',
  },
  {
    method: 'put',
    route: '/updateStory/:id',
    controller: StoryController,
    action: 'updateStory',
    type: 'protected',
  },
  {
    method: 'get',
    route: '/getStory/:id',
    controller: StoryController,
    action: 'getStory',
    type: 'protected',
  },
];
