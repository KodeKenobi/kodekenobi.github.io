import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual project URL and SERVICE ROLE KEY
const SUPABASE_URL = 'https://pqdxqvxyrahvongbhtdb.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxZHhxdnh5cmFodm9uZ2JodGRiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM2NDMzNSwiZXhwIjoyMDc4OTQwMzM1fQ.J3llz0XpOVsw9mZPwuhsYRXeDeEg1gFIGPTQsSxKDJA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function emptyAllBuckets() {
    const { data: buckets, error } = await supabase.storage.listBuckets();

    if (error) {
        console.error("Error fetching buckets:", error);
        return;
    }

    for (const bucket of buckets) {
        console.log(`Emptying bucket: ${bucket.name}...`);
        const { error: emptyError } = await supabase.storage.emptyBucket(bucket.name);

        if (emptyError) {
            console.error(`Failed to empty ${bucket.name}:`, emptyError);
        } else {
            console.log(`Successfully emptied ${bucket.name}`);
        }
    }

    console.log("Finished processing all buckets.");
}

emptyAllBuckets();