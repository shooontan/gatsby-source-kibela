import { createContentNode } from '../utils';

const createNode = jest.fn();
const createNodeId = jest.fn();

describe('createContentNode', () => {
  beforeEach(() => {
    createNode.mockClear();
    createNodeId.mockClear();
  });

  test('create node', () => {
    createNodeId.mockReturnValue('nodeId');
    createContentNode({
      actions: {
        createNode,
      },
      createNodeId,
      content: { title: 'hello' },
      type: 'note',
    });
    expect(createNode.mock.calls).toMatchSnapshot();
    expect(createNode.mock.calls[0][0].title).toBe('hello');
  });

  test('content node with id', () => {
    createNodeId.mockReturnValue('nodeId');
    createContentNode({
      actions: {
        createNode,
      },
      createNodeId,
      content: { id: 'uYarjeb7YL', title: 'hello' },
      type: 'note',
    });
    expect(createNode.mock.calls).toMatchSnapshot();
    expect(createNode.mock.calls[0][0].id).not.toBe('uYarjeb7YL');
    expect(createNode.mock.calls[0][0].noteId).toBe('uYarjeb7YL');
  });
});
