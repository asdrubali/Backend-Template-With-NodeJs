// genericLister.ts

import { QueryTypes } from "sequelize";
import { DataBase } from "../../database";

/**
 * Estructura de una consulta con placeholders.
 *
 * @interface QueryStructure
 * @property {string} qColumns - Columnas select.
 * @property {string} qSelect - Clausula select en un formato específico.
 * @property {string} [qWhere] - Clausula where (opcional).
 * @property {string} [qGroupBy] - Clausula group by (opcional).
 * @property {string} [qOrderBy] - Clausula order by (opcional).
 * @example
 *   {
 *     qColumns: 'columna1, columna2',
 *     qSelect: 'SELECT {{columns}} FROM miTabla',
 *     qWhere: 'WHERE condicion = true'
 *   }
 */
export interface QueryStructure {
  qColumns: string;
  qSelect: string;
  qWhere?: string;
  qGroupBy?: string;
  qOrderBy?: string;
}

/**
 * Opciones para una consulta paginada.
 *
 * @interface QueryOptions
 * @template T - Tipo de datos de las filas resultantes.
 * @property {QueryStructure} structure - Estructura de la consulta.
 * @property {any} [replacements] - Reemplazos de placeholders (opcional).
 * @property {number} [page] - Número de página (opcional).
 * @property {number} [limit] - Límite de resultados por página (opcional).
 */
export interface QueryOptions<T> {
  structure: QueryStructure;
  customQueryCount?: string;
  customQueryTotalNoFilters?: string;
  replacements?: any;
  page?: number;
  limit?: number;
  printQuery?: boolean;
}

/**
 * Valida si una cadena cumple con el formato de consulta especificado.
 *
 * @param {string} qSelect - Cadena de consulta.
 * @returns {boolean} Verdadero si es válido, falso si no.
 */
function isValidFSelect(qSelect: string): boolean {
  const regex = /^\s*select\s*{{columns}}\s*from\s*/i;
  return regex.test(qSelect);
}

/**
 * Construye una cláusula de paginación para una consulta SQL.
 *
 * @param {number} [page] - Número de página (opcional).
 * @param {number} [limit] - Límite de resultados por página (opcional).
 * @returns {string} Cláusula de paginación.
 */
function buildPagination(page?: number, limit?: number): string {
  if (!page && !limit) return "";

  if (limit && !page) {
    return `LIMIT ${limit}`;
  }

  if (page && limit) {
    const offset = (page - 1) * limit;
    return `LIMIT ${offset}, ${limit}`;
  }

  return "";
}

/**
 * Construye una consulta para obtener el recuento total de resultados.
 *
 * @param {string} baseQuery - Consulta base.
 * @param {string} otherClause - Otras clausulas.
 * @returns {string} Consulta para obtener el recuento total.
 */
function buildTotalCountQuery(baseQuery: string, otherClause: string): string {
  return `${baseQuery.replace("{{columns}}", "COUNT(*) as total")} ${otherClause}`;
}

/**
 * Genera una lista paginada de resultados de una consulta SQL.
 *
 * @template T - Tipo de datos de las filas resultantes.
 * @param {QueryOptions<T>} options - Opciones de la consulta.
 * @returns {Promise<{ page?: number; count: number; rows: T[]; limit?: number }>} Resultados paginados.
 * @throws {Error} Si el formato de consulta no es válido.
 */
export const paginatedListGenerator = async <T = any>(
  options: QueryOptions<T>
): Promise<{ page?: number; count: number; rows: T[]; limit?: number, totalPages: number, finalTotal?: number }> => {
  const {
    structure: { qColumns, qSelect, qWhere, qOrderBy, qGroupBy },
    customQueryCount,
    replacements,
    page,
    limit,
    printQuery,
  } = options;

  const fSelect: string = qSelect + " ";

  if (!isValidFSelect(fSelect)) {
    throw new Error(
      "Invalid format. Must contain 'select' followed by '{{columns}}' and 'from'."
    );
  }

  const pagination = buildPagination(page, limit);

  const query = `${fSelect.replace("{{columns}}", qColumns)} ${qWhere || ""} ${
    qGroupBy || ""
  } ${qOrderBy || ""} ${pagination}`;
  
  if (printQuery) {
    console.log(query);
  }

  const rows = (await DataBase.instance.sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: replacements,
  })) as T[];

  let queryCount = "";

  if (customQueryCount && customQueryCount?.trim().length > 0) {
    queryCount = customQueryCount;
  } else {
    queryCount = buildTotalCountQuery(
      fSelect,
      `${qWhere || ""} ${qGroupBy || ""}`
    );
  }

  const respTotal = (await DataBase.instance.sequelize.query(queryCount, {
    type: QueryTypes.SELECT,
    replacements: replacements,
  })) as { total: number }[];

  const total = respTotal[0]?.total || 0;

  // Para contar el total de registros sin aplicar filtros
  let finalTotal: number | undefined = undefined;

  if (options.customQueryTotalNoFilters) {
    const respTotalNoFilters = (await DataBase.instance.sequelize.query(options.customQueryTotalNoFilters, {
      type: QueryTypes.SELECT,
      replacements: replacements,
    })) as { total: number }[];

    finalTotal = respTotalNoFilters[0]?.total || 0;
  }

  // Se calcula el número de paginas
  let totalPages = 1;
  if (page && limit && total > 0 && limit > 0) {
    totalPages = Math.ceil(total / limit);
  }

  let pageFinal = 1;
  if (page) {
     pageFinal = !isNaN(page) ? Number(page) : 1;
  }

  return { page: pageFinal, count: total, rows, limit, totalPages, finalTotal };
};
