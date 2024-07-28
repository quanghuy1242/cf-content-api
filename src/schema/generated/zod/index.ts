import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { StatusEnum } from 'schema/content';
import { MetaSchema, TagSchema, StatusEnum } from 'schema/content';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','emailAddress']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','description','status','modified','created']);

export const ContentScalarFieldEnumSchema = z.enum(['id','title','slug','content','coverImage','tags','meta','categoryId','status','userId','modified','created']);

export const SortOrderSchema = z.enum(['asc','desc']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  /**
   * z.string().email()
   */
  emailAddress: z.string(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  status: StatusEnum,
  modified: z.coerce.date(),
  created: z.coerce.date(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// CATEGORY CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const CategoryCustomValidatorsSchema = CategorySchema

export type CategoryCustomValidators = z.infer<typeof CategoryCustomValidatorsSchema>

/////////////////////////////////////////
// CONTENT SCHEMA
/////////////////////////////////////////

export const ContentSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  categoryId: z.string(),
  status: StatusEnum.default("PENDING"),
  userId: z.string(),
  modified: z.coerce.date(),
  created: z.coerce.date(),
})

export type Content = z.infer<typeof ContentSchema>

/////////////////////////////////////////
// CONTENT CUSTOM VALIDATORS SCHEMA
/////////////////////////////////////////

export const ContentCustomValidatorsSchema = ContentSchema

export type ContentCustomValidators = z.infer<typeof ContentCustomValidatorsSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  contents: z.union([z.boolean(),z.lazy(() => ContentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  contents: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  emailAddress: z.boolean().optional(),
  contents: z.union([z.boolean(),z.lazy(() => ContentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  contents: z.union([z.boolean(),z.lazy(() => ContentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  contents: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  description: z.boolean().optional(),
  status: z.boolean().optional(),
  modified: z.boolean().optional(),
  created: z.boolean().optional(),
  contents: z.union([z.boolean(),z.lazy(() => ContentFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CONTENT
//------------------------------------------------------

export const ContentIncludeSchema: z.ZodType<Prisma.ContentInclude> = z.object({
  author: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()

export const ContentArgsSchema: z.ZodType<Prisma.ContentDefaultArgs> = z.object({
  select: z.lazy(() => ContentSelectSchema).optional(),
  include: z.lazy(() => ContentIncludeSchema).optional(),
}).strict();

export const ContentSelectSchema: z.ZodType<Prisma.ContentSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  slug: z.boolean().optional(),
  content: z.boolean().optional(),
  coverImage: z.boolean().optional(),
  tags: z.boolean().optional(),
  meta: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  status: z.boolean().optional(),
  userId: z.boolean().optional(),
  modified: z.boolean().optional(),
  created: z.boolean().optional(),
  author: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  emailAddress: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contents: z.lazy(() => ContentListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  emailAddress: z.lazy(() => SortOrderSchema).optional(),
  contents: z.lazy(() => ContentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    emailAddress: z.string()
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    emailAddress: z.string(),
  }),
])
.and(z.object({
  id: z.string().optional(),
  emailAddress: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  contents: z.lazy(() => ContentListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  emailAddress: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  emailAddress: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  modified: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contents: z.lazy(() => ContentListRelationFilterSchema).optional()
}).strict();

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  contents: z.lazy(() => ContentOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Omit<Prisma.CategoryWhereUniqueInput, "id" | "modified" | "created">> = z.union([
  z.object({
    // omitted: id: z.string().uuid(),
    name: z.string()
  }),
  z.object({
    // omitted: id: z.string().uuid(),
  }),
  z.object({
    name: z.string(),
  }),
])
.and(z.object({
  // omitted: id: z.string().uuid().optional(),
  name: z.string().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema),z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),StatusEnum ]).optional(),
  // omitted: modified: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  // omitted: created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  contents: z.lazy(() => ContentListRelationFilterSchema).optional()
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional()
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema),z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  modified: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ContentWhereInputSchema: z.ZodType<Prisma.ContentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContentWhereInputSchema),z.lazy(() => ContentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentWhereInputSchema),z.lazy(() => ContentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  coverImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tags: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  meta: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  modified: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  author: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}).strict();

export const ContentOrderByWithRelationInputSchema: z.ZodType<Prisma.ContentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  coverImage: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  meta: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional()
}).strict();

export const ContentWhereUniqueInputSchema: z.ZodType<Omit<Prisma.ContentWhereUniqueInput, "id" | "modified" | "created">> = z.union([
  z.object({
    // omitted: id: z.string().uuid(),
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-_]*$/)
  }),
  z.object({
    // omitted: id: z.string().uuid(),
    title: z.string(),
  }),
  z.object({
    // omitted: id: z.string().uuid(),
    slug: z.string().regex(/^[a-z0-9-_]*$/),
  }),
  z.object({
    // omitted: id: z.string().uuid(),
  }),
  z.object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9-_]*$/),
  }),
  z.object({
    title: z.string(),
  }),
  z.object({
    slug: z.string().regex(/^[a-z0-9-_]*$/),
  }),
])
.and(z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9-_]*$/).optional(),
  AND: z.union([ z.lazy(() => ContentWhereInputSchema),z.lazy(() => ContentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentWhereInputSchema),z.lazy(() => ContentWhereInputSchema).array() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  coverImage: z.union([ z.lazy(() => StringFilterSchema),z.string().url() ]).optional(),
  tags: z.union([ z.lazy(() => StringFilterSchema),TagSchema ]).optional(),
  meta: z.union([ z.lazy(() => StringFilterSchema),MetaSchema ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),StatusEnum.default("PENDING") ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  // omitted: modified: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  // omitted: created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  author: z.union([ z.lazy(() => UserRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryRelationFilterSchema),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
}).strict());

export const ContentOrderByWithAggregationInputSchema: z.ZodType<Prisma.ContentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  coverImage: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  meta: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ContentCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ContentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ContentMinOrderByAggregateInputSchema).optional()
}).strict();

