import { join } from 'path';
import { readFileSync } from 'fs';
import { compile } from 'handlebars';

export class TemplateUtils {
  public static loader<T>(template: string, context: T): string {
    const templateDir = join(
      __dirname,
      `../common/mail/templates/${template}.hbs`,
    );
    const source = readFileSync(templateDir, 'utf8').toString();
    const templateFn = compile(source);
    return templateFn(context);
  }
}
