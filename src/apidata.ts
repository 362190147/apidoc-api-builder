export interface ApiData {
    type: string,
    url: string,
    title: string,
    description: string,
    name: string,
    group: string,
    parameter?: {
      fields?: {
        Parameter: [
          {
            group: string,
            type: string,
            optional: false,
            field: string,
            description: string
          }
        ]
      }
    },
    success?: {
      fields?: {
        "Success 200": [
          {
            group: string,
            type: string,
            optional: false,
            field: string,
            description: string
          }
        ]
      },
      examples: [
        {
          title: string,
          content: string,
          type: string
        }
      ]
    },
    sampleRequest: [
      {
        url: string
      }
    ],
    version: string,
    filename: string,
    groupTitle: string
  }