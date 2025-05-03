export const getChecksum = (content: string): string => {
  return require("crypto").createHash("md5").update(content).digest("hex");
};