export const ContentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ContentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ContentScalarWhereWithAggregatesInputSchema),z.lazy(() => ContentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentScalarWhereWithAggregatesInputSchema),z.lazy(() => ContentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  coverImage: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tags: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  meta: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  modified: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  emailAddress: z.string(),
  contents: z.lazy(() => ContentCreateNestedManyWithoutAuthorInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string(),
  name: z.string(),
  emailAddress: z.string(),
  contents: z.lazy(() => ContentUncheckedCreateNestedManyWithoutAuthorInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contents: z.lazy(() => ContentUpdateManyWithoutAuthorNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  contents: z.lazy(() => ContentUncheckedUpdateManyWithoutAuthorNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string(),
  name: z.string(),
  emailAddress: z.string()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Omit<Prisma.CategoryCreateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  status: StatusEnum,
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional(),
  contents: z.lazy(() => ContentCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Omit<Prisma.CategoryUncheckedCreateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  status: StatusEnum,
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional(),
  contents: z.lazy(() => ContentUncheckedCreateNestedManyWithoutCategoryInputSchema).optional()
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Omit<Prisma.CategoryUpdateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contents: z.lazy(() => ContentUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Omit<Prisma.CategoryUncheckedUpdateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  contents: z.lazy(() => ContentUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional()
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Omit<Prisma.CategoryCreateManyInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  status: StatusEnum,
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Omit<Prisma.CategoryUpdateManyMutationInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Omit<Prisma.CategoryUncheckedUpdateManyInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentCreateInputSchema: z.ZodType<Omit<Prisma.ContentCreateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  status: StatusEnum.default("PENDING"),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional(),
  author: z.lazy(() => UserCreateNestedOneWithoutContentsInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutContentsInputSchema)
}).strict();

export const ContentUncheckedCreateInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedCreateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  categoryId: z.string(),
  status: StatusEnum.default("PENDING"),
  userId: z.string(),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const ContentUpdateInputSchema: z.ZodType<Omit<Prisma.ContentUpdateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.lazy(() => UserUpdateOneRequiredWithoutContentsNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutContentsNestedInputSchema).optional()
}).strict();

export const ContentUncheckedUpdateInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedUpdateInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentCreateManyInputSchema: z.ZodType<Omit<Prisma.ContentCreateManyInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  categoryId: z.string(),
  status: StatusEnum.default("PENDING"),
  userId: z.string(),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const ContentUpdateManyMutationInputSchema: z.ZodType<Omit<Prisma.ContentUpdateManyMutationInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentUncheckedUpdateManyInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedUpdateManyInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const ContentListRelationFilterSchema: z.ZodType<Prisma.ContentListRelationFilter> = z.object({
  every: z.lazy(() => ContentWhereInputSchema).optional(),
  some: z.lazy(() => ContentWhereInputSchema).optional(),
  none: z.lazy(() => ContentWhereInputSchema).optional()
}).strict();

export const ContentOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ContentOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  emailAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  emailAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  emailAddress: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserRelationFilterSchema: z.ZodType<Prisma.UserRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const CategoryRelationFilterSchema: z.ZodType<Prisma.CategoryRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const ContentCountOrderByAggregateInputSchema: z.ZodType<Prisma.ContentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  coverImage: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  meta: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ContentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  coverImage: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  meta: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContentMinOrderByAggregateInputSchema: z.ZodType<Prisma.ContentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  coverImage: z.lazy(() => SortOrderSchema).optional(),
  tags: z.lazy(() => SortOrderSchema).optional(),
  meta: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  modified: z.lazy(() => SortOrderSchema).optional(),
  created: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ContentCreateNestedManyWithoutAuthorInputSchema: z.ZodType<Prisma.ContentCreateNestedManyWithoutAuthorInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutAuthorInputSchema),z.lazy(() => ContentCreateWithoutAuthorInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyAuthorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContentUncheckedCreateNestedManyWithoutAuthorInputSchema: z.ZodType<Prisma.ContentUncheckedCreateNestedManyWithoutAuthorInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutAuthorInputSchema),z.lazy(() => ContentCreateWithoutAuthorInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyAuthorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const ContentUpdateManyWithoutAuthorNestedInputSchema: z.ZodType<Prisma.ContentUpdateManyWithoutAuthorNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutAuthorInputSchema),z.lazy(() => ContentCreateWithoutAuthorInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContentUpsertWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => ContentUpsertWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyAuthorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContentUpdateWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => ContentUpdateWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContentUpdateManyWithWhereWithoutAuthorInputSchema),z.lazy(() => ContentUpdateManyWithWhereWithoutAuthorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContentScalarWhereInputSchema),z.lazy(() => ContentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContentUncheckedUpdateManyWithoutAuthorNestedInputSchema: z.ZodType<Prisma.ContentUncheckedUpdateManyWithoutAuthorNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutAuthorInputSchema),z.lazy(() => ContentCreateWithoutAuthorInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema),z.lazy(() => ContentCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContentUpsertWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => ContentUpsertWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyAuthorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContentUpdateWithWhereUniqueWithoutAuthorInputSchema),z.lazy(() => ContentUpdateWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContentUpdateManyWithWhereWithoutAuthorInputSchema),z.lazy(() => ContentUpdateManyWithWhereWithoutAuthorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContentScalarWhereInputSchema),z.lazy(() => ContentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContentCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ContentCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutCategoryInputSchema),z.lazy(() => ContentCreateWithoutCategoryInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ContentUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ContentUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutCategoryInputSchema),z.lazy(() => ContentCreateWithoutCategoryInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const ContentUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ContentUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutCategoryInputSchema),z.lazy(() => ContentCreateWithoutCategoryInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContentUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ContentUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContentUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ContentUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContentUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ContentUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContentScalarWhereInputSchema),z.lazy(() => ContentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ContentUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ContentUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ContentCreateWithoutCategoryInputSchema),z.lazy(() => ContentCreateWithoutCategoryInputSchema).array(),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema),z.lazy(() => ContentCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ContentUpsertWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ContentUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ContentCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ContentWhereUniqueInputSchema),z.lazy(() => ContentWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ContentUpdateWithWhereUniqueWithoutCategoryInputSchema),z.lazy(() => ContentUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ContentUpdateManyWithWhereWithoutCategoryInputSchema),z.lazy(() => ContentUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ContentScalarWhereInputSchema),z.lazy(() => ContentScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutContentsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutContentsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContentsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const CategoryCreateNestedOneWithoutContentsInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutContentsInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutContentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutContentsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional()
}).strict();

export const UserUpdateOneRequiredWithoutContentsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutContentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutContentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutContentsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutContentsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutContentsInputSchema),z.lazy(() => UserUpdateWithoutContentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContentsInputSchema) ]).optional(),
}).strict();

