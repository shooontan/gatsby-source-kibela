import camelCase from 'camelcase';
import crypto from 'crypto';
import { Actions, NodePluginArgs } from 'gatsby';

type CreateContentNodeArgs = {
  actions: Pick<Actions, 'createNode'>;
  createNodeId: NodePluginArgs['createNodeId'];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  type: string;
};

const typePrefix = 'Kibela';
const makeTypeName = (type: string) =>
  camelCase([typePrefix, type], { pascalCase: true });

export const createContentNode = ({
  actions: { createNode },
  createNodeId,
  content,
  type,
}: CreateContentNodeArgs) => {
  const nodeContent = JSON.stringify(content);
  const nodeId = createNodeId(content?.id || nodeContent);
  const nodeContentDigest = crypto
    .createHash('md5')
    .update(nodeContent)
    .digest('hex');

  const node = {
    ...content,
    id: nodeId,
    parent: null,
    children: [],
    internal: {
      type: makeTypeName(type),
      content: nodeContent,
      contentDigest: nodeContentDigest,
    },
  };

  /**
   * To avoid conflicting named id,
   * rename to ${type}Id if content has id property.
   */
  if (content.id) {
    const contentIdName = camelCase([type, 'id']);
    node[contentIdName] = content.id;
  }

  createNode(node);
};
