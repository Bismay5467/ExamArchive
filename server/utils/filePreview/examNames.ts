type TExamType = { [key: string]: Record<string, string> | string };

const examNames = (params: TExamType) => {
  const names: string[] = [];

  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const type in params) {
    const element = params[type];
    if (typeof element === 'string') names.push(element);
    else names.push(...examNames(element));
  }
  return names;
};

export default examNames;
