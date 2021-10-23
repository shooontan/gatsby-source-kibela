import { PluginOptions, SourceNodesArgs } from 'gatsby';

import { fetchData } from './fetch';
import { createPluginConfig } from './plugin-options';
import { createContentNode } from './utils';

export const sourceNodes: (
  { actions }: Pick<SourceNodesArgs, 'actions' | 'reporter' | 'createNodeId'>,
  options: PluginOptions
) => void | Promise<void> = async (
  { actions, reporter, createNodeId },
  pluginOptions
) => {
  const pluginConfig = createPluginConfig(pluginOptions);
  const apiUrl = `https://${pluginConfig.get(
    'subDomain'
  )}.kibe.la/api/${pluginConfig.get('version')}`;

  const response = await fetchData(apiUrl, {
    accessToken: pluginConfig.get('accessToken'),
    query: pluginConfig.get('query'),
  });

  if (response.status !== 200) {
    reporter.panic(
      `Kibela API ERROR:
status: ${response.status}`,
      response.body.errors
    );
    return;
  }

  const notes: unknown[] = pluginConfig.get('getNodes')(response.body);
  const type = 'note';

  notes.forEach(note => {
    createContentNode({ actions, createNodeId, content: note, type });
  });
};
