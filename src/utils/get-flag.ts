export const getFlag = (currency: string): string => {
  const flags = [
    {
      name: 'Albania',
      code: 'ALL'
    },
    {
      name: 'Afghanistan',
      code: 'AFN'
    },
    {
      name: 'Argentina',
      code: 'ARS'
    },
    {
      name: 'Aruba',
      code: 'AWG'
    },
    {
      name: 'Australia',
      code: 'AUD'
    },
    {
      name: 'Azerbaijan',
      code: 'AZN'
    },
    {
      name: 'Bahamas',
      code: 'BSD'
    },
    {
      name: 'Barbados',
      code: 'BBD'
    },
    {
      name: 'Belarus',
      code: 'BYR'
    },
    {
      name: 'Belize',
      code: 'BZD'
    },
    {
      name: 'Bermuda',
      code: 'BMD'
    },
    {
      name: 'Bolivia',
      code: 'BOB'
    },
    {
      name: 'Bosnia_and_Herzegovina',
      code: 'BAM'
    },
    {
      name: 'Botswana',
      code: 'BWP'
    },
    {
      name: 'Bulgaria',
      code: 'BGN'
    },
    {
      name: 'Brazil',
      code: 'BRL'
    },
    {
      name: 'Brunei',
      code: 'BND'
    },
    {
      name: 'Cambodia',
      code: 'KHR'
    },
    {
      name: 'Canada',
      code: 'CAD'
    },
    {
      name: 'Cayman_Islands',
      code: 'KYD'
    },
    {
      name: 'Chile',
      code: 'CLP'
    },
    {
      name: 'China',
      code: 'CNY'
    },
    {
      name: 'Colombia',
      code: 'COP'
    },
    {
      name: 'Costa Rica',
      code: 'CRC'
    },
    {
      name: 'Croatia',
      code: 'HRK'
    },
    {
      name: 'Cuba',
      code: 'CUP'
    },
    {
      name: 'Czech Republic',
      code: 'CZK'
    },
    {
      name: 'Denmark',
      code: 'DKK'
    },
    {
      name: 'Dominican Republic',
      code: 'DOP'
    },
    {
      name: 'Egypt',
      code: 'EGP'
    },
    {
      name: 'El Salvador',
      code: 'SVC'
    },
    {
      name: 'Estonia',
      code: 'EEK'
    },
    {
      name: 'Euro',
      code: 'EUR'
    },
    {
      name: 'Falkland Islands',
      code: 'FKP'
    },
    {
      name: 'Fiji',
      code: 'FJD'
    },
    {
      name: 'Georgia',
      code: 'GEL'
    },
    {
      name: 'Ghana',
      code: 'GHC'
    },
    {
      name: 'Gibraltar',
      code: 'GIP'
    },
    {
      name: 'Guatemala',
      code: 'GTQ'
    },
    {
      name: 'Guernsey',
      code: 'GGP'
    },
    {
      name: 'Guyana',
      code: 'GYD'
    },
    {
      name: 'Honduras',
      code: 'HNL'
    },
    {
      name: 'Hong Kong',
      code: 'HKD'
    },
    {
      name: 'Hungary',
      code: 'HUF'
    },
    {
      name: 'Iceland',
      code: 'ISK'
    },
    {
      name: 'India',
      code: 'INR'
    },
    {
      name: 'Indonesia',
      code: 'IDR'
    },
    {
      name: 'Iran',
      code: 'IRR'
    },
    {
      name: 'Isle of Man',
      code: 'IMP'
    },
    {
      name: 'Israel',
      code: 'ILS'
    },
    {
      name: 'Jamaica',
      code: 'JMD'
    },
    {
      name: 'Japan',
      code: 'JPY'
    },
    {
      name: 'Jersey',
      code: 'JEP'
    },
    {
      name: 'Kazakhstan',
      code: 'KZT'
    },
    {
      name: 'North Korea',
      code: 'KPW'
    },
    {
      name: 'South Korea',
      code: 'KRW'
    },
    {
      name: 'Kyrgyzstan',
      code: 'KGS'
    },
    {
      name: 'Laos',
      code: 'LAK'
    },
    {
      name: 'Latvia',
      code: 'LVL'
    },
    {
      name: 'Lebanon',
      code: 'LBP'
    },
    {
      name: 'Liberia',
      code: 'LRD'
    },
    {
      name: 'Lithuania',
      code: 'LTL'
    },
    {
      name: 'Macedonia',
      code: 'MKD'
    },
    {
      name: 'Malaysia',
      code: 'MYR'
    },
    {
      name: 'Mauritius',
      code: 'MUR'
    },
    {
      name: 'Mexico',
      code: 'MXN'
    },
    {
      name: 'Mongolia',
      code: 'MNT'
    },
    {
      name: 'Mozambique',
      code: 'MZN'
    },
    {
      name: 'Namibia',
      code: 'NAD'
    },
    {
      name: 'Nepal',
      code: 'NPR'
    },
    {
      name: 'Netherlands',
      code: 'ANG'
    },
    {
      name: 'New Zealand',
      code: 'NZD'
    },
    {
      name: 'Nicaragua',
      code: 'NIO'
    },
    {
      name: 'Nigeria',
      code: 'NGN'
    },
    {
      name: 'Norway',
      code: 'NOK'
    },
    {
      name: 'Oman',
      code: 'OMR'
    },
    {
      name: 'Pakistan',
      code: 'PKR'
    },
    {
      name: 'Panama',
      code: 'PAB'
    },
    {
      name: 'Paraguay',
      code: 'PYG'
    },
    {
      name: 'Peru',
      code: 'PEN'
    },
    {
      name: 'Philippines',
      code: 'PHP'
    },
    {
      name: 'Poland',
      code: 'PLN'
    },
    {
      name: 'Qatar',
      code: 'QAR'
    },
    {
      name: 'Romania',
      code: 'RON'
    },
    {
      name: 'Russia',
      code: 'RUB'
    },
    {
      name: 'Saint Helena',
      code: 'SHP'
    },
    {
      name: 'Saudi Arabia',
      code: 'SAR'
    },
    {
      name: 'Serbia',
      code: 'RSD'
    },
    {
      name: 'Seychelles',
      code: 'SCR'
    },
    {
      name: 'Singapore',
      code: 'SGD'
    },
    {
      name: 'Solomon Islands',
      code: 'SBD'
    },
    {
      name: 'Somalia',
      code: 'SOS'
    },
    {
      name: 'South Africa',
      code: 'ZAR'
    },
    {
      name: 'Sri Lanka',
      code: 'LKR'
    },
    {
      name: 'Sweden',
      code: 'SEK'
    },
    {
      name: 'Switzerland',
      code: 'CHF'
    },
    {
      name: 'Suriname',
      code: 'SRD'
    },
    {
      name: 'Syria',
      code: 'SYP'
    },
    {
      name: 'Taiwan',
      code: 'TWD'
    },
    {
      name: 'Thailand',
      code: 'THB'
    },
    {
      name: 'Trinidad and Tobago',
      code: 'TTD'
    },
    {
      name: 'Turkey',
      code: 'TRL'
    },
    {
      name: 'Tuvalu',
      code: 'TVD'
    },
    {
      name: 'Ukraine',
      code: 'UAH'
    },
    {
      name: 'United Kingdom',
      code: 'GBP'
    },
    {
      name: 'United States',
      code: 'USD'
    },
    {
      name: 'Uruguay',
      code: 'UYU'
    },
    {
      name: 'Uzbekistan',
      code: 'UZS'
    },
    {
      name: 'Venezuela',
      code: 'VEF'
    },
    {
      name: 'VietNam',
      code: 'VND'
    },
    {
      name: 'Yemen',
      code: 'YER'
    },
    {
      name: 'Zimbabwe',
      code: 'ZWD'
    }
  ]

  const flag = flags.find((flag) => flag.code === currency)

  return flag ? flag.name.replace(/\s/g, '').toLowerCase() : ''
}
