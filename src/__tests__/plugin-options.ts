import { Reporter } from 'gatsby';
import { Joi } from 'gatsby-plugin-utils';

import {
  createPluginConfig,
  onPreInit,
  pluginOptionsSchema,
} from '../plugin-options';

const defaultOption = {
  accessToken: 'xJToiV4rwY',
  subDomain: 'blog',
  query: `query {
    currentUser {
      account
      realName
    }
  }`,
};

describe('createPluginConfig', () => {
  describe('get', () => {
    const options = {
      ...defaultOption,
      plugins: [],
    };
    const configKeys = ['accessToken', 'subDomain', 'query'] as const;

    it.each(configKeys)('%s', configKey => {
      const config = createPluginConfig(options);
      expect(config.get(configKey)).toBe(options[configKey]);
    });
  });
});

describe('pluginOptionsSchema', () => {
  describe('valid option', () => {
    const options = [
      {
        ...defaultOption,
      },
      {
        ...defaultOption,
        getNodes: body => body.data,
      },
    ];

    it.each(options)('option(%#)', option => {
      const result = pluginOptionsSchema({ Joi }).validate(option);
      expect(result.error).toBe(undefined);
    });
  });

  describe('invalid option', () => {
    describe('accessToken', () => {
      const testcases = [undefined, null, '', 123, true, () => ({})];
      it.each(testcases)('value is %p', testcase => {
        const result = pluginOptionsSchema({ Joi }).validate({
          ...defaultOption,
          accessToken: testcase,
        });
        expect(result.error).toBeDefined();
      });
    });

    describe('subDomain', () => {
      const testcases = [undefined, null, '', 123, true, () => ({})];
      it.each(testcases)('value is %p', testcase => {
        const result = pluginOptionsSchema({ Joi }).validate({
          ...defaultOption,
          subDomain: testcase,
        });
        expect(result.error).toBeDefined();
      });
    });

    describe('query', () => {
      const testcases = [undefined, null, '', 123, true, () => ({})];
      it.each(testcases)('value is %p', testcase => {
        const result = pluginOptionsSchema({ Joi }).validate({
          ...defaultOption,
          query: testcase,
        });
        expect(result.error).toBeDefined();
      });
    });

    describe('getNodes', () => {
      const testcases = [null, '', 123, true];
      it.each(testcases)('value is %p', testcase => {
        const result = pluginOptionsSchema({ Joi }).validate({
          ...defaultOption,
          getNodes: testcase,
        });
        expect(result.error).toBeDefined();
      });
    });
  });
});

describe('onPreInit', () => {
  const reporter = {
    panic: jest.fn(),
  };

  beforeEach(() => {
    reporter.panic.mockClear();
  });

  test('no error', () => {
    onPreInit(
      { reporter: (reporter as unknown) as Reporter },
      {
        ...defaultOption,
        plugins: [],
      }
    );
    expect(reporter.panic).toBeCalledTimes(0);
  });

  test('panic', () => {
    onPreInit({ reporter: (reporter as unknown) as Reporter }, { plugins: [] });
    expect(reporter.panic).toBeCalledTimes(1);
  });
});
