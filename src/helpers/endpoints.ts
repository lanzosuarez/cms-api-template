export const createPath = (
  activeVersion: string,
  uri: string = "",
  params: string[] = []
) => {
  let stringParams = "";
  params.forEach(p => (stringParams += `/:${p}`));
  return `/api/${activeVersion}/${uri}${stringParams}`;
};
  