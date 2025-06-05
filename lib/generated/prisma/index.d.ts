
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model competitors
 * 
 */
export type competitors = $Result.DefaultSelection<Prisma.$competitorsPayload>
/**
 * Model video_statistics
 * 
 */
export type video_statistics = $Result.DefaultSelection<Prisma.$video_statisticsPayload>
/**
 * Model auth_tokens
 * 
 */
export type auth_tokens = $Result.DefaultSelection<Prisma.$auth_tokensPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Competitors
 * const competitors = await prisma.competitors.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Competitors
   * const competitors = await prisma.competitors.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.competitors`: Exposes CRUD operations for the **competitors** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Competitors
    * const competitors = await prisma.competitors.findMany()
    * ```
    */
  get competitors(): Prisma.competitorsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.video_statistics`: Exposes CRUD operations for the **video_statistics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Video_statistics
    * const video_statistics = await prisma.video_statistics.findMany()
    * ```
    */
  get video_statistics(): Prisma.video_statisticsDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.auth_tokens`: Exposes CRUD operations for the **auth_tokens** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Auth_tokens
    * const auth_tokens = await prisma.auth_tokens.findMany()
    * ```
    */
  get auth_tokens(): Prisma.auth_tokensDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.6.0
   * Query Engine version: f676762280b54cd07c770017ed3711ddde35f37a
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    competitors: 'competitors',
    video_statistics: 'video_statistics',
    auth_tokens: 'auth_tokens'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "competitors" | "video_statistics" | "auth_tokens"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      competitors: {
        payload: Prisma.$competitorsPayload<ExtArgs>
        fields: Prisma.competitorsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.competitorsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.competitorsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>
          }
          findFirst: {
            args: Prisma.competitorsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.competitorsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>
          }
          findMany: {
            args: Prisma.competitorsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>[]
          }
          create: {
            args: Prisma.competitorsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>
          }
          createMany: {
            args: Prisma.competitorsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.competitorsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>[]
          }
          delete: {
            args: Prisma.competitorsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>
          }
          update: {
            args: Prisma.competitorsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>
          }
          deleteMany: {
            args: Prisma.competitorsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.competitorsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.competitorsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>[]
          }
          upsert: {
            args: Prisma.competitorsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$competitorsPayload>
          }
          aggregate: {
            args: Prisma.CompetitorsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCompetitors>
          }
          groupBy: {
            args: Prisma.competitorsGroupByArgs<ExtArgs>
            result: $Utils.Optional<CompetitorsGroupByOutputType>[]
          }
          count: {
            args: Prisma.competitorsCountArgs<ExtArgs>
            result: $Utils.Optional<CompetitorsCountAggregateOutputType> | number
          }
        }
      }
      video_statistics: {
        payload: Prisma.$video_statisticsPayload<ExtArgs>
        fields: Prisma.video_statisticsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.video_statisticsFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.video_statisticsFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>
          }
          findFirst: {
            args: Prisma.video_statisticsFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.video_statisticsFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>
          }
          findMany: {
            args: Prisma.video_statisticsFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>[]
          }
          create: {
            args: Prisma.video_statisticsCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>
          }
          createMany: {
            args: Prisma.video_statisticsCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.video_statisticsCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>[]
          }
          delete: {
            args: Prisma.video_statisticsDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>
          }
          update: {
            args: Prisma.video_statisticsUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>
          }
          deleteMany: {
            args: Prisma.video_statisticsDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.video_statisticsUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.video_statisticsUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>[]
          }
          upsert: {
            args: Prisma.video_statisticsUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$video_statisticsPayload>
          }
          aggregate: {
            args: Prisma.Video_statisticsAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateVideo_statistics>
          }
          groupBy: {
            args: Prisma.video_statisticsGroupByArgs<ExtArgs>
            result: $Utils.Optional<Video_statisticsGroupByOutputType>[]
          }
          count: {
            args: Prisma.video_statisticsCountArgs<ExtArgs>
            result: $Utils.Optional<Video_statisticsCountAggregateOutputType> | number
          }
        }
      }
      auth_tokens: {
        payload: Prisma.$auth_tokensPayload<ExtArgs>
        fields: Prisma.auth_tokensFieldRefs
        operations: {
          findUnique: {
            args: Prisma.auth_tokensFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.auth_tokensFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>
          }
          findFirst: {
            args: Prisma.auth_tokensFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.auth_tokensFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>
          }
          findMany: {
            args: Prisma.auth_tokensFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>[]
          }
          create: {
            args: Prisma.auth_tokensCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>
          }
          createMany: {
            args: Prisma.auth_tokensCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.auth_tokensCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>[]
          }
          delete: {
            args: Prisma.auth_tokensDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>
          }
          update: {
            args: Prisma.auth_tokensUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>
          }
          deleteMany: {
            args: Prisma.auth_tokensDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.auth_tokensUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.auth_tokensUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>[]
          }
          upsert: {
            args: Prisma.auth_tokensUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$auth_tokensPayload>
          }
          aggregate: {
            args: Prisma.Auth_tokensAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAuth_tokens>
          }
          groupBy: {
            args: Prisma.auth_tokensGroupByArgs<ExtArgs>
            result: $Utils.Optional<Auth_tokensGroupByOutputType>[]
          }
          count: {
            args: Prisma.auth_tokensCountArgs<ExtArgs>
            result: $Utils.Optional<Auth_tokensCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    competitors?: competitorsOmit
    video_statistics?: video_statisticsOmit
    auth_tokens?: auth_tokensOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */



  /**
   * Models
   */

  /**
   * Model competitors
   */

  export type AggregateCompetitors = {
    _count: CompetitorsCountAggregateOutputType | null
    _min: CompetitorsMinAggregateOutputType | null
    _max: CompetitorsMaxAggregateOutputType | null
  }

  export type CompetitorsMinAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    profilePic: string | null
  }

  export type CompetitorsMaxAggregateOutputType = {
    id: string | null
    url: string | null
    title: string | null
    profilePic: string | null
  }

  export type CompetitorsCountAggregateOutputType = {
    id: number
    url: number
    title: number
    profilePic: number
    _all: number
  }


  export type CompetitorsMinAggregateInputType = {
    id?: true
    url?: true
    title?: true
    profilePic?: true
  }

  export type CompetitorsMaxAggregateInputType = {
    id?: true
    url?: true
    title?: true
    profilePic?: true
  }

  export type CompetitorsCountAggregateInputType = {
    id?: true
    url?: true
    title?: true
    profilePic?: true
    _all?: true
  }

  export type CompetitorsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which competitors to aggregate.
     */
    where?: competitorsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competitors to fetch.
     */
    orderBy?: competitorsOrderByWithRelationInput | competitorsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: competitorsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned competitors
    **/
    _count?: true | CompetitorsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CompetitorsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CompetitorsMaxAggregateInputType
  }

  export type GetCompetitorsAggregateType<T extends CompetitorsAggregateArgs> = {
        [P in keyof T & keyof AggregateCompetitors]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCompetitors[P]>
      : GetScalarType<T[P], AggregateCompetitors[P]>
  }




  export type competitorsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: competitorsWhereInput
    orderBy?: competitorsOrderByWithAggregationInput | competitorsOrderByWithAggregationInput[]
    by: CompetitorsScalarFieldEnum[] | CompetitorsScalarFieldEnum
    having?: competitorsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CompetitorsCountAggregateInputType | true
    _min?: CompetitorsMinAggregateInputType
    _max?: CompetitorsMaxAggregateInputType
  }

  export type CompetitorsGroupByOutputType = {
    id: string
    url: string
    title: string | null
    profilePic: string | null
    _count: CompetitorsCountAggregateOutputType | null
    _min: CompetitorsMinAggregateOutputType | null
    _max: CompetitorsMaxAggregateOutputType | null
  }

  type GetCompetitorsGroupByPayload<T extends competitorsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CompetitorsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CompetitorsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CompetitorsGroupByOutputType[P]>
            : GetScalarType<T[P], CompetitorsGroupByOutputType[P]>
        }
      >
    >


  export type competitorsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    profilePic?: boolean
  }, ExtArgs["result"]["competitors"]>

  export type competitorsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    profilePic?: boolean
  }, ExtArgs["result"]["competitors"]>

  export type competitorsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    url?: boolean
    title?: boolean
    profilePic?: boolean
  }, ExtArgs["result"]["competitors"]>

  export type competitorsSelectScalar = {
    id?: boolean
    url?: boolean
    title?: boolean
    profilePic?: boolean
  }

  export type competitorsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "url" | "title" | "profilePic", ExtArgs["result"]["competitors"]>

  export type $competitorsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "competitors"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      url: string
      title: string | null
      profilePic: string | null
    }, ExtArgs["result"]["competitors"]>
    composites: {}
  }

  type competitorsGetPayload<S extends boolean | null | undefined | competitorsDefaultArgs> = $Result.GetResult<Prisma.$competitorsPayload, S>

  type competitorsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<competitorsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CompetitorsCountAggregateInputType | true
    }

  export interface competitorsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['competitors'], meta: { name: 'competitors' } }
    /**
     * Find zero or one Competitors that matches the filter.
     * @param {competitorsFindUniqueArgs} args - Arguments to find a Competitors
     * @example
     * // Get one Competitors
     * const competitors = await prisma.competitors.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends competitorsFindUniqueArgs>(args: SelectSubset<T, competitorsFindUniqueArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Competitors that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {competitorsFindUniqueOrThrowArgs} args - Arguments to find a Competitors
     * @example
     * // Get one Competitors
     * const competitors = await prisma.competitors.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends competitorsFindUniqueOrThrowArgs>(args: SelectSubset<T, competitorsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Competitors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competitorsFindFirstArgs} args - Arguments to find a Competitors
     * @example
     * // Get one Competitors
     * const competitors = await prisma.competitors.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends competitorsFindFirstArgs>(args?: SelectSubset<T, competitorsFindFirstArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Competitors that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competitorsFindFirstOrThrowArgs} args - Arguments to find a Competitors
     * @example
     * // Get one Competitors
     * const competitors = await prisma.competitors.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends competitorsFindFirstOrThrowArgs>(args?: SelectSubset<T, competitorsFindFirstOrThrowArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Competitors that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competitorsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Competitors
     * const competitors = await prisma.competitors.findMany()
     * 
     * // Get first 10 Competitors
     * const competitors = await prisma.competitors.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const competitorsWithIdOnly = await prisma.competitors.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends competitorsFindManyArgs>(args?: SelectSubset<T, competitorsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Competitors.
     * @param {competitorsCreateArgs} args - Arguments to create a Competitors.
     * @example
     * // Create one Competitors
     * const Competitors = await prisma.competitors.create({
     *   data: {
     *     // ... data to create a Competitors
     *   }
     * })
     * 
     */
    create<T extends competitorsCreateArgs>(args: SelectSubset<T, competitorsCreateArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Competitors.
     * @param {competitorsCreateManyArgs} args - Arguments to create many Competitors.
     * @example
     * // Create many Competitors
     * const competitors = await prisma.competitors.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends competitorsCreateManyArgs>(args?: SelectSubset<T, competitorsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Competitors and returns the data saved in the database.
     * @param {competitorsCreateManyAndReturnArgs} args - Arguments to create many Competitors.
     * @example
     * // Create many Competitors
     * const competitors = await prisma.competitors.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Competitors and only return the `id`
     * const competitorsWithIdOnly = await prisma.competitors.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends competitorsCreateManyAndReturnArgs>(args?: SelectSubset<T, competitorsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Competitors.
     * @param {competitorsDeleteArgs} args - Arguments to delete one Competitors.
     * @example
     * // Delete one Competitors
     * const Competitors = await prisma.competitors.delete({
     *   where: {
     *     // ... filter to delete one Competitors
     *   }
     * })
     * 
     */
    delete<T extends competitorsDeleteArgs>(args: SelectSubset<T, competitorsDeleteArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Competitors.
     * @param {competitorsUpdateArgs} args - Arguments to update one Competitors.
     * @example
     * // Update one Competitors
     * const competitors = await prisma.competitors.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends competitorsUpdateArgs>(args: SelectSubset<T, competitorsUpdateArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Competitors.
     * @param {competitorsDeleteManyArgs} args - Arguments to filter Competitors to delete.
     * @example
     * // Delete a few Competitors
     * const { count } = await prisma.competitors.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends competitorsDeleteManyArgs>(args?: SelectSubset<T, competitorsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Competitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competitorsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Competitors
     * const competitors = await prisma.competitors.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends competitorsUpdateManyArgs>(args: SelectSubset<T, competitorsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Competitors and returns the data updated in the database.
     * @param {competitorsUpdateManyAndReturnArgs} args - Arguments to update many Competitors.
     * @example
     * // Update many Competitors
     * const competitors = await prisma.competitors.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Competitors and only return the `id`
     * const competitorsWithIdOnly = await prisma.competitors.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends competitorsUpdateManyAndReturnArgs>(args: SelectSubset<T, competitorsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Competitors.
     * @param {competitorsUpsertArgs} args - Arguments to update or create a Competitors.
     * @example
     * // Update or create a Competitors
     * const competitors = await prisma.competitors.upsert({
     *   create: {
     *     // ... data to create a Competitors
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Competitors we want to update
     *   }
     * })
     */
    upsert<T extends competitorsUpsertArgs>(args: SelectSubset<T, competitorsUpsertArgs<ExtArgs>>): Prisma__competitorsClient<$Result.GetResult<Prisma.$competitorsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Competitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competitorsCountArgs} args - Arguments to filter Competitors to count.
     * @example
     * // Count the number of Competitors
     * const count = await prisma.competitors.count({
     *   where: {
     *     // ... the filter for the Competitors we want to count
     *   }
     * })
    **/
    count<T extends competitorsCountArgs>(
      args?: Subset<T, competitorsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CompetitorsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Competitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CompetitorsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CompetitorsAggregateArgs>(args: Subset<T, CompetitorsAggregateArgs>): Prisma.PrismaPromise<GetCompetitorsAggregateType<T>>

    /**
     * Group by Competitors.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {competitorsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends competitorsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: competitorsGroupByArgs['orderBy'] }
        : { orderBy?: competitorsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, competitorsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompetitorsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the competitors model
   */
  readonly fields: competitorsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for competitors.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__competitorsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the competitors model
   */
  interface competitorsFieldRefs {
    readonly id: FieldRef<"competitors", 'String'>
    readonly url: FieldRef<"competitors", 'String'>
    readonly title: FieldRef<"competitors", 'String'>
    readonly profilePic: FieldRef<"competitors", 'String'>
  }
    

  // Custom InputTypes
  /**
   * competitors findUnique
   */
  export type competitorsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * Filter, which competitors to fetch.
     */
    where: competitorsWhereUniqueInput
  }

  /**
   * competitors findUniqueOrThrow
   */
  export type competitorsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * Filter, which competitors to fetch.
     */
    where: competitorsWhereUniqueInput
  }

  /**
   * competitors findFirst
   */
  export type competitorsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * Filter, which competitors to fetch.
     */
    where?: competitorsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competitors to fetch.
     */
    orderBy?: competitorsOrderByWithRelationInput | competitorsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for competitors.
     */
    cursor?: competitorsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of competitors.
     */
    distinct?: CompetitorsScalarFieldEnum | CompetitorsScalarFieldEnum[]
  }

  /**
   * competitors findFirstOrThrow
   */
  export type competitorsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * Filter, which competitors to fetch.
     */
    where?: competitorsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competitors to fetch.
     */
    orderBy?: competitorsOrderByWithRelationInput | competitorsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for competitors.
     */
    cursor?: competitorsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competitors.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of competitors.
     */
    distinct?: CompetitorsScalarFieldEnum | CompetitorsScalarFieldEnum[]
  }

  /**
   * competitors findMany
   */
  export type competitorsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * Filter, which competitors to fetch.
     */
    where?: competitorsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of competitors to fetch.
     */
    orderBy?: competitorsOrderByWithRelationInput | competitorsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing competitors.
     */
    cursor?: competitorsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` competitors from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` competitors.
     */
    skip?: number
    distinct?: CompetitorsScalarFieldEnum | CompetitorsScalarFieldEnum[]
  }

  /**
   * competitors create
   */
  export type competitorsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * The data needed to create a competitors.
     */
    data: XOR<competitorsCreateInput, competitorsUncheckedCreateInput>
  }

  /**
   * competitors createMany
   */
  export type competitorsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many competitors.
     */
    data: competitorsCreateManyInput | competitorsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * competitors createManyAndReturn
   */
  export type competitorsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * The data used to create many competitors.
     */
    data: competitorsCreateManyInput | competitorsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * competitors update
   */
  export type competitorsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * The data needed to update a competitors.
     */
    data: XOR<competitorsUpdateInput, competitorsUncheckedUpdateInput>
    /**
     * Choose, which competitors to update.
     */
    where: competitorsWhereUniqueInput
  }

  /**
   * competitors updateMany
   */
  export type competitorsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update competitors.
     */
    data: XOR<competitorsUpdateManyMutationInput, competitorsUncheckedUpdateManyInput>
    /**
     * Filter which competitors to update
     */
    where?: competitorsWhereInput
    /**
     * Limit how many competitors to update.
     */
    limit?: number
  }

  /**
   * competitors updateManyAndReturn
   */
  export type competitorsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * The data used to update competitors.
     */
    data: XOR<competitorsUpdateManyMutationInput, competitorsUncheckedUpdateManyInput>
    /**
     * Filter which competitors to update
     */
    where?: competitorsWhereInput
    /**
     * Limit how many competitors to update.
     */
    limit?: number
  }

  /**
   * competitors upsert
   */
  export type competitorsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * The filter to search for the competitors to update in case it exists.
     */
    where: competitorsWhereUniqueInput
    /**
     * In case the competitors found by the `where` argument doesn't exist, create a new competitors with this data.
     */
    create: XOR<competitorsCreateInput, competitorsUncheckedCreateInput>
    /**
     * In case the competitors was found with the provided `where` argument, update it with this data.
     */
    update: XOR<competitorsUpdateInput, competitorsUncheckedUpdateInput>
  }

  /**
   * competitors delete
   */
  export type competitorsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
    /**
     * Filter which competitors to delete.
     */
    where: competitorsWhereUniqueInput
  }

  /**
   * competitors deleteMany
   */
  export type competitorsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which competitors to delete
     */
    where?: competitorsWhereInput
    /**
     * Limit how many competitors to delete.
     */
    limit?: number
  }

  /**
   * competitors without action
   */
  export type competitorsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the competitors
     */
    select?: competitorsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the competitors
     */
    omit?: competitorsOmit<ExtArgs> | null
  }


  /**
   * Model video_statistics
   */

  export type AggregateVideo_statistics = {
    _count: Video_statisticsCountAggregateOutputType | null
    _avg: Video_statisticsAvgAggregateOutputType | null
    _sum: Video_statisticsSumAggregateOutputType | null
    _min: Video_statisticsMinAggregateOutputType | null
    _max: Video_statisticsMaxAggregateOutputType | null
  }

  export type Video_statisticsAvgAggregateOutputType = {
    view_count: number | null
    like_count: number | null
    comment_count: number | null
    duration: number | null
  }

  export type Video_statisticsSumAggregateOutputType = {
    view_count: number | null
    like_count: number | null
    comment_count: number | null
    duration: number | null
  }

  export type Video_statisticsMinAggregateOutputType = {
    id: string | null
    view_count: number | null
    like_count: number | null
    comment_count: number | null
    publish_time: Date | null
    channel_id: string | null
    thumbnail: string | null
    title: string | null
    duration: number | null
    isShort: boolean | null
  }

  export type Video_statisticsMaxAggregateOutputType = {
    id: string | null
    view_count: number | null
    like_count: number | null
    comment_count: number | null
    publish_time: Date | null
    channel_id: string | null
    thumbnail: string | null
    title: string | null
    duration: number | null
    isShort: boolean | null
  }

  export type Video_statisticsCountAggregateOutputType = {
    id: number
    view_count: number
    like_count: number
    comment_count: number
    publish_time: number
    channel_id: number
    thumbnail: number
    title: number
    duration: number
    isShort: number
    _all: number
  }


  export type Video_statisticsAvgAggregateInputType = {
    view_count?: true
    like_count?: true
    comment_count?: true
    duration?: true
  }

  export type Video_statisticsSumAggregateInputType = {
    view_count?: true
    like_count?: true
    comment_count?: true
    duration?: true
  }

  export type Video_statisticsMinAggregateInputType = {
    id?: true
    view_count?: true
    like_count?: true
    comment_count?: true
    publish_time?: true
    channel_id?: true
    thumbnail?: true
    title?: true
    duration?: true
    isShort?: true
  }

  export type Video_statisticsMaxAggregateInputType = {
    id?: true
    view_count?: true
    like_count?: true
    comment_count?: true
    publish_time?: true
    channel_id?: true
    thumbnail?: true
    title?: true
    duration?: true
    isShort?: true
  }

  export type Video_statisticsCountAggregateInputType = {
    id?: true
    view_count?: true
    like_count?: true
    comment_count?: true
    publish_time?: true
    channel_id?: true
    thumbnail?: true
    title?: true
    duration?: true
    isShort?: true
    _all?: true
  }

  export type Video_statisticsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which video_statistics to aggregate.
     */
    where?: video_statisticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of video_statistics to fetch.
     */
    orderBy?: video_statisticsOrderByWithRelationInput | video_statisticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: video_statisticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` video_statistics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` video_statistics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned video_statistics
    **/
    _count?: true | Video_statisticsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: Video_statisticsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: Video_statisticsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Video_statisticsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Video_statisticsMaxAggregateInputType
  }

  export type GetVideo_statisticsAggregateType<T extends Video_statisticsAggregateArgs> = {
        [P in keyof T & keyof AggregateVideo_statistics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateVideo_statistics[P]>
      : GetScalarType<T[P], AggregateVideo_statistics[P]>
  }




  export type video_statisticsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: video_statisticsWhereInput
    orderBy?: video_statisticsOrderByWithAggregationInput | video_statisticsOrderByWithAggregationInput[]
    by: Video_statisticsScalarFieldEnum[] | Video_statisticsScalarFieldEnum
    having?: video_statisticsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Video_statisticsCountAggregateInputType | true
    _avg?: Video_statisticsAvgAggregateInputType
    _sum?: Video_statisticsSumAggregateInputType
    _min?: Video_statisticsMinAggregateInputType
    _max?: Video_statisticsMaxAggregateInputType
  }

  export type Video_statisticsGroupByOutputType = {
    id: string
    view_count: number
    like_count: number
    comment_count: number
    publish_time: Date
    channel_id: string
    thumbnail: string | null
    title: string | null
    duration: number | null
    isShort: boolean
    _count: Video_statisticsCountAggregateOutputType | null
    _avg: Video_statisticsAvgAggregateOutputType | null
    _sum: Video_statisticsSumAggregateOutputType | null
    _min: Video_statisticsMinAggregateOutputType | null
    _max: Video_statisticsMaxAggregateOutputType | null
  }

  type GetVideo_statisticsGroupByPayload<T extends video_statisticsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Video_statisticsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Video_statisticsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Video_statisticsGroupByOutputType[P]>
            : GetScalarType<T[P], Video_statisticsGroupByOutputType[P]>
        }
      >
    >


  export type video_statisticsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    view_count?: boolean
    like_count?: boolean
    comment_count?: boolean
    publish_time?: boolean
    channel_id?: boolean
    thumbnail?: boolean
    title?: boolean
    duration?: boolean
    isShort?: boolean
  }, ExtArgs["result"]["video_statistics"]>

  export type video_statisticsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    view_count?: boolean
    like_count?: boolean
    comment_count?: boolean
    publish_time?: boolean
    channel_id?: boolean
    thumbnail?: boolean
    title?: boolean
    duration?: boolean
    isShort?: boolean
  }, ExtArgs["result"]["video_statistics"]>

  export type video_statisticsSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    view_count?: boolean
    like_count?: boolean
    comment_count?: boolean
    publish_time?: boolean
    channel_id?: boolean
    thumbnail?: boolean
    title?: boolean
    duration?: boolean
    isShort?: boolean
  }, ExtArgs["result"]["video_statistics"]>

  export type video_statisticsSelectScalar = {
    id?: boolean
    view_count?: boolean
    like_count?: boolean
    comment_count?: boolean
    publish_time?: boolean
    channel_id?: boolean
    thumbnail?: boolean
    title?: boolean
    duration?: boolean
    isShort?: boolean
  }

  export type video_statisticsOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "view_count" | "like_count" | "comment_count" | "publish_time" | "channel_id" | "thumbnail" | "title" | "duration" | "isShort", ExtArgs["result"]["video_statistics"]>

  export type $video_statisticsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "video_statistics"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      view_count: number
      like_count: number
      comment_count: number
      publish_time: Date
      channel_id: string
      thumbnail: string | null
      title: string | null
      duration: number | null
      isShort: boolean
    }, ExtArgs["result"]["video_statistics"]>
    composites: {}
  }

  type video_statisticsGetPayload<S extends boolean | null | undefined | video_statisticsDefaultArgs> = $Result.GetResult<Prisma.$video_statisticsPayload, S>

  type video_statisticsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<video_statisticsFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Video_statisticsCountAggregateInputType | true
    }

  export interface video_statisticsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['video_statistics'], meta: { name: 'video_statistics' } }
    /**
     * Find zero or one Video_statistics that matches the filter.
     * @param {video_statisticsFindUniqueArgs} args - Arguments to find a Video_statistics
     * @example
     * // Get one Video_statistics
     * const video_statistics = await prisma.video_statistics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends video_statisticsFindUniqueArgs>(args: SelectSubset<T, video_statisticsFindUniqueArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Video_statistics that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {video_statisticsFindUniqueOrThrowArgs} args - Arguments to find a Video_statistics
     * @example
     * // Get one Video_statistics
     * const video_statistics = await prisma.video_statistics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends video_statisticsFindUniqueOrThrowArgs>(args: SelectSubset<T, video_statisticsFindUniqueOrThrowArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Video_statistics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {video_statisticsFindFirstArgs} args - Arguments to find a Video_statistics
     * @example
     * // Get one Video_statistics
     * const video_statistics = await prisma.video_statistics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends video_statisticsFindFirstArgs>(args?: SelectSubset<T, video_statisticsFindFirstArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Video_statistics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {video_statisticsFindFirstOrThrowArgs} args - Arguments to find a Video_statistics
     * @example
     * // Get one Video_statistics
     * const video_statistics = await prisma.video_statistics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends video_statisticsFindFirstOrThrowArgs>(args?: SelectSubset<T, video_statisticsFindFirstOrThrowArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Video_statistics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {video_statisticsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Video_statistics
     * const video_statistics = await prisma.video_statistics.findMany()
     * 
     * // Get first 10 Video_statistics
     * const video_statistics = await prisma.video_statistics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const video_statisticsWithIdOnly = await prisma.video_statistics.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends video_statisticsFindManyArgs>(args?: SelectSubset<T, video_statisticsFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Video_statistics.
     * @param {video_statisticsCreateArgs} args - Arguments to create a Video_statistics.
     * @example
     * // Create one Video_statistics
     * const Video_statistics = await prisma.video_statistics.create({
     *   data: {
     *     // ... data to create a Video_statistics
     *   }
     * })
     * 
     */
    create<T extends video_statisticsCreateArgs>(args: SelectSubset<T, video_statisticsCreateArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Video_statistics.
     * @param {video_statisticsCreateManyArgs} args - Arguments to create many Video_statistics.
     * @example
     * // Create many Video_statistics
     * const video_statistics = await prisma.video_statistics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends video_statisticsCreateManyArgs>(args?: SelectSubset<T, video_statisticsCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Video_statistics and returns the data saved in the database.
     * @param {video_statisticsCreateManyAndReturnArgs} args - Arguments to create many Video_statistics.
     * @example
     * // Create many Video_statistics
     * const video_statistics = await prisma.video_statistics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Video_statistics and only return the `id`
     * const video_statisticsWithIdOnly = await prisma.video_statistics.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends video_statisticsCreateManyAndReturnArgs>(args?: SelectSubset<T, video_statisticsCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Video_statistics.
     * @param {video_statisticsDeleteArgs} args - Arguments to delete one Video_statistics.
     * @example
     * // Delete one Video_statistics
     * const Video_statistics = await prisma.video_statistics.delete({
     *   where: {
     *     // ... filter to delete one Video_statistics
     *   }
     * })
     * 
     */
    delete<T extends video_statisticsDeleteArgs>(args: SelectSubset<T, video_statisticsDeleteArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Video_statistics.
     * @param {video_statisticsUpdateArgs} args - Arguments to update one Video_statistics.
     * @example
     * // Update one Video_statistics
     * const video_statistics = await prisma.video_statistics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends video_statisticsUpdateArgs>(args: SelectSubset<T, video_statisticsUpdateArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Video_statistics.
     * @param {video_statisticsDeleteManyArgs} args - Arguments to filter Video_statistics to delete.
     * @example
     * // Delete a few Video_statistics
     * const { count } = await prisma.video_statistics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends video_statisticsDeleteManyArgs>(args?: SelectSubset<T, video_statisticsDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Video_statistics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {video_statisticsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Video_statistics
     * const video_statistics = await prisma.video_statistics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends video_statisticsUpdateManyArgs>(args: SelectSubset<T, video_statisticsUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Video_statistics and returns the data updated in the database.
     * @param {video_statisticsUpdateManyAndReturnArgs} args - Arguments to update many Video_statistics.
     * @example
     * // Update many Video_statistics
     * const video_statistics = await prisma.video_statistics.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Video_statistics and only return the `id`
     * const video_statisticsWithIdOnly = await prisma.video_statistics.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends video_statisticsUpdateManyAndReturnArgs>(args: SelectSubset<T, video_statisticsUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Video_statistics.
     * @param {video_statisticsUpsertArgs} args - Arguments to update or create a Video_statistics.
     * @example
     * // Update or create a Video_statistics
     * const video_statistics = await prisma.video_statistics.upsert({
     *   create: {
     *     // ... data to create a Video_statistics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Video_statistics we want to update
     *   }
     * })
     */
    upsert<T extends video_statisticsUpsertArgs>(args: SelectSubset<T, video_statisticsUpsertArgs<ExtArgs>>): Prisma__video_statisticsClient<$Result.GetResult<Prisma.$video_statisticsPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Video_statistics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {video_statisticsCountArgs} args - Arguments to filter Video_statistics to count.
     * @example
     * // Count the number of Video_statistics
     * const count = await prisma.video_statistics.count({
     *   where: {
     *     // ... the filter for the Video_statistics we want to count
     *   }
     * })
    **/
    count<T extends video_statisticsCountArgs>(
      args?: Subset<T, video_statisticsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Video_statisticsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Video_statistics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Video_statisticsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Video_statisticsAggregateArgs>(args: Subset<T, Video_statisticsAggregateArgs>): Prisma.PrismaPromise<GetVideo_statisticsAggregateType<T>>

    /**
     * Group by Video_statistics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {video_statisticsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends video_statisticsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: video_statisticsGroupByArgs['orderBy'] }
        : { orderBy?: video_statisticsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, video_statisticsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetVideo_statisticsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the video_statistics model
   */
  readonly fields: video_statisticsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for video_statistics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__video_statisticsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the video_statistics model
   */
  interface video_statisticsFieldRefs {
    readonly id: FieldRef<"video_statistics", 'String'>
    readonly view_count: FieldRef<"video_statistics", 'Int'>
    readonly like_count: FieldRef<"video_statistics", 'Int'>
    readonly comment_count: FieldRef<"video_statistics", 'Int'>
    readonly publish_time: FieldRef<"video_statistics", 'DateTime'>
    readonly channel_id: FieldRef<"video_statistics", 'String'>
    readonly thumbnail: FieldRef<"video_statistics", 'String'>
    readonly title: FieldRef<"video_statistics", 'String'>
    readonly duration: FieldRef<"video_statistics", 'Int'>
    readonly isShort: FieldRef<"video_statistics", 'Boolean'>
  }
    

  // Custom InputTypes
  /**
   * video_statistics findUnique
   */
  export type video_statisticsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * Filter, which video_statistics to fetch.
     */
    where: video_statisticsWhereUniqueInput
  }

  /**
   * video_statistics findUniqueOrThrow
   */
  export type video_statisticsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * Filter, which video_statistics to fetch.
     */
    where: video_statisticsWhereUniqueInput
  }

  /**
   * video_statistics findFirst
   */
  export type video_statisticsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * Filter, which video_statistics to fetch.
     */
    where?: video_statisticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of video_statistics to fetch.
     */
    orderBy?: video_statisticsOrderByWithRelationInput | video_statisticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for video_statistics.
     */
    cursor?: video_statisticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` video_statistics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` video_statistics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of video_statistics.
     */
    distinct?: Video_statisticsScalarFieldEnum | Video_statisticsScalarFieldEnum[]
  }

  /**
   * video_statistics findFirstOrThrow
   */
  export type video_statisticsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * Filter, which video_statistics to fetch.
     */
    where?: video_statisticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of video_statistics to fetch.
     */
    orderBy?: video_statisticsOrderByWithRelationInput | video_statisticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for video_statistics.
     */
    cursor?: video_statisticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` video_statistics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` video_statistics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of video_statistics.
     */
    distinct?: Video_statisticsScalarFieldEnum | Video_statisticsScalarFieldEnum[]
  }

  /**
   * video_statistics findMany
   */
  export type video_statisticsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * Filter, which video_statistics to fetch.
     */
    where?: video_statisticsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of video_statistics to fetch.
     */
    orderBy?: video_statisticsOrderByWithRelationInput | video_statisticsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing video_statistics.
     */
    cursor?: video_statisticsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` video_statistics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` video_statistics.
     */
    skip?: number
    distinct?: Video_statisticsScalarFieldEnum | Video_statisticsScalarFieldEnum[]
  }

  /**
   * video_statistics create
   */
  export type video_statisticsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * The data needed to create a video_statistics.
     */
    data: XOR<video_statisticsCreateInput, video_statisticsUncheckedCreateInput>
  }

  /**
   * video_statistics createMany
   */
  export type video_statisticsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many video_statistics.
     */
    data: video_statisticsCreateManyInput | video_statisticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * video_statistics createManyAndReturn
   */
  export type video_statisticsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * The data used to create many video_statistics.
     */
    data: video_statisticsCreateManyInput | video_statisticsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * video_statistics update
   */
  export type video_statisticsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * The data needed to update a video_statistics.
     */
    data: XOR<video_statisticsUpdateInput, video_statisticsUncheckedUpdateInput>
    /**
     * Choose, which video_statistics to update.
     */
    where: video_statisticsWhereUniqueInput
  }

  /**
   * video_statistics updateMany
   */
  export type video_statisticsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update video_statistics.
     */
    data: XOR<video_statisticsUpdateManyMutationInput, video_statisticsUncheckedUpdateManyInput>
    /**
     * Filter which video_statistics to update
     */
    where?: video_statisticsWhereInput
    /**
     * Limit how many video_statistics to update.
     */
    limit?: number
  }

  /**
   * video_statistics updateManyAndReturn
   */
  export type video_statisticsUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * The data used to update video_statistics.
     */
    data: XOR<video_statisticsUpdateManyMutationInput, video_statisticsUncheckedUpdateManyInput>
    /**
     * Filter which video_statistics to update
     */
    where?: video_statisticsWhereInput
    /**
     * Limit how many video_statistics to update.
     */
    limit?: number
  }

  /**
   * video_statistics upsert
   */
  export type video_statisticsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * The filter to search for the video_statistics to update in case it exists.
     */
    where: video_statisticsWhereUniqueInput
    /**
     * In case the video_statistics found by the `where` argument doesn't exist, create a new video_statistics with this data.
     */
    create: XOR<video_statisticsCreateInput, video_statisticsUncheckedCreateInput>
    /**
     * In case the video_statistics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<video_statisticsUpdateInput, video_statisticsUncheckedUpdateInput>
  }

  /**
   * video_statistics delete
   */
  export type video_statisticsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
    /**
     * Filter which video_statistics to delete.
     */
    where: video_statisticsWhereUniqueInput
  }

  /**
   * video_statistics deleteMany
   */
  export type video_statisticsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which video_statistics to delete
     */
    where?: video_statisticsWhereInput
    /**
     * Limit how many video_statistics to delete.
     */
    limit?: number
  }

  /**
   * video_statistics without action
   */
  export type video_statisticsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the video_statistics
     */
    select?: video_statisticsSelect<ExtArgs> | null
    /**
     * Omit specific fields from the video_statistics
     */
    omit?: video_statisticsOmit<ExtArgs> | null
  }


  /**
   * Model auth_tokens
   */

  export type AggregateAuth_tokens = {
    _count: Auth_tokensCountAggregateOutputType | null
    _min: Auth_tokensMinAggregateOutputType | null
    _max: Auth_tokensMaxAggregateOutputType | null
  }

  export type Auth_tokensMinAggregateOutputType = {
    provider: string | null
    access_token: string | null
    refresh_token: string | null
    expiry_date: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Auth_tokensMaxAggregateOutputType = {
    provider: string | null
    access_token: string | null
    refresh_token: string | null
    expiry_date: Date | null
    created_at: Date | null
    updated_at: Date | null
  }

  export type Auth_tokensCountAggregateOutputType = {
    provider: number
    access_token: number
    refresh_token: number
    expiry_date: number
    created_at: number
    updated_at: number
    _all: number
  }


  export type Auth_tokensMinAggregateInputType = {
    provider?: true
    access_token?: true
    refresh_token?: true
    expiry_date?: true
    created_at?: true
    updated_at?: true
  }

  export type Auth_tokensMaxAggregateInputType = {
    provider?: true
    access_token?: true
    refresh_token?: true
    expiry_date?: true
    created_at?: true
    updated_at?: true
  }

  export type Auth_tokensCountAggregateInputType = {
    provider?: true
    access_token?: true
    refresh_token?: true
    expiry_date?: true
    created_at?: true
    updated_at?: true
    _all?: true
  }

  export type Auth_tokensAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which auth_tokens to aggregate.
     */
    where?: auth_tokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of auth_tokens to fetch.
     */
    orderBy?: auth_tokensOrderByWithRelationInput | auth_tokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: auth_tokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` auth_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` auth_tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned auth_tokens
    **/
    _count?: true | Auth_tokensCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: Auth_tokensMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: Auth_tokensMaxAggregateInputType
  }

  export type GetAuth_tokensAggregateType<T extends Auth_tokensAggregateArgs> = {
        [P in keyof T & keyof AggregateAuth_tokens]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAuth_tokens[P]>
      : GetScalarType<T[P], AggregateAuth_tokens[P]>
  }




  export type auth_tokensGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: auth_tokensWhereInput
    orderBy?: auth_tokensOrderByWithAggregationInput | auth_tokensOrderByWithAggregationInput[]
    by: Auth_tokensScalarFieldEnum[] | Auth_tokensScalarFieldEnum
    having?: auth_tokensScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: Auth_tokensCountAggregateInputType | true
    _min?: Auth_tokensMinAggregateInputType
    _max?: Auth_tokensMaxAggregateInputType
  }

  export type Auth_tokensGroupByOutputType = {
    provider: string
    access_token: string
    refresh_token: string | null
    expiry_date: Date | null
    created_at: Date
    updated_at: Date
    _count: Auth_tokensCountAggregateOutputType | null
    _min: Auth_tokensMinAggregateOutputType | null
    _max: Auth_tokensMaxAggregateOutputType | null
  }

  type GetAuth_tokensGroupByPayload<T extends auth_tokensGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<Auth_tokensGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof Auth_tokensGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], Auth_tokensGroupByOutputType[P]>
            : GetScalarType<T[P], Auth_tokensGroupByOutputType[P]>
        }
      >
    >


  export type auth_tokensSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expiry_date?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["auth_tokens"]>

  export type auth_tokensSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expiry_date?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["auth_tokens"]>

  export type auth_tokensSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expiry_date?: boolean
    created_at?: boolean
    updated_at?: boolean
  }, ExtArgs["result"]["auth_tokens"]>

  export type auth_tokensSelectScalar = {
    provider?: boolean
    access_token?: boolean
    refresh_token?: boolean
    expiry_date?: boolean
    created_at?: boolean
    updated_at?: boolean
  }

  export type auth_tokensOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"provider" | "access_token" | "refresh_token" | "expiry_date" | "created_at" | "updated_at", ExtArgs["result"]["auth_tokens"]>

  export type $auth_tokensPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "auth_tokens"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      provider: string
      access_token: string
      refresh_token: string | null
      expiry_date: Date | null
      created_at: Date
      updated_at: Date
    }, ExtArgs["result"]["auth_tokens"]>
    composites: {}
  }

  type auth_tokensGetPayload<S extends boolean | null | undefined | auth_tokensDefaultArgs> = $Result.GetResult<Prisma.$auth_tokensPayload, S>

  type auth_tokensCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<auth_tokensFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: Auth_tokensCountAggregateInputType | true
    }

  export interface auth_tokensDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['auth_tokens'], meta: { name: 'auth_tokens' } }
    /**
     * Find zero or one Auth_tokens that matches the filter.
     * @param {auth_tokensFindUniqueArgs} args - Arguments to find a Auth_tokens
     * @example
     * // Get one Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends auth_tokensFindUniqueArgs>(args: SelectSubset<T, auth_tokensFindUniqueArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Auth_tokens that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {auth_tokensFindUniqueOrThrowArgs} args - Arguments to find a Auth_tokens
     * @example
     * // Get one Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends auth_tokensFindUniqueOrThrowArgs>(args: SelectSubset<T, auth_tokensFindUniqueOrThrowArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth_tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {auth_tokensFindFirstArgs} args - Arguments to find a Auth_tokens
     * @example
     * // Get one Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends auth_tokensFindFirstArgs>(args?: SelectSubset<T, auth_tokensFindFirstArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Auth_tokens that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {auth_tokensFindFirstOrThrowArgs} args - Arguments to find a Auth_tokens
     * @example
     * // Get one Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends auth_tokensFindFirstOrThrowArgs>(args?: SelectSubset<T, auth_tokensFindFirstOrThrowArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Auth_tokens that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {auth_tokensFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.findMany()
     * 
     * // Get first 10 Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.findMany({ take: 10 })
     * 
     * // Only select the `provider`
     * const auth_tokensWithProviderOnly = await prisma.auth_tokens.findMany({ select: { provider: true } })
     * 
     */
    findMany<T extends auth_tokensFindManyArgs>(args?: SelectSubset<T, auth_tokensFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Auth_tokens.
     * @param {auth_tokensCreateArgs} args - Arguments to create a Auth_tokens.
     * @example
     * // Create one Auth_tokens
     * const Auth_tokens = await prisma.auth_tokens.create({
     *   data: {
     *     // ... data to create a Auth_tokens
     *   }
     * })
     * 
     */
    create<T extends auth_tokensCreateArgs>(args: SelectSubset<T, auth_tokensCreateArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Auth_tokens.
     * @param {auth_tokensCreateManyArgs} args - Arguments to create many Auth_tokens.
     * @example
     * // Create many Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends auth_tokensCreateManyArgs>(args?: SelectSubset<T, auth_tokensCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Auth_tokens and returns the data saved in the database.
     * @param {auth_tokensCreateManyAndReturnArgs} args - Arguments to create many Auth_tokens.
     * @example
     * // Create many Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Auth_tokens and only return the `provider`
     * const auth_tokensWithProviderOnly = await prisma.auth_tokens.createManyAndReturn({
     *   select: { provider: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends auth_tokensCreateManyAndReturnArgs>(args?: SelectSubset<T, auth_tokensCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Auth_tokens.
     * @param {auth_tokensDeleteArgs} args - Arguments to delete one Auth_tokens.
     * @example
     * // Delete one Auth_tokens
     * const Auth_tokens = await prisma.auth_tokens.delete({
     *   where: {
     *     // ... filter to delete one Auth_tokens
     *   }
     * })
     * 
     */
    delete<T extends auth_tokensDeleteArgs>(args: SelectSubset<T, auth_tokensDeleteArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Auth_tokens.
     * @param {auth_tokensUpdateArgs} args - Arguments to update one Auth_tokens.
     * @example
     * // Update one Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends auth_tokensUpdateArgs>(args: SelectSubset<T, auth_tokensUpdateArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Auth_tokens.
     * @param {auth_tokensDeleteManyArgs} args - Arguments to filter Auth_tokens to delete.
     * @example
     * // Delete a few Auth_tokens
     * const { count } = await prisma.auth_tokens.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends auth_tokensDeleteManyArgs>(args?: SelectSubset<T, auth_tokensDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auth_tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {auth_tokensUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends auth_tokensUpdateManyArgs>(args: SelectSubset<T, auth_tokensUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Auth_tokens and returns the data updated in the database.
     * @param {auth_tokensUpdateManyAndReturnArgs} args - Arguments to update many Auth_tokens.
     * @example
     * // Update many Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Auth_tokens and only return the `provider`
     * const auth_tokensWithProviderOnly = await prisma.auth_tokens.updateManyAndReturn({
     *   select: { provider: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends auth_tokensUpdateManyAndReturnArgs>(args: SelectSubset<T, auth_tokensUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Auth_tokens.
     * @param {auth_tokensUpsertArgs} args - Arguments to update or create a Auth_tokens.
     * @example
     * // Update or create a Auth_tokens
     * const auth_tokens = await prisma.auth_tokens.upsert({
     *   create: {
     *     // ... data to create a Auth_tokens
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Auth_tokens we want to update
     *   }
     * })
     */
    upsert<T extends auth_tokensUpsertArgs>(args: SelectSubset<T, auth_tokensUpsertArgs<ExtArgs>>): Prisma__auth_tokensClient<$Result.GetResult<Prisma.$auth_tokensPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Auth_tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {auth_tokensCountArgs} args - Arguments to filter Auth_tokens to count.
     * @example
     * // Count the number of Auth_tokens
     * const count = await prisma.auth_tokens.count({
     *   where: {
     *     // ... the filter for the Auth_tokens we want to count
     *   }
     * })
    **/
    count<T extends auth_tokensCountArgs>(
      args?: Subset<T, auth_tokensCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], Auth_tokensCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Auth_tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {Auth_tokensAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends Auth_tokensAggregateArgs>(args: Subset<T, Auth_tokensAggregateArgs>): Prisma.PrismaPromise<GetAuth_tokensAggregateType<T>>

    /**
     * Group by Auth_tokens.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {auth_tokensGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends auth_tokensGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: auth_tokensGroupByArgs['orderBy'] }
        : { orderBy?: auth_tokensGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, auth_tokensGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuth_tokensGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the auth_tokens model
   */
  readonly fields: auth_tokensFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for auth_tokens.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__auth_tokensClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the auth_tokens model
   */
  interface auth_tokensFieldRefs {
    readonly provider: FieldRef<"auth_tokens", 'String'>
    readonly access_token: FieldRef<"auth_tokens", 'String'>
    readonly refresh_token: FieldRef<"auth_tokens", 'String'>
    readonly expiry_date: FieldRef<"auth_tokens", 'DateTime'>
    readonly created_at: FieldRef<"auth_tokens", 'DateTime'>
    readonly updated_at: FieldRef<"auth_tokens", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * auth_tokens findUnique
   */
  export type auth_tokensFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * Filter, which auth_tokens to fetch.
     */
    where: auth_tokensWhereUniqueInput
  }

  /**
   * auth_tokens findUniqueOrThrow
   */
  export type auth_tokensFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * Filter, which auth_tokens to fetch.
     */
    where: auth_tokensWhereUniqueInput
  }

  /**
   * auth_tokens findFirst
   */
  export type auth_tokensFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * Filter, which auth_tokens to fetch.
     */
    where?: auth_tokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of auth_tokens to fetch.
     */
    orderBy?: auth_tokensOrderByWithRelationInput | auth_tokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for auth_tokens.
     */
    cursor?: auth_tokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` auth_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` auth_tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of auth_tokens.
     */
    distinct?: Auth_tokensScalarFieldEnum | Auth_tokensScalarFieldEnum[]
  }

  /**
   * auth_tokens findFirstOrThrow
   */
  export type auth_tokensFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * Filter, which auth_tokens to fetch.
     */
    where?: auth_tokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of auth_tokens to fetch.
     */
    orderBy?: auth_tokensOrderByWithRelationInput | auth_tokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for auth_tokens.
     */
    cursor?: auth_tokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` auth_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` auth_tokens.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of auth_tokens.
     */
    distinct?: Auth_tokensScalarFieldEnum | Auth_tokensScalarFieldEnum[]
  }

  /**
   * auth_tokens findMany
   */
  export type auth_tokensFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * Filter, which auth_tokens to fetch.
     */
    where?: auth_tokensWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of auth_tokens to fetch.
     */
    orderBy?: auth_tokensOrderByWithRelationInput | auth_tokensOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing auth_tokens.
     */
    cursor?: auth_tokensWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` auth_tokens from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` auth_tokens.
     */
    skip?: number
    distinct?: Auth_tokensScalarFieldEnum | Auth_tokensScalarFieldEnum[]
  }

  /**
   * auth_tokens create
   */
  export type auth_tokensCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * The data needed to create a auth_tokens.
     */
    data: XOR<auth_tokensCreateInput, auth_tokensUncheckedCreateInput>
  }

  /**
   * auth_tokens createMany
   */
  export type auth_tokensCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many auth_tokens.
     */
    data: auth_tokensCreateManyInput | auth_tokensCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * auth_tokens createManyAndReturn
   */
  export type auth_tokensCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * The data used to create many auth_tokens.
     */
    data: auth_tokensCreateManyInput | auth_tokensCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * auth_tokens update
   */
  export type auth_tokensUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * The data needed to update a auth_tokens.
     */
    data: XOR<auth_tokensUpdateInput, auth_tokensUncheckedUpdateInput>
    /**
     * Choose, which auth_tokens to update.
     */
    where: auth_tokensWhereUniqueInput
  }

  /**
   * auth_tokens updateMany
   */
  export type auth_tokensUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update auth_tokens.
     */
    data: XOR<auth_tokensUpdateManyMutationInput, auth_tokensUncheckedUpdateManyInput>
    /**
     * Filter which auth_tokens to update
     */
    where?: auth_tokensWhereInput
    /**
     * Limit how many auth_tokens to update.
     */
    limit?: number
  }

  /**
   * auth_tokens updateManyAndReturn
   */
  export type auth_tokensUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * The data used to update auth_tokens.
     */
    data: XOR<auth_tokensUpdateManyMutationInput, auth_tokensUncheckedUpdateManyInput>
    /**
     * Filter which auth_tokens to update
     */
    where?: auth_tokensWhereInput
    /**
     * Limit how many auth_tokens to update.
     */
    limit?: number
  }

  /**
   * auth_tokens upsert
   */
  export type auth_tokensUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * The filter to search for the auth_tokens to update in case it exists.
     */
    where: auth_tokensWhereUniqueInput
    /**
     * In case the auth_tokens found by the `where` argument doesn't exist, create a new auth_tokens with this data.
     */
    create: XOR<auth_tokensCreateInput, auth_tokensUncheckedCreateInput>
    /**
     * In case the auth_tokens was found with the provided `where` argument, update it with this data.
     */
    update: XOR<auth_tokensUpdateInput, auth_tokensUncheckedUpdateInput>
  }

  /**
   * auth_tokens delete
   */
  export type auth_tokensDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
    /**
     * Filter which auth_tokens to delete.
     */
    where: auth_tokensWhereUniqueInput
  }

  /**
   * auth_tokens deleteMany
   */
  export type auth_tokensDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which auth_tokens to delete
     */
    where?: auth_tokensWhereInput
    /**
     * Limit how many auth_tokens to delete.
     */
    limit?: number
  }

  /**
   * auth_tokens without action
   */
  export type auth_tokensDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the auth_tokens
     */
    select?: auth_tokensSelect<ExtArgs> | null
    /**
     * Omit specific fields from the auth_tokens
     */
    omit?: auth_tokensOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const CompetitorsScalarFieldEnum: {
    id: 'id',
    url: 'url',
    title: 'title',
    profilePic: 'profilePic'
  };

  export type CompetitorsScalarFieldEnum = (typeof CompetitorsScalarFieldEnum)[keyof typeof CompetitorsScalarFieldEnum]


  export const Video_statisticsScalarFieldEnum: {
    id: 'id',
    view_count: 'view_count',
    like_count: 'like_count',
    comment_count: 'comment_count',
    publish_time: 'publish_time',
    channel_id: 'channel_id',
    thumbnail: 'thumbnail',
    title: 'title',
    duration: 'duration',
    isShort: 'isShort'
  };

  export type Video_statisticsScalarFieldEnum = (typeof Video_statisticsScalarFieldEnum)[keyof typeof Video_statisticsScalarFieldEnum]


  export const Auth_tokensScalarFieldEnum: {
    provider: 'provider',
    access_token: 'access_token',
    refresh_token: 'refresh_token',
    expiry_date: 'expiry_date',
    created_at: 'created_at',
    updated_at: 'updated_at'
  };

  export type Auth_tokensScalarFieldEnum = (typeof Auth_tokensScalarFieldEnum)[keyof typeof Auth_tokensScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type competitorsWhereInput = {
    AND?: competitorsWhereInput | competitorsWhereInput[]
    OR?: competitorsWhereInput[]
    NOT?: competitorsWhereInput | competitorsWhereInput[]
    id?: StringFilter<"competitors"> | string
    url?: StringFilter<"competitors"> | string
    title?: StringNullableFilter<"competitors"> | string | null
    profilePic?: StringNullableFilter<"competitors"> | string | null
  }

  export type competitorsOrderByWithRelationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    profilePic?: SortOrderInput | SortOrder
  }

  export type competitorsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: competitorsWhereInput | competitorsWhereInput[]
    OR?: competitorsWhereInput[]
    NOT?: competitorsWhereInput | competitorsWhereInput[]
    url?: StringFilter<"competitors"> | string
    title?: StringNullableFilter<"competitors"> | string | null
    profilePic?: StringNullableFilter<"competitors"> | string | null
  }, "id">

  export type competitorsOrderByWithAggregationInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrderInput | SortOrder
    profilePic?: SortOrderInput | SortOrder
    _count?: competitorsCountOrderByAggregateInput
    _max?: competitorsMaxOrderByAggregateInput
    _min?: competitorsMinOrderByAggregateInput
  }

  export type competitorsScalarWhereWithAggregatesInput = {
    AND?: competitorsScalarWhereWithAggregatesInput | competitorsScalarWhereWithAggregatesInput[]
    OR?: competitorsScalarWhereWithAggregatesInput[]
    NOT?: competitorsScalarWhereWithAggregatesInput | competitorsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"competitors"> | string
    url?: StringWithAggregatesFilter<"competitors"> | string
    title?: StringNullableWithAggregatesFilter<"competitors"> | string | null
    profilePic?: StringNullableWithAggregatesFilter<"competitors"> | string | null
  }

  export type video_statisticsWhereInput = {
    AND?: video_statisticsWhereInput | video_statisticsWhereInput[]
    OR?: video_statisticsWhereInput[]
    NOT?: video_statisticsWhereInput | video_statisticsWhereInput[]
    id?: StringFilter<"video_statistics"> | string
    view_count?: IntFilter<"video_statistics"> | number
    like_count?: IntFilter<"video_statistics"> | number
    comment_count?: IntFilter<"video_statistics"> | number
    publish_time?: DateTimeFilter<"video_statistics"> | Date | string
    channel_id?: StringFilter<"video_statistics"> | string
    thumbnail?: StringNullableFilter<"video_statistics"> | string | null
    title?: StringNullableFilter<"video_statistics"> | string | null
    duration?: IntNullableFilter<"video_statistics"> | number | null
    isShort?: BoolFilter<"video_statistics"> | boolean
  }

  export type video_statisticsOrderByWithRelationInput = {
    id?: SortOrder
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    publish_time?: SortOrder
    channel_id?: SortOrder
    thumbnail?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    isShort?: SortOrder
  }

  export type video_statisticsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: video_statisticsWhereInput | video_statisticsWhereInput[]
    OR?: video_statisticsWhereInput[]
    NOT?: video_statisticsWhereInput | video_statisticsWhereInput[]
    view_count?: IntFilter<"video_statistics"> | number
    like_count?: IntFilter<"video_statistics"> | number
    comment_count?: IntFilter<"video_statistics"> | number
    publish_time?: DateTimeFilter<"video_statistics"> | Date | string
    channel_id?: StringFilter<"video_statistics"> | string
    thumbnail?: StringNullableFilter<"video_statistics"> | string | null
    title?: StringNullableFilter<"video_statistics"> | string | null
    duration?: IntNullableFilter<"video_statistics"> | number | null
    isShort?: BoolFilter<"video_statistics"> | boolean
  }, "id">

  export type video_statisticsOrderByWithAggregationInput = {
    id?: SortOrder
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    publish_time?: SortOrder
    channel_id?: SortOrder
    thumbnail?: SortOrderInput | SortOrder
    title?: SortOrderInput | SortOrder
    duration?: SortOrderInput | SortOrder
    isShort?: SortOrder
    _count?: video_statisticsCountOrderByAggregateInput
    _avg?: video_statisticsAvgOrderByAggregateInput
    _max?: video_statisticsMaxOrderByAggregateInput
    _min?: video_statisticsMinOrderByAggregateInput
    _sum?: video_statisticsSumOrderByAggregateInput
  }

  export type video_statisticsScalarWhereWithAggregatesInput = {
    AND?: video_statisticsScalarWhereWithAggregatesInput | video_statisticsScalarWhereWithAggregatesInput[]
    OR?: video_statisticsScalarWhereWithAggregatesInput[]
    NOT?: video_statisticsScalarWhereWithAggregatesInput | video_statisticsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"video_statistics"> | string
    view_count?: IntWithAggregatesFilter<"video_statistics"> | number
    like_count?: IntWithAggregatesFilter<"video_statistics"> | number
    comment_count?: IntWithAggregatesFilter<"video_statistics"> | number
    publish_time?: DateTimeWithAggregatesFilter<"video_statistics"> | Date | string
    channel_id?: StringWithAggregatesFilter<"video_statistics"> | string
    thumbnail?: StringNullableWithAggregatesFilter<"video_statistics"> | string | null
    title?: StringNullableWithAggregatesFilter<"video_statistics"> | string | null
    duration?: IntNullableWithAggregatesFilter<"video_statistics"> | number | null
    isShort?: BoolWithAggregatesFilter<"video_statistics"> | boolean
  }

  export type auth_tokensWhereInput = {
    AND?: auth_tokensWhereInput | auth_tokensWhereInput[]
    OR?: auth_tokensWhereInput[]
    NOT?: auth_tokensWhereInput | auth_tokensWhereInput[]
    provider?: StringFilter<"auth_tokens"> | string
    access_token?: StringFilter<"auth_tokens"> | string
    refresh_token?: StringNullableFilter<"auth_tokens"> | string | null
    expiry_date?: DateTimeNullableFilter<"auth_tokens"> | Date | string | null
    created_at?: DateTimeFilter<"auth_tokens"> | Date | string
    updated_at?: DateTimeFilter<"auth_tokens"> | Date | string
  }

  export type auth_tokensOrderByWithRelationInput = {
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    expiry_date?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type auth_tokensWhereUniqueInput = Prisma.AtLeast<{
    provider?: string
    AND?: auth_tokensWhereInput | auth_tokensWhereInput[]
    OR?: auth_tokensWhereInput[]
    NOT?: auth_tokensWhereInput | auth_tokensWhereInput[]
    access_token?: StringFilter<"auth_tokens"> | string
    refresh_token?: StringNullableFilter<"auth_tokens"> | string | null
    expiry_date?: DateTimeNullableFilter<"auth_tokens"> | Date | string | null
    created_at?: DateTimeFilter<"auth_tokens"> | Date | string
    updated_at?: DateTimeFilter<"auth_tokens"> | Date | string
  }, "provider">

  export type auth_tokensOrderByWithAggregationInput = {
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrderInput | SortOrder
    expiry_date?: SortOrderInput | SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
    _count?: auth_tokensCountOrderByAggregateInput
    _max?: auth_tokensMaxOrderByAggregateInput
    _min?: auth_tokensMinOrderByAggregateInput
  }

  export type auth_tokensScalarWhereWithAggregatesInput = {
    AND?: auth_tokensScalarWhereWithAggregatesInput | auth_tokensScalarWhereWithAggregatesInput[]
    OR?: auth_tokensScalarWhereWithAggregatesInput[]
    NOT?: auth_tokensScalarWhereWithAggregatesInput | auth_tokensScalarWhereWithAggregatesInput[]
    provider?: StringWithAggregatesFilter<"auth_tokens"> | string
    access_token?: StringWithAggregatesFilter<"auth_tokens"> | string
    refresh_token?: StringNullableWithAggregatesFilter<"auth_tokens"> | string | null
    expiry_date?: DateTimeNullableWithAggregatesFilter<"auth_tokens"> | Date | string | null
    created_at?: DateTimeWithAggregatesFilter<"auth_tokens"> | Date | string
    updated_at?: DateTimeWithAggregatesFilter<"auth_tokens"> | Date | string
  }

  export type competitorsCreateInput = {
    id: string
    url: string
    title?: string | null
    profilePic?: string | null
  }

  export type competitorsUncheckedCreateInput = {
    id: string
    url: string
    title?: string | null
    profilePic?: string | null
  }

  export type competitorsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type competitorsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type competitorsCreateManyInput = {
    id: string
    url: string
    title?: string | null
    profilePic?: string | null
  }

  export type competitorsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type competitorsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    title?: NullableStringFieldUpdateOperationsInput | string | null
    profilePic?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type video_statisticsCreateInput = {
    id: string
    view_count: number
    like_count: number
    comment_count: number
    publish_time: Date | string
    channel_id: string
    thumbnail?: string | null
    title?: string | null
    duration?: number | null
    isShort?: boolean
  }

  export type video_statisticsUncheckedCreateInput = {
    id: string
    view_count: number
    like_count: number
    comment_count: number
    publish_time: Date | string
    channel_id: string
    thumbnail?: string | null
    title?: string | null
    duration?: number | null
    isShort?: boolean
  }

  export type video_statisticsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    like_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    publish_time?: DateTimeFieldUpdateOperationsInput | Date | string
    channel_id?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    isShort?: BoolFieldUpdateOperationsInput | boolean
  }

  export type video_statisticsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    like_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    publish_time?: DateTimeFieldUpdateOperationsInput | Date | string
    channel_id?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    isShort?: BoolFieldUpdateOperationsInput | boolean
  }

  export type video_statisticsCreateManyInput = {
    id: string
    view_count: number
    like_count: number
    comment_count: number
    publish_time: Date | string
    channel_id: string
    thumbnail?: string | null
    title?: string | null
    duration?: number | null
    isShort?: boolean
  }

  export type video_statisticsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    like_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    publish_time?: DateTimeFieldUpdateOperationsInput | Date | string
    channel_id?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    isShort?: BoolFieldUpdateOperationsInput | boolean
  }

  export type video_statisticsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    view_count?: IntFieldUpdateOperationsInput | number
    like_count?: IntFieldUpdateOperationsInput | number
    comment_count?: IntFieldUpdateOperationsInput | number
    publish_time?: DateTimeFieldUpdateOperationsInput | Date | string
    channel_id?: StringFieldUpdateOperationsInput | string
    thumbnail?: NullableStringFieldUpdateOperationsInput | string | null
    title?: NullableStringFieldUpdateOperationsInput | string | null
    duration?: NullableIntFieldUpdateOperationsInput | number | null
    isShort?: BoolFieldUpdateOperationsInput | boolean
  }

  export type auth_tokensCreateInput = {
    provider: string
    access_token: string
    refresh_token?: string | null
    expiry_date?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type auth_tokensUncheckedCreateInput = {
    provider: string
    access_token: string
    refresh_token?: string | null
    expiry_date?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type auth_tokensUpdateInput = {
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type auth_tokensUncheckedUpdateInput = {
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type auth_tokensCreateManyInput = {
    provider: string
    access_token: string
    refresh_token?: string | null
    expiry_date?: Date | string | null
    created_at?: Date | string
    updated_at?: Date | string
  }

  export type auth_tokensUpdateManyMutationInput = {
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type auth_tokensUncheckedUpdateManyInput = {
    provider?: StringFieldUpdateOperationsInput | string
    access_token?: StringFieldUpdateOperationsInput | string
    refresh_token?: NullableStringFieldUpdateOperationsInput | string | null
    expiry_date?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    created_at?: DateTimeFieldUpdateOperationsInput | Date | string
    updated_at?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type competitorsCountOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    profilePic?: SortOrder
  }

  export type competitorsMaxOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    profilePic?: SortOrder
  }

  export type competitorsMinOrderByAggregateInput = {
    id?: SortOrder
    url?: SortOrder
    title?: SortOrder
    profilePic?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type video_statisticsCountOrderByAggregateInput = {
    id?: SortOrder
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    publish_time?: SortOrder
    channel_id?: SortOrder
    thumbnail?: SortOrder
    title?: SortOrder
    duration?: SortOrder
    isShort?: SortOrder
  }

  export type video_statisticsAvgOrderByAggregateInput = {
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    duration?: SortOrder
  }

  export type video_statisticsMaxOrderByAggregateInput = {
    id?: SortOrder
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    publish_time?: SortOrder
    channel_id?: SortOrder
    thumbnail?: SortOrder
    title?: SortOrder
    duration?: SortOrder
    isShort?: SortOrder
  }

  export type video_statisticsMinOrderByAggregateInput = {
    id?: SortOrder
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    publish_time?: SortOrder
    channel_id?: SortOrder
    thumbnail?: SortOrder
    title?: SortOrder
    duration?: SortOrder
    isShort?: SortOrder
  }

  export type video_statisticsSumOrderByAggregateInput = {
    view_count?: SortOrder
    like_count?: SortOrder
    comment_count?: SortOrder
    duration?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type auth_tokensCountOrderByAggregateInput = {
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expiry_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type auth_tokensMaxOrderByAggregateInput = {
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expiry_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type auth_tokensMinOrderByAggregateInput = {
    provider?: SortOrder
    access_token?: SortOrder
    refresh_token?: SortOrder
    expiry_date?: SortOrder
    created_at?: SortOrder
    updated_at?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}