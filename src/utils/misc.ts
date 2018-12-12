
export const makeAPIReferenceFileName = (moduleName: string) => `${moduleName}_ref.json`;
export const tutorialAddr = "#tutorial";
export const donateAddr = "#donate";
export const makeAPIReferenceHash = (modName: string) => `#apiref-${modName}`;
export const makeAPIReferenceItemHash = (modName: string, name: string) =>
    `${makeAPIReferenceHash(modName)}-${name}`;
