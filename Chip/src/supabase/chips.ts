import {SupabaseChipUpload} from '../types/chips';
import {supabase} from './supabase';

// Pushes chip to the database
export async function insertChipInDatabase(chip: SupabaseChipUpload) {
  const {error} = await supabase.from('chips').insert(chip);

  if (error) {
    console.error('[insertChipInDatabase]', error);
  }
}

// Uploads image of chip
export async function uploadChipImageToStorage(
  goalId: string,
  uri: string,
  uid: string,
  fileName: string,
) {
  const photo = {
    uri: uri,
    name: fileName,
  };

  const formData = new FormData();
  formData.append('file', photo);

  // Get the name for the file
  const filePath = `${uid}/${goalId}/${fileName}`;

  let {error: uploadError} = await supabase.storage
    .from('chips')
    .upload(filePath, formData, {
      cacheControl: '3600',
    });

  if (uploadError) {
    console.error(uploadError);
    throw uploadError;
  }
}
