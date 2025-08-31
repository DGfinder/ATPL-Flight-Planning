import { createClient } from '@supabase/supabase-js';
import { sampleQuestions } from '../data/questions.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Script to populate Supabase with initial questions
export async function populateQuestions() {
  console.log('Starting question population...');
  
  try {
    // Transform questions to match database schema
    const dbQuestions = sampleQuestions.map(question => ({
      id: question.id,
      title: question.title,
      description: question.description,
      type: question.type,
      category: question.category,
      marks: question.marks,
      reference: question.reference,
      given_data: question.givenData,
      options: question.options || null,
      correct_answer: question.correctAnswer || null,
      expected_answers: question.expectedAnswers || null,
      working_steps: question.workingSteps,
      created_by: null // Will be set by RLS policies
    }));

    console.log(`Preparing to insert ${dbQuestions.length} questions...`);

    // Insert questions in batches
    const batchSize = 5;
    for (let i = 0; i < dbQuestions.length; i += batchSize) {
      const batch = dbQuestions.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('questions')
        .upsert(batch, { onConflict: 'id' });
        
      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }
      
      console.log(`Inserted batch ${i / batchSize + 1}/${Math.ceil(dbQuestions.length / batchSize)}`);
    }

    console.log(`Successfully populated ${dbQuestions.length} questions!`);
    return dbQuestions.length;

  } catch (error) {
    console.error('Failed to populate questions:', error);
    throw error;
  }
}

// Function to verify questions in database
export async function verifyQuestions() {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('id, title, category')
      .order('id');

    if (error) throw error;

    console.log('Questions in database:');
    data.forEach(q => {
      console.log(`- ${q.id}: ${q.title} (${q.category})`);
    });

    return data;
  } catch (error) {
    console.error('Failed to verify questions:', error);
    throw error;
  }
}

// Run immediately
populateQuestions()
  .then(() => verifyQuestions())
  .then(() => {
    console.log('✅ Question population completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Population failed:', error);
    process.exit(1);
  });