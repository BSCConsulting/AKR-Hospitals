/** Statutory accreditation & establishment credentials for public display. */

export const accreditation = {
  nabh: {
    short: 'NABH Accredited',
    full: 'NABH Accredited (Cert No: NABH-HOSP-2024-1847, Valid thru Dec 2027)',
    certNo: 'NABH-HOSP-2024-1847',
    validThru: 'Dec 2027',
  },
  iso: {
    short: 'ISO 9001:2015 Certified',
    full: 'ISO 9001:2015 Certified (Cert No: ISO-QMS-2023-5621)',
    certNo: 'ISO-QMS-2023-5621',
  },
} as const;

export const clinicalEstablishment = {
  act: 'Telangana Clinical Establishments (Registration and Regulation) Act',
  registrationNo: 'TS-CEA-KMM-MAD-2019-0428',
  bmwAuthorization: 'TSPCB/BMW/HCE/KMM/2019/1184',
  bmwReturnsNote:
    'Bio-Medical Waste (BMW) is handled per Biomedical Waste Management Rules, 2016. Annual returns are filed with the Telangana State Pollution Control Board.',
} as const;

export const SITE_ORIGIN = 'https://akrhospital.in';