export const CategoryUpdateOneRequiredWithoutContentsNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutContentsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutContentsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutContentsInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutContentsInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutContentsInputSchema),z.lazy(() => CategoryUpdateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutContentsInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const ContentCreateWithoutAuthorInputSchema: z.ZodType<Omit<Prisma.ContentCreateWithoutAuthorInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  status: StatusEnum.default("PENDING"),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutContentsInputSchema)
}).strict();

export const ContentUncheckedCreateWithoutAuthorInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedCreateWithoutAuthorInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  categoryId: z.string(),
  status: StatusEnum.default("PENDING"),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const ContentCreateOrConnectWithoutAuthorInputSchema: z.ZodType<Prisma.ContentCreateOrConnectWithoutAuthorInput> = z.object({
  where: z.lazy(() => ContentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContentCreateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema) ]),
}).strict();

export const ContentCreateManyAuthorInputEnvelopeSchema: z.ZodType<Prisma.ContentCreateManyAuthorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContentCreateManyAuthorInputSchema),z.lazy(() => ContentCreateManyAuthorInputSchema).array() ]),
}).strict();

export const ContentUpsertWithWhereUniqueWithoutAuthorInputSchema: z.ZodType<Prisma.ContentUpsertWithWhereUniqueWithoutAuthorInput> = z.object({
  where: z.lazy(() => ContentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContentUpdateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedUpdateWithoutAuthorInputSchema) ]),
  create: z.union([ z.lazy(() => ContentCreateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedCreateWithoutAuthorInputSchema) ]),
}).strict();

