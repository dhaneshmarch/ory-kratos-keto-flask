import { Namespace, Context } from "@ory/keto-namespace-types"

class User implements Namespace {
  related: {
    is: User[]
  }
}

class Shop implements Namespace {
  related: {
    readers: User[]
    creators: User[]
    modifiers: User[]
    deleters: User[]
  }

  permits = {
    read: (ctx: Context): boolean => this.related.readers.includes(ctx.subject),
    create: (ctx: Context): boolean => this.related.creators.includes(ctx.subject),
    modify: (ctx: Context): boolean => this.related.modifiers.includes(ctx.subject),
    delete: (ctx: Context): boolean => this.related.deleters.includes(ctx.subject),
  }
}

class Admin implements Namespace {
  related: {
    superadmins: User[]
    store_managers: User[]
    store_designers: User[]
  }
}

class Inventory implements Namespace {
  related: {
    managers: User[]
  }

  permits = {
    manage: (ctx: Context): boolean =>
      this.related.managers.includes(ctx.subject) ||
      Admin.related.superadmins.includes(ctx.subject) ||
      Admin.related.store_managers.includes(ctx.subject)
  }
}

class StoreDesign implements Namespace {
  related: {
    designers: User[]
  }

  permits = {
    design: (ctx: Context): boolean =>
      this.related.designers.includes(ctx.subject) ||
      Admin.related.superadmins.includes(ctx.subject) ||
      Admin.related.store_managers.includes(ctx.subject) ||
      Admin.related.store_designers.includes(ctx.subject)
  }
}