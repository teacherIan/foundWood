# Vercel Blob Setup for Found Wood Splat Files

## Quick Setup

1. **Create a Vercel Blob Store**

   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Navigate to Storage → Create Database → Blob
   - Choose a name like "foundwood-assets"
   - Select region closest to your users

2. **Get Your Blob Token**

   - In your new blob store, go to Settings
   - Copy the BLOB_READ_WRITE_TOKEN

3. **Set Environment Variable**

   ```bash
   export BLOB_READ_WRITE_TOKEN="your_token_here"
   ```

4. **Upload Your Splat Files**

   ```bash
   npm run upload-splats
   ```

5. **Update Your App**
   - The script will provide the new Blob URL
   - Replace the splat URL in App.jsx with the Blob URL

## Benefits

✅ **Solves Vercel 38MB static file limit**
✅ **Global CDN delivery** - faster loading worldwide
✅ **Reliable uploads** - multipart upload for large files
✅ **Cost efficient** - 3x cheaper than Fast Data Transfer
✅ **No more 404 errors** - guaranteed file availability

## File Locations

After upload, your files will be available at:

- `https://[blob-id].public.blob.vercel-storage.com/experience/new_fixed_PLY.splat`
- `https://[blob-id].public.blob.vercel-storage.com/experience/fixed_model.splat`
- `https://[blob-id].public.blob.vercel-storage.com/experience/full_dontuse.splat`

The upload script will provide the exact URLs.
