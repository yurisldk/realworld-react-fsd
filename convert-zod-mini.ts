import fs from 'fs';
import path from 'path';

const SCHEMAS_DIR = path.resolve(__dirname, 'src/shared/api/generated/schemas');

const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith('.zod.ts'));

files.forEach((file) => {
  const fullPath = path.join(SCHEMAS_DIR, file);

  const code = fs.readFileSync(fullPath, 'utf-8');

  let newCode = code;

  newCode = newCode.replace(/import\s+\{\s*z\s+as\s+zod\s*\}\s+from\s+['"]zod['"]/, `import * as zod from "zod/mini"`);

  const wrapOptionalNullish = (str: string) => {
    str = str.replace(/(\bzod\.\w+\(\))\.optional\(\)/g, 'zod.optional($1)');
    str = str.replace(/(\bzod\.\w+\(\))\.nullish\(\)/g, 'zod.nullish($1)');
    str = str.replace(/(\bzod\.object\([^)]*\))\.optional\(\)/g, 'zod.optional($1)');
    str = str.replace(/(zod\.array\([\s\S]*?\))\.optional\(\)/g, 'zod.optional($1)');
    str = str.replace(/(\bzod\.enum\([^)]*\))\.optional\(\)/g, 'zod.optional($1)');
    return str;
  };

  newCode = wrapOptionalNullish(newCode);

  newCode = newCode.replace(/(\bzod\.\w+\(\))\.nullish\(\)/g, 'zod.nullish($1)');

  fs.writeFileSync(fullPath, newCode);
  console.log(`✅ Converted ${file}`);
});

console.log('🎉 All files converted to zod/mini format!');