export const ContentUpdateWithWhereUniqueWithoutAuthorInputSchema: z.ZodType<Prisma.ContentUpdateWithWhereUniqueWithoutAuthorInput> = z.object({
  where: z.lazy(() => ContentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContentUpdateWithoutAuthorInputSchema),z.lazy(() => ContentUncheckedUpdateWithoutAuthorInputSchema) ]),
}).strict();

export const ContentUpdateManyWithWhereWithoutAuthorInputSchema: z.ZodType<Prisma.ContentUpdateManyWithWhereWithoutAuthorInput> = z.object({
  where: z.lazy(() => ContentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContentUpdateManyMutationInputSchema),z.lazy(() => ContentUncheckedUpdateManyWithoutAuthorInputSchema) ]),
}).strict();

export const ContentScalarWhereInputSchema: z.ZodType<Prisma.ContentScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ContentScalarWhereInputSchema),z.lazy(() => ContentScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ContentScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ContentScalarWhereInputSchema),z.lazy(() => ContentScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  coverImage: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tags: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  meta: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  modified: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  created: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ContentCreateWithoutCategoryInputSchema: z.ZodType<Omit<Prisma.ContentCreateWithoutCategoryInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  status: StatusEnum.default("PENDING"),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional(),
  author: z.lazy(() => UserCreateNestedOneWithoutContentsInputSchema)
}).strict();

