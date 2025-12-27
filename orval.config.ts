import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      target: 'https://api.checkmy.run/v3/api-docs/v1',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      schemas: './src/api/models',
      client: 'react-query',
      override: {
        mutator: {
          path: './src/lib/api-client.ts',
          name: 'customInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          signal: true,
        },
      },
    },
  },
});

