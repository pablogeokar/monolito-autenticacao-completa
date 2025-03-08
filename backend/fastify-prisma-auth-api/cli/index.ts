#!/usr/bin/env node
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import fs from "node:fs";
import path from "node:path";

type FieldsType = {
  name: string;
  type: string;
  description: string;
  required: boolean;
};

const program = new Command();

program
  .name("g")
  .description("CLI para gerar templates de código para API Fastify com Zod")
  .version("1.0.0");

// Comando para gerar um recurso completo
program
  .command("resource")
  .description("Gera um recurso completo (schema, routes, service, module)")
  .argument("<name>", "Nome do recurso (singular, ex: user, product)")
  .option("-p, --path <path>", "Caminho para gerar os arquivos", "src/modules")
  .action(async (name, options) => {
    const resourceName = name.toLowerCase();
    //const resourceNamePlural = `${resourceName}s`; // Simplificação básica para plural
    const resourceNameCapitalized =
      resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

    const targetPath = path.resolve(
      process.cwd(),
      options.path,
      //resourceNamePlural
      resourceName
    );

    // Cria o diretório se não existir
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // Gera o arquivo de schema
    const schemaContent = generateSchemaFile(
      resourceName,
      resourceNameCapitalized
    );
    fs.writeFileSync(
      path.join(targetPath, `${resourceName}.schema.ts`),
      schemaContent
    );

    // Gera o arquivo de service
    const serviceContent = generateServiceFile(
      resourceName,
      resourceNameCapitalized
    );
    fs.writeFileSync(
      path.join(targetPath, `${resourceName}.service.ts`),
      serviceContent
    );

    // Gera o arquivo de rotas
    const routesContent = generateRoutesFile(
      resourceName,
      resourceNameCapitalized
    );
    fs.writeFileSync(
      path.join(targetPath, `${resourceName}.routes.ts`),
      routesContent
    );

    // Gera o arquivo de módulo
    const moduleContent = generateModuleFile(resourceName);
    fs.writeFileSync(
      path.join(targetPath, `${resourceName}.module.ts`),
      moduleContent
    );

    console.log(
      chalk.green(
        `✅ Recurso ${resourceNameCapitalized} gerado com sucesso em ${targetPath}`
      )
    );
    console.log(chalk.cyan("Arquivos criados:"));
    console.log(`  - ${resourceName}.schema.ts`);
    console.log(`  - ${resourceName}.service.ts`);
    console.log(`  - ${resourceName}.routes.ts`);
    console.log(`  - ${resourceName}.module.ts`);
  });

// Comando para gerar apenas um schema
// program
//   .command("schema")
//   .description("Gera apenas um arquivo de schema Zod")
//   .argument("<name>", "Nome do schema (singular, ex: user, product)")
//   .option("-p, --path <path>", "Caminho para gerar o arquivo", "src/schemas")
//   .action(async (name, options) => {
//     const resourceName = name.toLowerCase();
//     const resourceNameCapitalized =
//       resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

//     const targetPath = path.resolve(process.cwd(), options.path);

//     // Cria o diretório se não existir
//     if (!fs.existsSync(targetPath)) {
//       fs.mkdirSync(targetPath, { recursive: true });
//     }

//     // Solicita campos para o schema
//     const fields = await promptForSchemaFields();

//     // Gera o arquivo de schema
//     const schemaContent = generateCustomSchemaFile(
//       resourceName,
//       resourceNameCapitalized,
//       fields
//     );
//     const filePath = path.join(targetPath, `${resourceName}.schema.ts`);
//     fs.writeFileSync(filePath, schemaContent);

//     console.log(
//       chalk.green(
//         `✅ Schema ${resourceNameCapitalized} gerado com sucesso: ${filePath}`
//       )
//     );
//   });

// Função auxiliar para solicitar campos do schema
// async function promptForSchemaFields() {
//   const fields: FieldsType[] = [];
//   let addMoreFields = true;

//   while (addMoreFields) {
//     const { fieldName } = await inquirer.prompt([
//       {
//         type: "input",
//         name: "fieldName",
//         message: "Nome do campo:",
//         validate: (input) =>
//           input.trim() !== "" ? true : "O nome do campo é obrigatório",
//       },
//     ]);

//     const { fieldType } = await inquirer.prompt([
//       {
//         type: "list",
//         name: "fieldType",
//         message: "Tipo do campo:",
//         choices: [
//           "string",
//           "number",
//           "boolean",
//           "date",
//           "email",
//           "uuid",
//           "array",
//           "object",
//         ],
//       },
//     ]);

//     const { fieldDescription } = await inquirer.prompt([
//       {
//         type: "input",
//         name: "fieldDescription",
//         message: "Descrição do campo (opcional):",
//       },
//     ]);

//     const { fieldRequired } = await inquirer.prompt([
//       {
//         type: "confirm",
//         name: "fieldRequired",
//         message: "O campo é obrigatório?",
//         default: true,
//       },
//     ]);

//     fields.push({
//       name: fieldName,
//       type: fieldType,
//       description: fieldDescription,
//       required: fieldRequired,
//     });

