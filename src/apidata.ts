export interface Field{
  group: string,
  type: string,
  optional: boolean,
  field: string,
  description: string
}

export interface ApiData {
    type: string,
    url: string,
    title: string,
    description: string,
    name: string,
    group: string,
    parameter?: {
      fields?:any
    },
    success?: {
      fields?: any,
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