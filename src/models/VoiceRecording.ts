
import { supabase } from '@/integrations/supabase/client';

export interface VoiceRecording {
  id: string;
  user_id: string;
  audio_url: string;
  transcription?: string;
  translation?: string;
  source_language: string;
  target_language: string;
  created_at: string;
}

export interface CreateVoiceRecordingParams {
  userId: string;
  audioBlob: Blob;
  sourceLanguage: string;
  targetLanguage: string;
  transcription?: string;
  translation?: string;
}

export const storeVoiceRecording = async (params: CreateVoiceRecordingParams): Promise<VoiceRecording> => {
  try {
    const { userId, audioBlob, sourceLanguage, targetLanguage, transcription, translation } = params;

    // Generate a unique file name with user ID as the folder name
    const fileName = `${userId}/${Date.now()}.webm`;
    const filePath = `voice-recordings/${fileName}`;

    // Upload the audio blob to Supabase storage
    const { data: storageData, error: storageError } = await supabase
      .storage
      .from('recordings')
      .upload(filePath, audioBlob, {
        contentType: 'audio/webm',
        cacheControl: '3600',
      });

    if (storageError) {
      console.error("Error uploading audio:", storageError);
      throw new Error('Failed to upload audio recording');
    }

    // Get the public URL of the uploaded file
    const { data: publicUrlData } = supabase
      .storage
      .from('recordings')
      .getPublicUrl(filePath);

    const audioUrl = publicUrlData.publicUrl;

    // Store the record in the database
    const { data, error } = await supabase
      .from('voice_recordings')
      .insert([
        {
          user_id: userId,
          audio_url: audioUrl,
          source_language: sourceLanguage,
          target_language: targetLanguage,
          transcription,
          translation
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error storing recording metadata:", error);
      throw new Error('Failed to store recording metadata');
    }

    return data as VoiceRecording;
  } catch (error) {
    console.error("Voice recording storage error:", error);
    throw new Error('Failed to store voice recording');
  }
};

export const getVoiceRecordings = async (userId: string): Promise<VoiceRecording[]> => {
  const { data, error } = await supabase
    .from('voice_recordings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching voice recordings:", error);
    throw new Error('Failed to fetch voice recordings');
  }

  return data as VoiceRecording[];
};
