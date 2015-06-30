class Mixins {
    /**
     * Run through the properties of each of the mixins passed into `baseCtors` and copy them over to the target `derivedCtor` of the mixins, filling out the stand-in properties with their implementations.
     * @example https://github.com/Microsoft/TypeScript/wiki/Mixins
     * @param derivedCtor The class to apply the mixins to
     * @param baseCtors Any number of mixins to apply to the `derivedCtor` class
     */
    applyMixins(derivedCtor: any, baseCtors: any[]) : void {
        baseCtors.forEach(baseCtor => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            });
        });
    }
}

export = Mixins;