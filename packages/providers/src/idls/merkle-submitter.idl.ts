import { Idl } from '@coral-xyz/anchor';

export const MERKLE_SUBMITTER_IDL = {
  version: '0.1.0',
  name: 'gc',
  instructions: [
    {
      name: 'initializeGlobalState',
      accounts: [
        {
          name: 'signer',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'authority',
          type: 'publicKey',
        },
      ],
    },
    {
      name: 'newRoot',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'rootState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'globalState',
          isMut: true,
          isSigner: false,
        },
        {
          name: 'systemProgram',
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: 'externalId',
          type: {
            array: ['u8', 16],
          },
        },
        {
          name: 'root',
          type: {
            array: ['u8', 32],
          },
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'GlobalState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'publicKey',
          },
        ],
      },
    },
    {
      name: 'RootState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'root',
            type: {
              array: ['u8', 32],
            },
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'TEST',
      msg: '',
    },
  ],
} satisfies Idl;

export type MERKLE_SUBMITTER_IDL_TYPE = {
  version: '0.1.0';
  name: 'gc';
  instructions: [
    {
      name: 'initializeGlobalState';
      accounts: [
        {
          name: 'signer';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'authority';
          type: 'publicKey';
        },
      ];
    },
    {
      name: 'newRoot';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'rootState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'globalState';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        },
      ];
      args: [
        {
          name: 'externalId';
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'root';
          type: {
            array: ['u8', 32];
          };
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'GlobalState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'publicKey';
          },
        ];
      };
    },
    {
      name: 'RootState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'root';
            type: {
              array: ['u8', 32];
            };
          },
        ];
      };
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'TEST';
      msg: '';
    },
  ];
};
