const admin = [{
  key: '1',
  children: ['1_1', '1_2']
}, {
  key: '2',
  children: ['2_1', '2_2']
}, {
  key: '3',
  children: ['3_1', '3_3']
}, {
  key: '4',
  children: ['4_1']
}, {
  key: '5',
  children: ['5_1', '5_2']
}];

const subAdmin = [{
  key: '2',
  children: ['2_1', '2_2']
}, {
  key: '3',
  children: ['3_1', '3_3']
}, {
  key: '4',
  children: ['4_1']
}, {
  key: '5',
  children: ['5_1', '5_2']
}];

const operator = [{
  key: '3',
  children: ['3_1','3_2']
}, {
  key: '5',
  children: ['5_1', '5_2']
}];

module.exports = {
  admin,
  subAdmin,
  operator
}