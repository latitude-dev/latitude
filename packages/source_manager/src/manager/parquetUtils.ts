import { FieldDefinition, ParquetType } from '@dsnp/parquetjs/dist/lib/declare'
import { DataType, Field } from '@latitude-data/query_result'
import { ParquetSchema } from '@dsnp/parquetjs'

// Parquet logical types
// https://github.com/LibertyDSNP/parquetjs?tab=readme-ov-file#list-of-supported-types--encodings
export enum ParquetLogicalType {
  BOOLEAN = 'BOOLEAN',
  INT32 = 'INT32',
  INT64 = 'INT64',
  INT96 = 'INT96',
  FLOAT = 'FLOAT',
  DOUBLE = 'DOUBLE',
  BYTE_ARRAY = 'BYTE_ARRAY',
  FIXED_LEN_BYTE_ARRAY = 'FIXED_LEN_BYTE_ARRAY',
  UTF8 = 'UTF8',
  ENUM = 'ENUM',
  DATE = 'DATE',
  TIME_MILLIS = 'TIME_MILLIS',
  TIMESTAMP_MILLIS = 'TIMESTAMP_MILLIS',
  TIMESTAMP_MICROS = 'TIMESTAMP_MICROS',
  TIME_MICROS = 'TIME_MICROS',
  UINT_8 = 'UINT_8',
  UINT_16 = 'UINT_16',
  UINT_32 = 'UINT_32',
  UINT_64 = 'UINT_64',
  INT_8 = 'INT_8',
  INT_16 = 'INT_16',
  INT_32 = 'INT_32',
  INT_64 = 'INT_64',
  JSON = 'JSON',
  BSON = 'BSON',
  INTERVAL = 'INTERVAL',
}

function mapDataTypeToParquet(dataType: DataType): ParquetType {
  switch (dataType) {
    case DataType.Boolean:
      return ParquetLogicalType.BOOLEAN

    case DataType.Datetime:
      return ParquetLogicalType.TIMESTAMP_MICROS

    case DataType.Integer:
      // TODO: review this decision.
      // This will make all integers to be stored as INT64 in parquet, making the parquet file
      // bigger than necessary. We should consider using INT32 or INT64 depending on the
      // actual value size.
      // In some databases, integer fields can be stored in various sizes (INT8, INT16, INT32,
      // INT64, and so on). When JavaScript interacts with these fields, it converts them to
      // either a ‘number’ or a ‘BigNumber’, depending on the field size. However, we always
      // configure the field as a DataType.Integer, regardless of its size.
      // When creating the parquet file, we need to specify the field size in advance. If we
      // choose a smaller integer size than the actual value, it will crash 💥.
      return ParquetLogicalType.INT64

    case DataType.Float:
      return ParquetLogicalType.FLOAT

    case DataType.String:
      return ParquetLogicalType.UTF8

    default:
      return ParquetLogicalType.BYTE_ARRAY
  }
}

export function buildParquetSchema(fields: Field[]) {
  const columns = fields.reduce(
    (schema, field) => {
      const type = mapDataTypeToParquet(field.type)
      schema[field.name] = {
        type,
        compression: 'SNAPPY',
        optional: true,
        repeated: field.type === DataType.Unknown,
      }
      return schema
    },
    {} as { [key: string]: FieldDefinition },
  )

  return new ParquetSchema(columns)
}
