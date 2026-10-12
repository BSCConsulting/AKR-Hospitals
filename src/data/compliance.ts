/** Statutory accreditation & establishment credentials for public display. */

// TODO(hospital): add certificate numbers / validity only once confirmed in writing.
export const accreditation = {
  nabh: { short: 'NABH Accredited' },
  iso: { short: 'ISO 9001:2015 Certified' },
} as const;

export const clinicalEstablishment = {
  act: 'Telangana Clinical Establishments (Registration and Regulation) Act',
  bmwReturnsNote:
    'Bio-Medical Waste (BMW) is handled per Biomedical Waste Management Rules, 2016. Annual returns are filed with the Telangana State Pollution Control Board.',
} as const;
