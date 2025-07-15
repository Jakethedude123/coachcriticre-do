const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase config - using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define the correct option names
const CORRECT_OPTIONS = {
  specialties: [
    'rehab', 'injury recovery', 'nutrition', 'posing', 'contest prep', 'lifestyle',
    'raw', 'equipped', 'Form Correction', 'Posing Coaching', 'Female PED Use',
    'ED Recovery', 'Labwork Interpretation', 'Meet Day Handling', 'RPE-Based Training',
    'Cutting Weight', 'Technical Feedback (SBD)', 'Conjugate Method'
  ],
  credentials: [
    'CSCS', 'NASM', 'ISSA', 'NCSF', 'ACE', 'MS', 'BS', 'J3U', 'VizualFX', 'N1', 'HCU'
  ],
  divisions: [
    'Mens Physique', 'Mens Classic Physique', 'Mens Bodybuilding', "Women's Bodybuilding",
    "Women's Physique", 'Figure', 'Wellness', 'Bikini',
    'Sub-Junior', 'Collegiate', 'Amateur', 'Elite', 'Equipped', 'Masters (40+)', 'World-Level'
  ],
  clientTypes: [
    'non-enhanced', 'enhanced',
    'female specific', 'Contest Prep', 'Lifestyle',
    'First time competitor'
  ],
  federations: [
    'IFBB', 'NPC', 'OCB', 'USAPL', 'WRPF', 'IPF', 'USPS', 'RPS', 'APF', 'SPF', 'GPA'
  ]
};

// Define mappings for old option names to new ones
const OPTION_MAPPINGS = {
  specialties: {
    'experience in female PED use': 'Female PED Use',
    'experienced in female PED use': 'Female PED Use',
    'female PED use': 'Female PED Use',
    'female ped use': 'Female PED Use',
    // Add any other old names you find
  },
  credentials: {
    // Add any credential mappings if needed
  },
  divisions: {
    // Add any division mappings if needed
  },
  clientTypes: {
    // Add any client type mappings if needed
  },
  federations: {
    // Add any federation mappings if needed
  }
};

async function checkAndFixCoachData(shouldFix = false) {
  try {
    console.log(`🔍 ${shouldFix ? 'Checking and fixing' : 'Checking'} coaches with incorrect option names...`);
    
    const coachesRef = collection(db, 'coaches');
    const querySnapshot = await getDocs(coachesRef);
    
    let totalCoaches = 0;
    let coachesWithIssues = 0;
    let coachesFixed = 0;
    
    for (const docSnapshot of querySnapshot.docs) {
      totalCoaches++;
      const coachData = docSnapshot.data();
      const coachId = docSnapshot.id;
      
      console.log(`\n📋 Coach: ${coachData.name || 'Unknown'} (ID: ${coachId})`);
      
      let hasIssues = false;
      let updates = {};
      
      // Check each field for incorrect options
      for (const [fieldName, correctOptions] of Object.entries(CORRECT_OPTIONS)) {
        const currentOptions = coachData[fieldName] || [];
        const mappings = OPTION_MAPPINGS[fieldName] || {};
        
        if (currentOptions.length > 0) {
          console.log(`  ${fieldName}: [${currentOptions.join(', ')}]`);
          
          let hasFieldIssues = false;
          const updatedOptions = currentOptions.map(option => {
            // Check if this option needs to be mapped to a new name
            if (mappings[option.toLowerCase()]) {
              console.log(`    ❌ Found old option: "${option}" -> "${mappings[option.toLowerCase()]}"`);
              hasFieldIssues = true;
              return mappings[option.toLowerCase()];
            }
            
            // Check if this option is not in the correct options list
            if (!correctOptions.includes(option)) {
              console.log(`    ⚠️  Found invalid option: "${option}" (not in correct options list)`);
              hasFieldIssues = true;
              // Remove invalid options
              return null;
            }
            
            return option;
          }).filter(option => option !== null); // Remove null values
          
          if (hasFieldIssues) {
            hasIssues = true;
            updates[fieldName] = updatedOptions;
            console.log(`    ✅ Updated ${fieldName}: [${updatedOptions.join(', ')}]`);
          }
        }
      }
      
      if (hasIssues) {
        coachesWithIssues++;
        
        if (shouldFix) {
          console.log(`  🔧 Fixing coach data...`);
          
          try {
            await updateDoc(doc(db, 'coaches', coachId), updates);
            coachesFixed++;
            console.log(`  ✅ Successfully updated coach data`);
          } catch (error) {
            console.error(`  ❌ Error updating coach ${coachId}:`, error);
          }
        }
      } else {
        console.log(`  ✅ No issues found`);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`  Total coaches checked: ${totalCoaches}`);
    console.log(`  Coaches with issues: ${coachesWithIssues}`);
    if (shouldFix) {
      console.log(`  Coaches successfully fixed: ${coachesFixed}`);
    }
    
    if (coachesWithIssues === 0) {
      console.log(`\n🎉 No data issues found! All coaches have correct option names.`);
    } else if (!shouldFix) {
      console.log(`\n💡 Run the script with --fix to automatically fix these issues.`);
    } else {
      console.log(`\n✅ Data migration completed successfully!`);
    }
    
  } catch (error) {
    console.error('❌ Error checking/fixing coach data:', error);
  }
}

// Main execution
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix') || args.includes('-f');

if (shouldFix) {
  console.log('🚀 Running data migration with fixes...');
  checkAndFixCoachData(true);
} else {
  console.log('🔍 Running data check only (no fixes)...');
  checkAndFixCoachData(false);
} 