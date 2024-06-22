const serializedObject = localStorage?.getItem('userInfo');
const myObject = JSON?.parse(serializedObject);
const createdByName = myObject?.name;
const createdBy = myObject?.id;

export { createdByName, createdBy };
