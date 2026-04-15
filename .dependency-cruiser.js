/** @type {import('dependency-cruiser').IConfiguration} */

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
  ],

  options: {
    includeOnly: ['^src'],

    exclude: {
      path: [
        'node_modules',

        '\\.test\\.ts$',
        '\\.spec\\.ts$',
        '\\.stories\\.ts$',

        '\\.module\\.css$',
        '\\.msw\\.ts$',
        '\\.zod\\.ts$',

        'shared/lib/test',
      ],
    },

    doNotFollow: {
      path: ['node_modules'],
    },

    tsConfig: {
      fileName: 'tsconfig.json',
    },

    reporterOptions: {
      dot: {
        collapsePattern: [
          'src/app',
          'src/pages/[^/]+',
          'src/shared/api/generated/fetch',
          'src/shared/api(?=/[^/]+\\.ts$)',
          'src/shared/ui',
          'src/shared/lib',
        ],

        theme: {
          graph: {
            rankdir: 'LR',
            splines: 'ortho',
            ranksep: 1.1,
            nodesep: 0.45,
            bgcolor: 'transparent',
            labelloc: 't',
            fontsize: '13',
            fontname: 'Helvetica',
          },

          node: {
            shape: 'box',
            style: 'rounded,filled',
            color: '#334155',
            fontname: 'Helvetica',
            margin: '0.08,0.05',
          },

          edge: {
            arrowhead: 'vee',
            arrowsize: '0.6',
            color: '#33415533',
            penwidth: '1.4',
          },

          modules: [
            {
              criteria: { source: '^src/app$' },
              attributes: { fillcolor: '#f1f5f9', color: '#334155' },
            },
            {
              criteria: { source: '^src/pages/' },
              attributes: { shape: 'box', peripheries: '2', penwidth: '1.4', fillcolor: '#dcfce7', color: '#15803d' },
            },
            {
              criteria: { source: '^src/shared/ui$' },
              attributes: { fillcolor: '#f3e8ff', color: '#7e22ce' },
            },
            {
              criteria: { source: '^src/shared/lib$' },
              attributes: { fillcolor: '#fef3c7', color: '#b45309' },
            },
            {
              criteria: { source: '^src/shared/api$' },
              attributes: { fillcolor: '#e2e8f0', color: '#475569' },
            },
            {
              criteria: { source: '^src/shared/api/generated/fetch$' },
              attributes: { fillcolor: '#dbeafe', color: '#1d4ed8' },
            },
          ],

          dependencies: [
            {
              criteria: { resolved: '^src/pages/' },
              attributes: { color: '#15803d8a' },
            },
            {
              criteria: { resolved: '^src/shared/ui$' },
              attributes: { color: '#7e22ce80' },
            },
            {
              criteria: { resolved: '^src/shared/lib$' },
              attributes: { color: '#b4530980' },
            },
            {
              criteria: { resolved: '^src/shared/api$' },
              attributes: { color: '#47556980' },
            },
            {
              criteria: { resolved: '^src/shared/api/generated/fetch$' },
              attributes: { color: '#1d4ed88a' },
            },
            {
              criteria: { dependencyTypes: ['type-import', 'type-only'] },
              attributes: { style: 'dashed', color: '#33415526', penwidth: '1.0' },
            },
          ],
        },
      },

      archi: {
        collapsePattern: [
          'src/app',
          'src/pages/[^/]+',
          'src/shared/api/generated/fetch',
          'src/shared/api(?=/[^/]+\\.ts$)',
          'src/shared/ui',
          'src/shared/lib',
        ],

        theme: {
          graph: {
            rankdir: 'LR',
            splines: 'ortho',
            ranksep: 1.4,
            nodesep: 0.7,
          },
        },
      },

      text: {
        highlightFocused: true,
      },
    },
  },
};
