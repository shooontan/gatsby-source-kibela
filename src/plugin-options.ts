import {
  ParentSpanPluginArgs,
  PluginOptions,
  PluginOptionsSchemaArgs,
} from 'gatsby';
import { Joi } from 'gatsby-plugin-utils';

const defaultOptions = {
  version: 'v1',
  subDomain: '',
  accessToken: '',
  query: '',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNodes: (body: any) => body.data.notes.nodes,
  plugins: [] as PluginOptions['plugins'],
};

export function pluginOptionsSchema({ Joi }: PluginOptionsSchemaArgs) {
  return Joi.object<typeof defaultOptions>({
    version: Joi.string().default(defaultOptions.version),
    subDomain: Joi.string().required(),
    accessToken: Joi.string().required(),
    query: Joi.string().required(),
    getNodes: Joi.function(),
    plugins: Joi.array(),
  });
}

export const createPluginConfig = (pluginOptions: PluginOptions) => {
  const config = { ...defaultOptions, ...pluginOptions };
  return {
    get: <T extends keyof typeof config>(key: T) => {
      return config[key];
    },
  };
};

export const onPreInit: (
  parentSpanPluginArgs: Pick<ParentSpanPluginArgs, 'reporter'>,
  options: PluginOptions
) => void = ({ reporter }, options) => {
  const { error } = pluginOptionsSchema({ Joi }).validate(options);
  if (error) {
    reporter.panic(
      `Problems with gatsby-source-kibela plugin options:\n${error.details
        .map(detail => detail.message)
        .join('\n')}`
    );
  }
};