//     const { addAnother } = await inquirer.prompt([
//       {
//         type: "confirm",
//         name: "addAnother",
//         message: "Adicionar outro campo?",
//         default: true,
//       },
//     ]);

//     addMoreFields = addAnother;
//   }

//   return fields;
// }

// function generateCustomSchemaFile(
//   resourceName,
//   resourceNameCapitalized,
//   fields
// ) {
//   // Gera o objeto de schema dinamicamente baseado nos campos informados
//   const schemaFields = fields
//     .map((field) => {
//       let fieldDefinition = "";

//       switch (field.type) {
//         case "string":
//           fieldDefinition = "z.string()";
//           break;
//         case "number":
//           fieldDefinition = "z.number()";
//           break;
//         case "boolean":
//           fieldDefinition = "z.boolean()";
//           break;
//         case "date":
//           fieldDefinition = "z.date()";
//           break;
//         case "email":
//           fieldDefinition = "z.string().email()";
//           break;
//         case "uuid":
//           fieldDefinition = "z.string().uuid()";
//           break;
//         case "array":
//           fieldDefinition = "z.array(z.any())";
//           break;
//         case "object":
//           fieldDefinition = "z.object({})";
//           break;
//         default:
//           fieldDefinition = "z.any()";
//       }

//       if (!field.required) {
//         fieldDefinition += ".optional()";
//       }

//       if (field.description) {
//         fieldDefinition += `.describe("${field.description}")`;
//       }

//       return `  ${field.name}: ${fieldDefinition}`;
//     })
//     .join(",\n");

//   return `import { z } from "zod";

// /**
//  * Schema para ${resourceName}
//  */
// export const ${resourceName}Schema = z.object({\n${schemaFields}\n});

// /**
//  * Schema para criação de ${resourceName}
//  */
// export const create${resourceNameCapitalized}Schema = ${resourceName}Schema.omit({
//   id: true
// });

// /**
//  * Schema para atualização de ${resourceName}
//  */
// export const update${resourceNameCapitalized}Schema = create${resourceNameCapitalized}Schema.partial();

// /**
//  * Schema para resposta de ${resourceName}
//  */
// export const ${resourceName}ResponseSchema = ${resourceName}Schema;

// /**
//  * Schema para listagem de ${resourceName}s
//  */
// export const ${resourceName}ListSchema = z.array(${resourceName}ResponseSchema);

// // Tipos exportados para uso em outros arquivos
// export type ${resourceNameCapitalized} = z.infer<typeof ${resourceName}Schema>;
// export type Create${resourceNameCapitalized}Input = z.infer<typeof create${resourceNameCapitalized}Schema>;
// export type Update${resourceNameCapitalized}Input = z.infer<typeof update${resourceNameCapitalized}Schema>;
// export type ${resourceNameCapitalized}Response = z.infer<typeof ${resourceName}ResponseSchema>;
// `;
// }

// Funções para gerar conteúdo de arquivos

function generateSchemaFile(resourceName, resourceNameCapitalized) {
  return `import { z } from "zod";

/**
 * Schema para ${resourceName}
 */
export const ${resourceName}Schema = z.object({
  id: z.string().uuid().describe("ID único do ${resourceName}"),
  name: z.string().min(3).describe("Nome do ${resourceName}"),
  description: z.string().optional().describe("Descrição do ${resourceName}"),
  createdAt: z.date().describe("Data de criação"),
  updatedAt: z.date().describe("Data de atualização")
});

/**
 * Schema para criação de ${resourceName}
 */
export const create${resourceNameCapitalized}Schema = ${resourceName}Schema.omit({ 
  id: true,
  createdAt: true,
  updatedAt: true
});

/**
 * Schema para atualização de ${resourceName}
 */
export const update${resourceNameCapitalized}Schema = create${resourceNameCapitalized}Schema.partial();

/**
 * Schema para resposta de ${resourceName}
 */
export const ${resourceName}ResponseSchema = ${resourceName}Schema;

/**
 * Schema para listagem de ${resourceName}s
 */
export const ${resourceName}ListSchema = z.array(${resourceName}ResponseSchema);

/**
 * Schema para mensagens de erro
 */
export const errorResponseSchema = z.object({
  message: z.string().describe("Mensagem de erro")
});

// Tipos exportados para uso em outros arquivos
export type ${resourceNameCapitalized} = z.infer<typeof ${resourceName}Schema>;
export type Create${resourceNameCapitalized}Dto = z.infer<typeof create${resourceNameCapitalized}Schema>;
export type Update${resourceNameCapitalized}Dto = z.infer<typeof update${resourceNameCapitalized}Schema>;
export type ${resourceNameCapitalized}Response = z.infer<typeof ${resourceName}ResponseSchema>;
`;
}

