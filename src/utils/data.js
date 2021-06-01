export const AgentsType = [
  {
    name: 'SSIAP 1',
    value: 1,
  },
  {
    name: 'SSIAP 2',
    value: 2,
  },
  {
    name: 'SSIAP 3',
    value: 3,
  },
  {
    name: 'ADS',
    value: 4,
  },
  {
    name: 'Bodyguard (no weapon)',
    value: 5,
  },
  {
    name: 'Dog Handler',
    value: 6,
  },
  {
    name: 'Hostess',
    value: 7,
  },
];

export const AgentType = (type) => {
  switch (type) {
    case 1:
      return 'SSIAP 1';

    case 2:
      return 'SSIAP 2';

    case 3:
      return 'SSIAP 3';

    case 4:
      return 'ADS';

    case 5:
      return 'Bodyguard (no weapon)';

    case 6:
      return 'Dog Handler';

    case 7:
      return 'Hostess';

    case 8:
      return 'Not Sure';
    default:
      return 'Not Sure';
  }
};

export const MissionType = (type) => {
  switch (type) {
    case 'Guard_service':
      return 'Guard Service';

    case 'Intervention':
      return 'Intervention';

    case 'Security_patrol':
      return 'Security Patrol';
    default:
      return 'Not Sure';
  }
};
export const agentData = [
  {
    longitude: 2.349328,
    latitude: 48.859391,
    type: 'agents',
  },
  {
    longitude: 2.348686,
    latitude: 48.865367,
    type: 'hostess',
  },
  {
    longitude: 2.35322,
    latitude: 48.867425,
    type: 'agents',
  },
  {
    longitude: 2.350382,
    latitude: 48.863672,
    type: 'agents',
  },

  {
    longitude: 2.351805,
    latitude: 48.870109,
    type: 'agents',
  },
  {
    longitude: 2.348908,
    latitude: 48.863082,
    type: 'hostess',
  },
];
export const PaymentStatus = (type) => {
  switch (type) {
    case 0:
      return 'Not Paid';
    case 1:
      return 'Payment confirmed';
    case 2:
      return 'Pending Bank Transfer';
    case 3:
      return 'pending';
    case 4:
      return 'in-progress';
    case 4:
      return 'completed';
  }
};
export const meteoData = [
  {name: 'Vent fort', value: 'Vent fort'},
  {name: 'Pluie', value: 'Pluie'},
  {name: 'Orage', value: 'Orage'},
  {name: 'Neige', value: 'Neige'},
];
export const circulationData = [
  {name: 'Mauvaise (motif)', value: 'Mauvaise (motif)'},
];
export const verificationData = [
  {name: 'Intérieur', value: 'Intérieur'},
  {name: 'Extérieur', value: 'Extérieur'},
];
export const allumeeData = [
  {name: 'Non', value: 'Non'},
  {name: 'Oui Pièce', value: 'Oui Pièce'},
];
export const ouvertesData = [
  {name: 'Non', value: 'Non'},
  {name: 'Oui Lesquelles', value: 'Oui Lesquelles'},
];
export const fonctionData = [
  {name: 'Non', value: 'Non'},
  {name: 'Oui', value: 'Oui'},
];
export const systemData = [
  {name: 'En service', value: 'En service'},
  {
    name: 'Hors service à l’arrivée de l’intervenant',
    value: 'Hors service à l’arrivée de l’intervenant',
  },
];
export const RemiseData = [
  {name: 'Non', value: 'Non'},
  {name: 'Oui', value: 'Oui'},
  {name: 'Zone(s) en anomalies', value: 'Zone(s) en anomalies'},
  {name: 'Zones isolées', value: 'Zones isolées'},
];
export const EffractionData = [
  {name: 'Non', value: 'Non'},
  {name: 'Oui', value: 'Oui'},
];
export const presenceData = [
  {name: 'Client', value: 'Client'},
  {name: 'Police', value: 'Police'},
  {name: 'Gendarmerie', value: 'Gendarmerie'},
  {name: 'Pompiers', value: 'Pompiers'},
];
