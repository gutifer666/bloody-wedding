# 🎯 Code Style

## 💡 Convention

TypeScript strict mode is enabled along with decorator support (`experimentalDecorators` + `emitDecoratorMetadata`).

Key rules enforced:

- Every function must declare its return type.
- TypeScript `strict: true` in `tsconfig.json`.

## 🏆 Benefits

- Explicit return types make function contracts clear and catch unintended type changes at compile time.
- Strict mode eliminates entire categories of runtime bugs (null/undefined, implicit any).
- A shared preset ensures all team members and AI agents produce a consistent code style.

## 👀 Examples

### ✅ Good: Function with explicit return type

```typescript
async searchAll(): Promise<CookedDishPrimitives[]> {
	const dishes = await this.repository.searchAll();

	return dishes.map((dish) => dish.toPrimitives());
}
```

### ❌ Bad: Function without return type

```typescript
async searchAll() {
	const dishes = await this.repository.searchAll();

	return dishes.map((dish) => dish.toPrimitives());
}
```

## 🧐 Real world examples

- TypeScript config: `tsconfig.json`

## 🔗 Related agreements

