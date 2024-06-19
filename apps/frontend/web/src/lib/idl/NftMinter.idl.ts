export const NFT_MINTER_IDL = {
  address: '7PkvYFurAyci1hZFhkvfwHvMFZt9ctdpK8pogGNVizjm',
  metadata: {
    name: 'nft',
    version: '0.1.0',
    spec: '0.1.0',
    description: 'Created with Anchor',
  },
  instructions: [
    {
      name: 'check_mint_extensions_constraints',
      discriminator: [116, 106, 124, 163, 185, 116, 224, 224],
      accounts: [
        {
          name: 'authority',
          writable: true,
          signer: true,
        },
        {
          name: 'mint',
        },
      ],
      args: [],
    },
    {
      name: 'create_mint_account',
      discriminator: [76, 184, 50, 62, 162, 141, 47, 103],
      accounts: [
        {
          name: 'payer',
          writable: true,
          signer: true,
        },
        {
          name: 'authority',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121, 45, 115, 101, 101, 100],
              },
            ],
          },
        },
        {
          name: 'mint',
          writable: true,
          pda: {
            seeds: [
              {
                kind: 'const',
                value: [109, 105, 110, 116, 45, 115, 101, 101, 100],
              },
              {
                kind: 'account',
                path: 'nft_global_state',
              },
            ],
          },
        },
        {
          name: 'mint_token_account',
          writable: true,
        },
        {
          name: 'root_account',
        },
        {
          name: 'global_state',
          writable: true,
        },
        {
          name: 'nft_global_state',
          writable: true,
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
        {
          name: 'associated_token_program',
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
        },
        {
          name: 'token_program',
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
        },
      ],
      args: [
        {
          name: 'user',
          type: 'pubkey',
        },
        {
          name: 'amount',
          type: 'u64',
        },
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'symbol',
          type: 'string',
        },
        {
          name: 'uri',
          type: 'string',
        },
        {
          name: 'achievement_uuid',
          type: {
            array: ['u8', 16],
          },
        },
        {
          name: 'merkle_uuid',
          type: {
            array: ['u8', 16],
          },
        },
        {
          name: 'proofs',
          type: {
            vec: {
              array: ['u8', 32],
            },
          },
        },
      ],
    },
    {
      name: 'initialize_global_state',
      discriminator: [232, 254, 209, 244, 123, 89, 154, 207],
      accounts: [
        {
          name: 'signer',
          writable: true,
          signer: true,
        },
        {
          name: 'authority',
          docs: ['CHECK'],
          writable: true,
        },
        {
          name: 'global_state',
          writable: true,
          signer: true,
        },
        {
          name: 'system_program',
          address: '11111111111111111111111111111111',
        },
      ],
      args: [
        {
          name: 'gc_address',
          type: 'pubkey',
        },
      ],
    },
  ],
  accounts: [
    {
      name: 'GlobalState',
      discriminator: [163, 46, 74, 168, 216, 123, 133, 98],
    },
    {
      name: 'NftGlobalState',
      discriminator: [153, 133, 196, 53, 53, 146, 35, 130],
    },
    {
      name: 'RootState',
      discriminator: [168, 212, 194, 223, 236, 239, 59, 86],
    },
  ],
  errors: [
    {
      code: 6000,
      name: 'InvalidProof',
      msg: 'Insufficient usd amount!',
    },
  ],
  types: [
    {
      name: 'GlobalState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'authority',
            type: 'pubkey',
          },
        ],
      },
    },
    {
      name: 'NftGlobalState',
      type: {
        kind: 'struct',
        fields: [
          {
            name: 'gc_address',
            type: 'pubkey',
          },
          {
            name: 'authority',
            type: 'pubkey',
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
};

export type NFT_MINTER_IDL_TYPE = {
  address: '7PkvYFurAyci1hZFhkvfwHvMFZt9ctdpK8pogGNVizjm';
  metadata: {
    name: 'nft';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'check_mint_extensions_constraints';
      discriminator: [116, 106, 124, 163, 185, 116, 224, 224];
      accounts: [
        {
          name: 'authority';
          writable: true;
          signer: true;
        },
        {
          name: 'mint';
        },
      ];
      args: [];
    },
    {
      name: 'create_mint_account';
      discriminator: [76, 184, 50, 62, 162, 141, 47, 103];
      accounts: [
        {
          name: 'payer';
          writable: true;
          signer: true;
        },
        {
          name: 'authority';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [97, 117, 116, 104, 111, 114, 105, 116, 121, 45, 115, 101, 101, 100];
              },
            ];
          };
        },
        {
          name: 'mint';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [109, 105, 110, 116, 45, 115, 101, 101, 100];
              },
              {
                kind: 'account';
                path: 'nft_global_state';
              },
            ];
          };
        },
        {
          name: 'mint_token_account';
          writable: true;
        },
        {
          name: 'root_account';
        },
        {
          name: 'global_state';
          writable: true;
        },
        {
          name: 'nft_global_state';
          writable: true;
        },
        {
          name: 'system_program';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'associated_token_program';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        },
        {
          name: 'token_program';
          address: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb';
        },
      ];
      args: [
        {
          name: 'user';
          type: 'pubkey';
        },
        {
          name: 'amount';
          type: 'u64';
        },
        {
          name: 'name';
          type: 'string';
        },
        {
          name: 'symbol';
          type: 'string';
        },
        {
          name: 'uri';
          type: 'string';
        },
        {
          name: 'achievement_uuid';
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'merkle_uuid';
          type: {
            array: ['u8', 16];
          };
        },
        {
          name: 'proofs';
          type: {
            vec: {
              array: ['u8', 32];
            };
          };
        },
      ];
    },
    {
      name: 'initialize_global_state';
      discriminator: [232, 254, 209, 244, 123, 89, 154, 207];
      accounts: [
        {
          name: 'signer';
          writable: true;
          signer: true;
        },
        {
          name: 'authority';
          docs: ['CHECK'];
          writable: true;
        },
        {
          name: 'global_state';
          writable: true;
          signer: true;
        },
        {
          name: 'system_program';
          address: '11111111111111111111111111111111';
        },
      ];
      args: [
        {
          name: 'gc_address';
          type: 'pubkey';
        },
      ];
    },
  ];
  accounts: [
    {
      name: 'GlobalState';
      discriminator: [163, 46, 74, 168, 216, 123, 133, 98];
    },
    {
      name: 'NftGlobalState';
      discriminator: [153, 133, 196, 53, 53, 146, 35, 130];
    },
    {
      name: 'RootState';
      discriminator: [168, 212, 194, 223, 236, 239, 59, 86];
    },
  ];
  errors: [
    {
      code: 6000;
      name: 'InvalidProof';
      msg: 'Insufficient usd amount!';
    },
  ];
  types: [
    {
      name: 'GlobalState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'authority';
            type: 'pubkey';
          },
        ];
      };
    },
    {
      name: 'NftGlobalState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'gc_address';
            type: 'pubkey';
          },
          {
            name: 'authority';
            type: 'pubkey';
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
};
