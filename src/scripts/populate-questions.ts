import { supabase } from '../lib/supabase';
import { sampleQuestions } from '../data/questions';

// Script to populate Supabase with initial questions
export async function populateQuestions() {
  console.log('Starting question population...');
  
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('User must be authenticated to populate questions');
      return;
    }

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
      created_by: user.id
    }));

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

// Run this script when imported
if (typeof window !== 'undefined') {
  (window as typeof window & { populateQuestions: typeof populateQuestions; verifyQuestions: typeof verifyQuestions }).populateQuestions = populateQuestions;
  (window as typeof window & { populateQuestions: typeof populateQuestions; verifyQuestions: typeof verifyQuestions }).verifyQuestions = verifyQuestions;
  console.log('Question population functions available:');
  console.log('- Run populateQuestions() to add questions to Supabase');
  console.log('- Run verifyQuestions() to check current questions');
}