export const ContentUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedCreateWithoutCategoryInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  status: StatusEnum.default("PENDING"),
  userId: z.string(),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const ContentCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.ContentCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => ContentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ContentCreateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ContentCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.ContentCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ContentCreateManyCategoryInputSchema),z.lazy(() => ContentCreateManyCategoryInputSchema).array() ]),
}).strict();

export const ContentUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ContentUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ContentWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ContentUpdateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => ContentCreateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ContentUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ContentUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ContentWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ContentUpdateWithoutCategoryInputSchema),z.lazy(() => ContentUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const ContentUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.ContentUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => ContentScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ContentUpdateManyMutationInputSchema),z.lazy(() => ContentUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const UserCreateWithoutContentsInputSchema: z.ZodType<Prisma.UserCreateWithoutContentsInput> = z.object({
  id: z.string(),
  name: z.string(),
  emailAddress: z.string()
}).strict();

export const UserUncheckedCreateWithoutContentsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutContentsInput> = z.object({
  id: z.string(),
  name: z.string(),
  emailAddress: z.string()
}).strict();

export const UserCreateOrConnectWithoutContentsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutContentsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutContentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContentsInputSchema) ]),
}).strict();

export const CategoryCreateWithoutContentsInputSchema: z.ZodType<Omit<Prisma.CategoryCreateWithoutContentsInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  status: StatusEnum,
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const CategoryUncheckedCreateWithoutContentsInputSchema: z.ZodType<Omit<Prisma.CategoryUncheckedCreateWithoutContentsInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  name: z.string(),
  description: z.string(),
  status: StatusEnum,
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const CategoryCreateOrConnectWithoutContentsInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutContentsInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutContentsInputSchema) ]),
}).strict();

export const UserUpsertWithoutContentsInputSchema: z.ZodType<Prisma.UserUpsertWithoutContentsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutContentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContentsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutContentsInputSchema),z.lazy(() => UserUncheckedCreateWithoutContentsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutContentsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutContentsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutContentsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutContentsInputSchema) ]),
}).strict();

export const UserUpdateWithoutContentsInputSchema: z.ZodType<Prisma.UserUpdateWithoutContentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateWithoutContentsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutContentsInput> = z.object({
  id: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  emailAddress: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUpsertWithoutContentsInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutContentsInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutContentsInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedCreateWithoutContentsInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional()
}).strict();

export const CategoryUpdateToOneWithWhereWithoutContentsInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutContentsInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutContentsInputSchema),z.lazy(() => CategoryUncheckedUpdateWithoutContentsInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutContentsInputSchema: z.ZodType<Omit<Prisma.CategoryUpdateWithoutContentsInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateWithoutContentsInputSchema: z.ZodType<Omit<Prisma.CategoryUncheckedUpdateWithoutContentsInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentCreateManyAuthorInputSchema: z.ZodType<Omit<Prisma.ContentCreateManyAuthorInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  categoryId: z.string(),
  status: StatusEnum.default("PENDING"),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const ContentUpdateWithoutAuthorInputSchema: z.ZodType<Omit<Prisma.ContentUpdateWithoutAuthorInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutContentsNestedInputSchema).optional()
}).strict();

export const ContentUncheckedUpdateWithoutAuthorInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedUpdateWithoutAuthorInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentUncheckedUpdateManyWithoutAuthorInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedUpdateManyWithoutAuthorInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentCreateManyCategoryInputSchema: z.ZodType<Omit<Prisma.ContentCreateManyCategoryInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.string().uuid().optional(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-_]*$/),
  content: z.string(),
  coverImage: z.string().url(),
  tags: TagSchema,
  meta: MetaSchema,
  status: StatusEnum.default("PENDING"),
  userId: z.string(),
  // omitted: modified: z.coerce.date().optional(),
  // omitted: created: z.coerce.date().optional()
}).strict();

