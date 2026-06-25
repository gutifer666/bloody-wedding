# 🎯 Mandatory Unit Testing for Every Functionality

## 💡 Convention
For every new feature, improvement, or bug fix requested, a corresponding unit test must be created or updated to validate the expected behavior. A task is not considered complete until there are automated tests verifying the change.

## 🏆 Benefits
- Ensures the new functionality works as specified.
- Prevents regressions when modifying code in the future.
- Documents the expected behavior through executable examples.
- Facilitates continuous integration and deployment confidence.

## 👀 Examples

### ✅ Good: Creating a test when implementing new selection logic
When adding a selection modal for mobile, a test file should be included to simulate interaction and verify DOM state.

```typescript
// tests/MobileSelection.test.ts
it('should show selection modal on mobile', () => {
    // ... setup ...
    handleUploadTrigger();
    expect(elements.selectionModal.classList.contains('active')).toBe(true);
});
```

### ❌ Bad: Implementing functionality without tests
Adding complex logic to `app.ts` or services without creating a corresponding `.test.ts` file.

## 🧐 Real world examples
- [Mobile Selection Logic tests](tests/MobileSelection.test.ts)
- [Photo Upload Service tests](tests/PhotoUploadService.test.ts)

## 🔗 Related agreements
- [Mock Objects convention](docs/testing/mock-objects.md)
