import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const GRAPHQL_DIR = 'graphql';
const TYPES_DIR = 'src/types';

interface CodegenConfig {
  overwrite: boolean;
  generates: Record<string, {
    schema: string;
    plugins: string[];
    config: {
      enumsAsTypes: boolean;
      namingConvention: {
        typeNames: string;
        enumValues: string;
      };
      scalars: Record<string, string>;
      typesPrefix: string;
      skipTypename: boolean;
      dedupeFragments: boolean;
      avoidOptionals: boolean;
      maybeValue: string;
      inputMaybeValue: string;
      nonOptionalTypename: boolean;
    };
  }>;
}

// Get all GraphQL files
const graphqlFiles: string[] = fs.readdirSync(GRAPHQL_DIR)
  .filter(file => file.endsWith('.graphql'));

const config: CodegenConfig = {
  overwrite: true,
  generates: {}
};

// Generate separate configs for each file
graphqlFiles.forEach((file: string) => {
  const baseName = path.basename(file, '.graphql');
  config.generates[`${TYPES_DIR}/${baseName}.d.ts`] = {
    schema: `${GRAPHQL_DIR}/${file}`,
    plugins: ['typescript', 'typescript-operations'],
    config: {
      enumsAsTypes: false,
      namingConvention: {
        typeNames: 'keep',
        enumValues: 'keep'
      },
      scalars: {
        Money: 'string',
        URL: 'string',
        DateTime: 'string',
        UnsignedInt64: 'string',
        Decimal: 'number',
        JSON: 'any',
      },
      typesPrefix: '',
      skipTypename: true,
      dedupeFragments: true,
      avoidOptionals: false,
      maybeValue: "T | null | undefined",
      inputMaybeValue: "undefined | null | T",
      nonOptionalTypename: true,
    }
  };
});

fs.writeFileSync(
  'codegen.yml',
  yaml.dump(config)
);