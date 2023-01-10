import * as pac from './package.json';

describe('Package JSON rules', () => {
  const specificVersionTextExpression = /^[0-9]+\.[0-9]+\.[0-9]+(-(alpha|beta)\.[0-9]+)*$/;
  const submodulePackageExpression = /^file:sub_modules\//;

  describe('dependencies', () => {
    for (const [key, value] of Object.entries(pac.dependencies)) {
      it(`Dependency '${key}' is locked to a specific version or is a submodule`, () => {
        let isValid: boolean = specificVersionTextExpression.test(value);
        if (!isValid) {
          isValid = submodulePackageExpression.test(value);
        }
        expect(isValid).toEqual(true);
      });
    }
  });

  describe('devDependencies', () => {
    for (const [key, value] of Object.entries(pac.devDependencies)) {
      it(`Development Dependency '${key}' is locked to a specific version`, () => {
        expect(specificVersionTextExpression.test(value)).toEqual(true);
      });
    }
  });
});
