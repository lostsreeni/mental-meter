export interface CrisisResource {
  country: string
  services: {
    name: string
    detail: string
    phoneHref?: string
    smsHref?: string
  }[]
}

export const crisisResources: CrisisResource[] = [
  {
    country: 'United States',
    services: [
      {
        name: '988 Suicide & Crisis Lifeline',
        detail: 'Call or text 988',
        phoneHref: 'tel:988',
        smsHref: 'sms:988',
      },
      {
        name: 'Crisis Text Line',
        detail: 'Text HOME to 741741',
        smsHref: 'sms:741741?body=HOME',
      },
    ],
  },
  {
    country: 'United Kingdom',
    services: [
      {
        name: 'Samaritans',
        detail: 'Call 116 123 (free, 24/7)',
        phoneHref: 'tel:116123',
      },
    ],
  },
  {
    country: 'Canada',
    services: [
      {
        name: '988 Suicide Crisis Helpline',
        detail: 'Call or text 988',
        phoneHref: 'tel:988',
        smsHref: 'sms:988',
      },
      {
        name: 'Talk Suicide Canada',
        detail: 'Call 1-833-456-4566 (24/7)',
        phoneHref: 'tel:18334564566',
      },
    ],
  },
  {
    country: 'Australia',
    services: [
      {
        name: 'Lifeline',
        detail: 'Call 13 11 14 (24/7)',
        phoneHref: 'tel:131114',
      },
    ],
  },
]

export const internationalFallback = {
  name: 'Find A Helpline',
  detail: 'findahelpline.com — a directory of crisis lines in 200+ countries',
  url: 'https://findahelpline.com',
}
