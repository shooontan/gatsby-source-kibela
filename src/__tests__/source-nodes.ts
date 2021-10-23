import { Actions, Reporter } from 'gatsby';
import { Headers } from 'node-fetch';

import * as fetch from '../fetch';
import { sourceNodes } from '../source-nodes';
import * as utils from '../utils';

const actions = {
  createNode: jest.fn(),
};
const createNodeId = jest.fn().mockReturnValue('nodeId');
const reporter = {
  panic: jest.fn(),
};

const pluginOptions = {
  accessToken: 'xJToiV4rwY',
  subDomain: 'blog',
  query: `query {
    notes(first: 10) {
      nodes {
        id
        title
      }
    }
  }`,
};

describe('sourceNodes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('create nodes', async () => {
    jest.spyOn(fetch, 'fetchData').mockResolvedValue({
      status: 200,
      headers: new Headers(),
      body: {
        data: {
          notes: {
            nodes: [{ id: 'lvN6Z1gDWg' }, { id: 'BllQbLd6ke' }],
          },
        },
      },
    });
    const createContentNodeMock = jest.spyOn(utils, 'createContentNode');

    await sourceNodes(
      {
        actions: (actions as unknown) as Actions,
        createNodeId,
        reporter: (reporter as unknown) as Reporter,
      },
      { ...pluginOptions, plugins: [] }
    );

    expect(createContentNodeMock).toBeCalledTimes(2);
    expect(reporter.panic).not.toBeCalled();
  });

  test('panic', async () => {
    jest.spyOn(fetch, 'fetchData').mockResolvedValue({
      status: 401,
      headers: new Headers(),
      body: {},
    });
    const createContentNodeMock = jest.spyOn(utils, 'createContentNode');

    await sourceNodes(
      {
        actions: (actions as unknown) as Actions,
        createNodeId,
        reporter: (reporter as unknown) as Reporter,
      },
      { ...pluginOptions, plugins: [] }
    );

    expect(createContentNodeMock).toBeCalledTimes(0);
    expect(reporter.panic).toBeCalledTimes(1);
  });
});
