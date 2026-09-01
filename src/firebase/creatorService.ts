import {
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';

export interface CreatorProfileData {
  avatarBase64: string | null;
  name: string;
  role: string;
  updatedAt?: string;
}

const SETTINGS_COLLECTION = 'settings';
const CREATOR_DOC_ID = 'creator_profile';

/**
 * Realtime listener for Creator Profile stored in Cloud Firestore
 * Allows all connected devices/browsers to see the updated profile photo
 */
export function subscribeCreatorProfile(
  onData: (data: CreatorProfileData) => void,
  onError: (error: Error) => void
): Unsubscribe {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, CREATOR_DOC_ID);
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          onData({
            avatarBase64: data.avatarBase64 || null,
            name: data.name || 'นายมาโนช บุญเพ็ง',
            role: data.role || 'ผู้จัดทำระบบ',
            updatedAt: data.updatedAt,
          });
        } else {
          onData({
            avatarBase64: null,
            name: 'นายมาโนช บุญเพ็ง',
            role: 'ผู้จัดทำระบบ',
          });
        }
      },
      (error) => {
        console.error('Error fetching creator profile realtime:', error);
        onError(error);
      }
    );
  } catch (err: any) {
    console.error('Failed to establish creator profile subscription:', err);
    onError(err);
    return () => {};
  }
}

/**
 * Save / Update Creator Avatar Base64 in Cloud Firestore
 */
export async function saveCreatorAvatar(avatarBase64: string): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, CREATOR_DOC_ID);
  await setDoc(
    docRef,
    {
      avatarBase64,
      name: 'นายมาโนช บุญเพ็ง',
      role: 'ผู้จัดทำระบบ',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Reset Creator Avatar in Cloud Firestore
 */
export async function resetCreatorAvatar(): Promise<void> {
  const docRef = doc(db, SETTINGS_COLLECTION, CREATOR_DOC_ID);
  await setDoc(
    docRef,
    {
      avatarBase64: null,
      name: 'นายมาโนช บุญเพ็ง',
      role: 'ผู้จัดทำระบบ',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );
}

/**
 * Helper to compress and resize image before uploading to Firestore
 * Keeps Firestore document size well under 100KB with crystal clear quality
 */
export function compressImageFile(
  file: File,
  maxWidth = 480,
  maxHeight = 640,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio bounds
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to standard JPEG base64 (or WebP if supported)
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
