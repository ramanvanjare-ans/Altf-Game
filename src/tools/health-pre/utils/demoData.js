


export const DEMO_SYMPTOMS = [
  { id: 's_21', name: 'Headache', common_name: 'Headache' },
  { id: 's_98', name: 'Fever', common_name: 'Fever' },
  { id: 's_13', name: 'Cough', common_name: 'Cough' },
  { id: 's_305', name: 'Fatigue', common_name: 'Fatigue' },
  { id: 's_156', name: 'Nausea', common_name: 'Nausea' },
  { id: 's_102', name: 'Sore throat', common_name: 'Sore throat' },
  { id: 's_88', name: 'Shortness of breath', common_name: 'Shortness of breath' },
  { id: 's_44', name: 'Body aches', common_name: 'Body aches' },
  { id: 's_1190', name: 'Runny nose', common_name: 'Runny nose' },
  { id: 's_8', name: 'Abdominal pain', common_name: 'Stomach pain' },
  { id: 's_50', name: 'Dizziness', common_name: 'Dizziness' },
  { id: 's_309', name: 'Chest pain', common_name: 'Chest pain' },
];

export const DEMO_CONDITIONS = {
  's_98,s_13': [
    { id: 'c_87', name: 'Common cold', common_name: 'Common cold', probability: 0.72 },
    { id: 'c_55', name: 'Influenza', common_name: 'Flu', probability: 0.65 },
    { id: 'c_234', name: 'Acute bronchitis', common_name: 'Bronchitis', probability: 0.45 },
  ],
  's_21,s_98': [
    { id: 'c_55', name: 'Influenza', common_name: 'Flu', probability: 0.78 },
    { id: 'c_123', name: 'Viral infection', common_name: 'Viral fever', probability: 0.68 },
    { id: 'c_87', name: 'Common cold', common_name: 'Common cold', probability: 0.52 },
  ],
  default: [
    { id: 'c_87', name: 'Common cold', common_name: 'Common cold', probability: 0.65 },
    { id: 'c_55', name: 'Influenza', common_name: 'Flu', probability: 0.55 },
    { id: 'c_234', name: 'Stress-related condition', common_name: 'Stress', probability: 0.40 },
  ],
};
