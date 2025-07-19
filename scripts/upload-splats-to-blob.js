#!/usr/bin/env node
/**
 * Upload splat files to Vercel Blob storage
 * This script uploads large splat files to Vercel Blob for global CDN delivery
 * 
 * Usage: node scripts/upload-splats-to-blob.js
 * 
 * Prerequisites:
 * - BLOB_READ_WRITE_TOKEN environment variable set
 * - Vercel Blob store created in your account
 */

import { put } from '@vercel/blob';
import { readFileSync } from 'fs';
import { join, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration
const SPLAT_FILES = [
  'public/assets/experience/fixed_model.splat',   // Only remaining file
];

const BLOB_FOLDER = 'experience'; // Organize files in blob store

async function uploadSplatFiles() {
  console.log('🚀 Starting Vercel Blob upload for splat files...');
  
  // Check for required environment variable
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is required');
    console.error('   Get this from: https://vercel.com/dashboard > Storage > Blob > Settings');
    process.exit(1);
  }

  const uploadResults = [];

  for (const filePath of SPLAT_FILES) {
    try {
      console.log(`\n📂 Processing: ${filePath}`);
      
      const fullPath = join(__dirname, '..', filePath);
      const fileName = basename(filePath);
      const blobPath = `${BLOB_FOLDER}/${fileName}`;
      
      // Read file
      console.log('📖 Reading file...');
      const fileBuffer = readFileSync(fullPath);
      const fileSizeMB = (fileBuffer.length / 1024 / 1024).toFixed(2);
      console.log(`📊 File size: ${fileSizeMB}MB`);
      
      // Upload to Vercel Blob
      console.log('☁️ Uploading to Vercel Blob...');
      const blob = await put(blobPath, fileBuffer, {
        access: 'public',
        addRandomSuffix: false, // Keep consistent URLs
        multipart: fileBuffer.length > 100 * 1024 * 1024, // Use multipart for files > 100MB
        cacheControlMaxAge: 60 * 60 * 24 * 30, // Cache for 30 days
      });
      
      console.log('✅ Upload successful!');
      console.log(`   📍 Blob URL: ${blob.url}`);
      console.log(`   🔗 Download URL: ${blob.downloadUrl}`);
      
      uploadResults.push({
        originalPath: filePath,
        fileName,
        blobPath,
        url: blob.url,
        downloadUrl: blob.downloadUrl,
        sizeMB: fileSizeMB
      });
      
    } catch (error) {
      console.error(`❌ Failed to upload ${filePath}:`, error.message);
      if (error.message.includes('BLOB_READ_WRITE_TOKEN')) {
        console.error('   💡 Make sure your BLOB_READ_WRITE_TOKEN is correct');
        process.exit(1);
      }
    }
  }
  
  // Generate summary
  console.log('\n🎉 Upload Summary:');
  console.log('==================');
  
  uploadResults.forEach(result => {
    console.log(`📁 ${result.fileName} (${result.sizeMB}MB)`);
    console.log(`   🌐 ${result.url}`);
  });
  
  // Generate code snippet for App.jsx
  if (uploadResults.length > 0) {
    const primarySplat = uploadResults.find(r => r.fileName === 'fixed_model.splat');
    if (primarySplat) {
      console.log('\n📝 Code Update for App.jsx:');
      console.log('===========================');
      console.log(`const splatUrl = '${primarySplat.url}'; // Vercel Blob URL`);
      console.log('\n🔄 Update your App.jsx with this URL to use Vercel Blob storage!');
    }
  }
  
  console.log('\n✨ All uploads completed successfully!');
  console.log('💡 Your splat files are now served from Vercel Blob global CDN');
}

// Run the upload
uploadSplatFiles().catch(error => {
  console.error('💥 Upload failed:', error);
  process.exit(1);
});
