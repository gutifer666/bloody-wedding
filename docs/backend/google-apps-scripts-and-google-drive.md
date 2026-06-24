# 🎯 Google Apps Script and Google Drive Integration

## 💡 Convention

We use Google Apps Script (GAS) as a serverless backend proxy to interact with Google Drive. The frontend communicates with a deployed GAS Web App URL via HTTP POST requests.

Because GAS Web Apps often have CORS limitations when returning custom headers or detailed bodies to browser-based requests, we use `mode: 'no-cors'` in our fetch calls when detailed response inspection is not critical, or we handle the opaque response accordingly.

The GAS script is responsible for:
1. Receiving the Base64 encoded image data.
2. Parsing the data and metadata.
3. Saving the file into a specific Google Drive folder.
4. Returning a success or failure indication.

## 🏆 Benefits

- **Cost-Effective**: Leveraging Google's free tier for small-scale projects.
- **Serverless**: No need to maintain a dedicated backend server or handle complex authentication flows (like OAuth2) directly in the frontend.
- **Integration**: Native and seamless integration with Google Drive storage.
- **Simplicity**: GAS provides a straightforward environment for simple CRUD or storage operations.

## 👀 Examples

### ✅ Good: Using the Storage Adapter with GAS URL

The adapter encapsulates the fetch logic and the GAS endpoint.

```typescript
// src/infrastructure/GoogleDriveStorageAdapter.ts
async uploadPhoto(photo: Photo): Promise<UploadResult> {
  const response = await fetch(this.apiUrl, {
    method: 'POST',
    mode: 'no-cors', // Necessary for GAS Web App calls from browser
    body: JSON.stringify(photo),
  });
  
  // With 'no-cors', we assume success if no exception is thrown
  return { status: 'success' };
}
```

### ❌ Bad: Hardcoding the logic inside the Component

Avoid mixing infrastructure details (like GAS URLs or fetch modes) with UI logic.

```typescript
// src/components/UploadButton.tsx
const handleUpload = async (file) => {
  // ❌ Infrastructure detail leaked into component
  await fetch("https://script.google.com/macros/s/.../exec", {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify(file)
  });
};
```

## 🧐 Real world examples

- [GoogleDriveStorageAdapter.ts](../../src/infrastructure/GoogleDriveStorageAdapter.ts): Implements the connection to the GAS Web App.

## 🔗 Related agreements

- [Hexagonal Architecture](../frontend/hexagonal-architecture.md): The adapter follows the Port/Adapter pattern to decouple the domain from Google services.
