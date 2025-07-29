

export const generateFilePath = (file:File, prefix = "" , tail="", seperator=""):string => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${prefix}${seperator}${tail}.${fileExt}`;

  return fileName;
}