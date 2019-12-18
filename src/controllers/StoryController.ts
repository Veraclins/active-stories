import { getRepository } from 'typeorm';
import { NextFunction, Request, Response } from 'utils/types';
import { StoryRepository } from 'respositories/StoryRepository';
import { Story } from 'entities/Story';

export class StoryController {
  private repository = getRepository(Story);
  private storyRepository = new StoryRepository(this.repository);

  async createStory(request: Request, response: Response, next: NextFunction) {
    const { user, body } = request;

    const { summary, description, type, complexity, cost, estimatedHrs } = body;

    if (
      !summary ||
      !description ||
      !type ||
      !complexity ||
      !cost ||
      !estimatedHrs
    ) {
      response.statusCode = 400;
      return next(new Error('Please fill all the fields'));
    }

    try {
      // const user = await
      const story = await this.storyRepository.save({
        summary,
        description,
        type,
        complexity,
        cost,
        estimatedHrs,
        createdBy: user,
      });
      return story;
    } catch (error) {
      return next(new Error(error.message));
    }
  }

  async getStories(request: Request, response: Response, next: NextFunction) {
    const { user } = request;
    let stories: Story[] = [];
    let message = '';
    let noStoriesMessage = '';
    if (user.userRole === 'admin') {
      noStoriesMessage = 'No user stories have been created yet.';
      stories = (await this.storyRepository.all()) as Story[];
      message = 'All user stories retrieved successfully!';
    } else {
      noStoriesMessage = 'You have not created any stories yet.';
      stories = (await this.storyRepository.many({
        createdBy: user,
      })) as Story[];
      message = 'All your stories retrieved successfully!';
    }
    if (!stories.length) {
      return {
        message: noStoriesMessage,
        data: stories,
      };
    }
    // Typeorm does not have soft delete feature hence, rejected stories are therefore filtered out
    stories = stories.filter(story => story.status !== 'rejected');
    return {
      message,
      data: stories,
    };
  }

  async updateStory(request: Request, response: Response, next: NextFunction) {
    const {
      user,
      params: { id },
      body,
    } = request;

    if (user.userRole !== 'admin') {
      response.statusCode = 403;
      return next(
        new Error("You don't have the permission to approve or reject a story.")
      );
    }
    const { status } = body;
    if (!Number(id)) {
      response.statusCode = 400;
      return next(new Error('Please ensure that you enter a valid story ID'));
    }
    if (!status) {
      response.statusCode = 400;
      return next(new Error('Please select an approval status for the story'));
    }
    if (!['rejected', 'approved'].includes(status)) {
      response.statusCode = 400;
      return next(
        new Error('Approval status must be `rejected` or `approved`')
      );
    }
    try {
      let story = await this.storyRepository.findById(id);
      if (!story) {
        response.statusCode = 404;
        return next(
          new Error(
            'No story with the given ID exists. Please check the ID and try again'
          )
        );
      }
      const edited = await this.storyRepository.update(id, { status });
      if (edited.affected) {
        story = {
          ...story,
          status,
        };
      }
      return {
        message: `The story has been ${status} successfully`,
        data: story,
      };
    } catch (error) {
      return next(new Error(error.message));
    }
  }

  async getStory(request: Request, response: Response, next: NextFunction) {
    const {
      user,
      params: { id },
    } = request;

    if (!Number(id)) {
      response.statusCode = 400;
      return next(new Error('Please ensure that you enter a valid story ID'));
    }

    const story = (await this.storyRepository.findById(id)) as Story;
    if (!story) {
      response.statusCode = 404;
      return next(
        new Error(
          'No story with the given ID exists. Please check the ID and try again'
        )
      );
    }
    if (user.userRole !== 'admin' && story.createdBy.id !== user.id) {
      response.statusCode = 403;
      return next(
        new Error("You don't have the permission to view this story.")
      );
    }
    return {
      message: 'The story has been retrieved successfully',
      data: story,
    };
  }
}