function generateServiceFile(resourceName, resourceNameCapitalized) {
  return `import type { Create${resourceNameCapitalized}Dto, Update${resourceNameCapitalized}Dto } from "./${resourceName}.schema";
  
export class ${resourceNameCapitalized}Service {  
  /**
   * Obtém todos os ${resourceName}s
   */
  getAll() {
    return console.log("chamou service getAll()");
  }

  /**
   * Obtém um ${resourceName} pelo ID
   */
  getById(id: string) {
    return console.log("chamou service getById(id)");
  }

  /**
   * Cria um novo ${resourceName}
   */
  create(data: Create${resourceNameCapitalized}Dto) {
    return console.log("chamou service create(data)");
  }

  /**
   * Atualiza um ${resourceName} existente
   */
  update(id: string, data: Update${resourceNameCapitalized}Dto) {
    return console.log("chamou service update(id, data)");
  }

  /**
   * Remove um ${resourceName}
   */
  delete(id: string) {
    return console.log("chamou service delete(id)");
  }
}
`;
}

function generateRoutesFile(resourceName, resourceNameCapitalized) {
  return `import { z } from "zod";
import type { FastifyTypedInstance } from "../../types";
import { ${resourceName}Service } from "./${resourceName}.module";
import { 
  ${resourceName}ListSchema,
  ${resourceName}ResponseSchema,
  create${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}Schema, 
  update${resourceName.charAt(0).toUpperCase() + resourceName.slice(1)}Schema,
  errorResponseSchema  
} from "./${resourceName}.schema";

export default async function routes(app: FastifyTypedInstance) {
  // Obter a relação completa de ${resourceNameCapitalized}
  app.get(
    "/",
    {
      schema: {
        description: "Listagem completa de ${resourceNameCapitalized}",
        tags: ["${resourceName}"],
        response: {
          200: ${resourceName}ListSchema.describe("Listagem de ${resourceName}"),
          404: errorResponseSchema.describe("${resourceName} não encontrados")
        }
      }
    },
    async (req, res) => {
      ${resourceName}Service.getAll();      

      return res.send();
    }
  );

  // Obter ${resourceNameCapitalized} por ID
  app.get(
    "/:id",
    {
      schema: {
        description: "Localiza ${resourceNameCapitalized} pelo ID",
        tags: ["${resourceName}"],
        params: z.object({
          id: z.string().describe("ID do ${resourceName}")
        }),
        response: {
          200: ${resourceName}ResponseSchema.describe("${resourceName} encontrado"),
          404: errorResponseSchema.describe("${resourceName} não encontrado")
        }
      }
    },
    async (req, res) => {
      const { id } = req.params as { id: string };
      ${resourceName}Service.getById(id);         

      return res.send();
    }
  );

  // Criar ${resourceNameCapitalized}
  app.post(
    "/",
    {
      schema: {
        description: "Cria um novo registro de ${resourceNameCapitalized}",
        tags: ["${resourceName}"],
        body: create${
          resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
        }Schema,
        response: {
          201: ${resourceName}ResponseSchema.describe("${resourceName} criado com sucesso"),
          400: errorResponseSchema.describe("Dados inválidos")
        }
      }
    },
    async (req, res) => {
      const data = req.body;
      ${resourceName}Service.create(data);      

      return res.send();
    }
  );

  // Atualizar ${resourceNameCapitalized}
  app.put(
    "/:id",
    {
      schema: {
        description: "Atualiza ${resourceNameCapitalized} existente",
        tags: ["${resourceName}"],
        params: z.object({
          id: z.string().describe("ID do ${resourceName}")
        }),
        body: update${
          resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
        }Schema,
        response: {
          200: ${resourceName}ResponseSchema.describe("${resourceName} atualizado com sucesso"),
          404: errorResponseSchema.describe("${resourceName} não encontrado"),
          400: errorResponseSchema.describe("Dados inválidos")
        }
      }
    },
    async (req, res) => {
      const { id } = req.params as { id: string };
      const data = req.body;
      
      try {
        ${resourceName}Service.update(id, data);        

        return res.send();
      } catch (error) {
        return res.status(404).send({ message: "${resourceName} não encontrado" });
      }
    }
  );

  // Exclui ${resourceNameCapitalized} por ID
  app.delete(
    "/:id",
    {
      schema: {
        description: "Exclui ${resourceNameCapitalized} por ID",
        tags: ["${resourceName}"],
        params: z.object({
          id: z.string().describe("ID do ${resourceName}")
        }),
        response: {
          200: ${resourceName}ResponseSchema.describe("${resourceName} removido com sucesso"),
          404: errorResponseSchema.describe("${resourceName} não encontrado")
        }
      }
    },
    async (req, res) => {
      const { id } = req.params as { id: string };
      
      try {
        ${resourceName}Service.delete(id);
        return res.status(204).send()
      } catch (error) {
        return res.status(404).send({ message: "${resourceName} não encontrado" });
      }
    }
  );
}
`;
}

function generateModuleFile(resourceName) {
  const resourceNameCapitalized =
    resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

  return `import { ${resourceNameCapitalized}Service } from './${resourceName}.service';

// Exportar instância do serviço para uso nas rotas
export const ${resourceName}Service = new ${resourceNameCapitalized}Service();
`;
}

program.parse();
