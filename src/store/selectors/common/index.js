export const selectTimeZone = (state) => {
  return state?.common?.timezone;
};
export const selectList = (state) => {
  return state?.common?.list;
};
export const selectSegmentCategory = (state) => {
  return state?.common?.segmentCategory;
};
export const selectAbsolutes = (state) => {
  return state?.common?.absolutes;
};
export const selectSlot = (state) => {
  return state?.common?.slot;
};
export const selectBehaviour = (state) => {
  return state?.common?.behaviour;
};
export const selectOperator = (state) => {
  return state?.common?.operators;
};
export const selectRelatives = (state) => {
  return state?.common?.relatives;
};
export const selectOffers = (state) => {
  return state?.common?.offer;
};
export const selectSegmentFields = (state) => {
  return state?.common?.segmentFields;
};
export const selectItemData = (state) => {
  return state.common?.itemData;
};
