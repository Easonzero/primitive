export default {
    input: 'index.js',
    output: [
        {
            format: 'umd',
            name: 'Primitive',
            file: 'bin/primitive.js',
            indent: '\t'
        },
        {
            format: 'es',
            file: 'bin/primitive.module.js',
            indent: '\t'
        }
    ]
};