
export const makeAPIReferenceGetterName = (moduleName: string) => `get${moduleName}APIReference`;
export const tutorialAddr = "#tutorial";
export const donateAddr = "#donate";
export const makeAPIReferenceHash = (modName: string) => `#apiref-${modName}`;
export const makeAPIReferenceItemHash = (modName: string, name: string) =>
    `${makeAPIReferenceHash(modName)}-${name}`;