export const ContentUpdateWithoutCategoryInputSchema: z.ZodType<Omit<Prisma.ContentUpdateWithoutCategoryInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.lazy(() => UserUpdateOneRequiredWithoutContentsNestedInputSchema).optional()
}).strict();

export const ContentUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedUpdateWithoutCategoryInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ContentUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Omit<Prisma.ContentUncheckedUpdateManyWithoutCategoryInput, "id" | "modified" | "created">> = z.object({
  // omitted: id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string().regex(/^[a-z0-9-_]*$/),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  coverImage: z.union([ z.string().url(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tags: z.union([ TagSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  meta: z.union([ MetaSchema,z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ StatusEnum.default("PENDING"),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: modified: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  // omitted: created: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema,CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(),CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(),CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(),
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const ContentFindFirstArgsSchema: z.ZodType<Prisma.ContentFindFirstArgs> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereInputSchema.optional(),
  orderBy: z.union([ ContentOrderByWithRelationInputSchema.array(),ContentOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContentScalarFieldEnumSchema,ContentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ContentFindFirstOrThrowArgs> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereInputSchema.optional(),
  orderBy: z.union([ ContentOrderByWithRelationInputSchema.array(),ContentOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContentScalarFieldEnumSchema,ContentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContentFindManyArgsSchema: z.ZodType<Prisma.ContentFindManyArgs> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereInputSchema.optional(),
  orderBy: z.union([ ContentOrderByWithRelationInputSchema.array(),ContentOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ContentScalarFieldEnumSchema,ContentScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ContentAggregateArgsSchema: z.ZodType<Prisma.ContentAggregateArgs> = z.object({
  where: ContentWhereInputSchema.optional(),
  orderBy: z.union([ ContentOrderByWithRelationInputSchema.array(),ContentOrderByWithRelationInputSchema ]).optional(),
  cursor: ContentWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContentGroupByArgsSchema: z.ZodType<Prisma.ContentGroupByArgs> = z.object({
  where: ContentWhereInputSchema.optional(),
  orderBy: z.union([ ContentOrderByWithAggregationInputSchema.array(),ContentOrderByWithAggregationInputSchema ]).optional(),
  by: ContentScalarFieldEnumSchema.array(),
  having: ContentScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ContentFindUniqueArgsSchema: z.ZodType<Prisma.ContentFindUniqueArgs> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereUniqueInputSchema,
}).strict() ;

export const ContentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ContentFindUniqueOrThrowArgs> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
}).strict() ;

export const CategoryCreateArgsSchema: z.ZodType<Omit<Prisma.CategoryCreateArgs, "data"> & { data: z.infer<typeof CategoryCreateInputSchema> | z.infer<typeof CategoryUncheckedCreateInputSchema> }> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
}).strict() ;

export const CategoryUpsertArgsSchema: z.ZodType<Omit<Prisma.CategoryUpsertArgs, "create" | "update"> & { create: z.infer<typeof CategoryCreateInputSchema> | z.infer<typeof CategoryUncheckedCreateInputSchema>, update: z.infer<typeof CategoryUpdateInputSchema> | z.infer<typeof CategoryUncheckedUpdateInputSchema> }> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
  create: z.union([ CategoryCreateInputSchema,CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
}).strict() ;

export const CategoryCreateManyArgsSchema: z.ZodType<Omit<Prisma.CategoryCreateManyArgs, "data"> & { data: z.infer<typeof CategoryCreateManyInputSchema> | z.infer<typeof CategoryCreateManyInputSchema>[] }> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
}).strict() ;

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Omit<Prisma.CategoryCreateManyAndReturnArgs, "data"> & { data: z.infer<typeof CategoryCreateManyInputSchema> | z.infer<typeof CategoryCreateManyInputSchema>[] }> = z.object({
  data: z.union([ CategoryCreateManyInputSchema,CategoryCreateManyInputSchema.array() ]),
}).strict() ;

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateArgsSchema: z.ZodType<Omit<Prisma.CategoryUpdateArgs, "data"> & { data: z.infer<typeof CategoryUpdateInputSchema> | z.infer<typeof CategoryUncheckedUpdateInputSchema> }> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema,CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema,
}).strict() ;

export const CategoryUpdateManyArgsSchema: z.ZodType<Omit<Prisma.CategoryUpdateManyArgs, "data"> & { data: z.infer<typeof CategoryUpdateManyMutationInputSchema> | z.infer<typeof CategoryUncheckedUpdateManyInputSchema> }> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema,CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(),
}).strict() ;

