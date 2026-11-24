// SPEC D59: Expressive Code options that cannot be written as JSON live here (the <Code> component reads this file;
// the serializable options stay in astro.config.mjs). Every rendered code block gets translate="no".
import { pluginNoTranslate } from './src/lib/ec-no-translate.ts';

export default {
	plugins: [pluginNoTranslate()],
};
