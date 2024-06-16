import { Idl } from '@coral-xyz/anchor';

export const MERKLE_SUBMITTER_IDL = {
  version: '0.1.0',
  name: 'gc',
  instructions: [
    {
      name: 'newProof',
      accounts: [
        {
          name: 'authority',
          isMut: true,
          isSigner: true,
        },
        {
          name: 'proofState',
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
          name: 'proofHash',
          type: 'string',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'ProofState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'proofHash',
            type: 'string',
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
      name: 'newProof';
      accounts: [
        {
          name: 'authority';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'proofState';
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
          name: 'proofHash';
          type: 'string';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'ProofState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'proofHash';
            type: 'string';
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