export const ContentCreateArgsSchema: z.ZodType<Omit<Prisma.ContentCreateArgs, "data"> & { data: z.infer<typeof ContentCreateInputSchema> | z.infer<typeof ContentUncheckedCreateInputSchema> }> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  data: z.union([ ContentCreateInputSchema,ContentUncheckedCreateInputSchema ]),
}).strict() ;

export const ContentUpsertArgsSchema: z.ZodType<Omit<Prisma.ContentUpsertArgs, "create" | "update"> & { create: z.infer<typeof ContentCreateInputSchema> | z.infer<typeof ContentUncheckedCreateInputSchema>, update: z.infer<typeof ContentUpdateInputSchema> | z.infer<typeof ContentUncheckedUpdateInputSchema> }> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereUniqueInputSchema,
  create: z.union([ ContentCreateInputSchema,ContentUncheckedCreateInputSchema ]),
  update: z.union([ ContentUpdateInputSchema,ContentUncheckedUpdateInputSchema ]),
}).strict() ;

export const ContentCreateManyArgsSchema: z.ZodType<Omit<Prisma.ContentCreateManyArgs, "data"> & { data: z.infer<typeof ContentCreateManyInputSchema> | z.infer<typeof ContentCreateManyInputSchema>[] }> = z.object({
  data: z.union([ ContentCreateManyInputSchema,ContentCreateManyInputSchema.array() ]),
}).strict() ;

export const ContentCreateManyAndReturnArgsSchema: z.ZodType<Omit<Prisma.ContentCreateManyAndReturnArgs, "data"> & { data: z.infer<typeof ContentCreateManyInputSchema> | z.infer<typeof ContentCreateManyInputSchema>[] }> = z.object({
  data: z.union([ ContentCreateManyInputSchema,ContentCreateManyInputSchema.array() ]),
}).strict() ;

export const ContentDeleteArgsSchema: z.ZodType<Prisma.ContentDeleteArgs> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  where: ContentWhereUniqueInputSchema,
}).strict() ;

export const ContentUpdateArgsSchema: z.ZodType<Omit<Prisma.ContentUpdateArgs, "data"> & { data: z.infer<typeof ContentUpdateInputSchema> | z.infer<typeof ContentUncheckedUpdateInputSchema> }> = z.object({
  select: ContentSelectSchema.optional(),
  include: ContentIncludeSchema.optional(),
  data: z.union([ ContentUpdateInputSchema,ContentUncheckedUpdateInputSchema ]),
  where: ContentWhereUniqueInputSchema,
}).strict() ;

export const ContentUpdateManyArgsSchema: z.ZodType<Omit<Prisma.ContentUpdateManyArgs, "data"> & { data: z.infer<typeof ContentUpdateManyMutationInputSchema> | z.infer<typeof ContentUncheckedUpdateManyInputSchema> }> = z.object({
  data: z.union([ ContentUpdateManyMutationInputSchema,ContentUncheckedUpdateManyInputSchema ]),
  where: ContentWhereInputSchema.optional(),
}).strict() ;

export const ContentDeleteManyArgsSchema: z.ZodType<Prisma.ContentDeleteManyArgs> = z.object({
  where: ContentWhereInputSchema.optional(),
}).strict() ;