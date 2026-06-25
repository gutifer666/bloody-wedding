# 🎯 Hexagonal Architecture / DDD

## 💡 Convention

The frontend follows Hexagonal Architecture with DDD tactical patterns. Code is organized in three layers:

- **Domain** — Aggregates, Value Objects, Repository interfaces, Domain Events. No framework dependencies.
- **Application** — One use case per class. Orchestrates domain objects. Use DI.
- **Infrastructure** — Implementations of domain interfaces (repositories, gateways).

Directory structure:

```
src/
     domain/          # Aggregates, VOs, interfaces
     application/     # Use cases (one per folder)
        {use-case}/
     infrastructure/  # Repository impls, gateways
```

## 🏆 Benefits

- Domain logic stays framework-agnostic and independently testable.
- Swapping infrastructure (e.g. database, external API) requires no domain or application changes.
- One use case per class keeps application services small, focused, and easy to name.
- Folder structure mirrors the architecture, making navigation predictable.

## 👀 Examples

### ✅ Good: Use case with single responsibility

```typescript
import { Service } from "diod";

import { CookedDishPrimitives } from "../../domain/CookedDish";
import { CookedDishRepository } from "../../domain/CookedDishRepository";

@Service()
export class AllCookedDishesSearcher {
	constructor(private readonly repository: CookedDishRepository) {}

	async searchAll(): Promise<CookedDishPrimitives[]> {
		const dishes = await this.repository.searchAll();

		return dishes.map((dish) => dish.toPrimitives());
	}
}
```

### ❌ Bad: Use case that depends on infrastructure directly

```typescript
import { Service } from "diod";
import { PostgresConnection } from "../../../shared/infrastructure/postgres/PostgresConnection";

@Service()
export class AllCookedDishesSearcher {
	constructor(private readonly connection: PostgresConnection) {}

	async searchAll(): Promise<CookedDishPrimitives[]> {
		const rows = await this.connection.query("SELECT * FROM cooked_dishes");

		return rows;
	}
}
```

## 🧐 Real world examples

- Domain: `src/domain/Photo.ts`
- Application: `src/application/upload-photo/PhotoUploader.ts`
- Infrastructure: `src/infrastructure/GoogleDriveStorageAdapter.ts`


## 🔗 Related agreements

- [Mock Objects for Testing](../testing/mock-objects.md)