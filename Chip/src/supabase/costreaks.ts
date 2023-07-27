import {supabase} from './supabase';
import {SupabaseCostreakUpload} from '../types/costreaks';

export async function startCostreak(costreakInvite: SupabaseCostreakUpload) {
  try {
    const {error} = await supabase.from('costreaks').insert(costreakInvite);

    if (error) {
      throw Error(error.message);
    }
  } catch (error) {
    console.log(error);
  }
}
