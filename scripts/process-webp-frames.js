const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const os = require('os');

const SRC_DIR = path.join(__dirname, '../public/burger-frames');
const DEST_DIR = path.join(__dirname, '../public/frames');

// Ensure destination directory exists
if (!fs.existsSync(DEST_DIR)) {
  fs.mkdirSync(DEST_DIR, { recursive: true });
} else {
  // Clear existing frames to prevent mixups
  console.log('Cleaning existing files in public/frames...');
  fs.readdirSync(DEST_DIR).forEach(file => {
    fs.unlinkSync(path.join(DEST_DIR, file));
  });
}

// Get original frames list
const files = fs.readdirSync(SRC_DIR)
  .filter(f => f.startsWith('frame_') && f.endsWith('.png'))
  .sort();

console.log(`Found ${files.length} original frames.`);

// Downsample: Take every 2nd frame starting from frame 6 (index 5)
// This reduces the count from 600 to ~298 frames, which cuts download times & request counts in half
const selectedFiles = [];
for (let i = 5; i < files.length; i += 2) {
  selectedFiles.push(files[i]);
}

console.log(`Downsampled to ${selectedFiles.length} frames for high performance.`);

const concurrencyLimit = os.cpus().length || 4;
console.log(`Processing in parallel with concurrency limit: ${concurrencyLimit}`);

let activeTasks = 0;
let currentIndex = 0;
let completedCount = 0;

function runNext() {
  if (currentIndex >= selectedFiles.length) {
    if (activeTasks === 0) {
      console.log('\nProcessing completed successfully!');
    }
    return;
  }

  const srcFile = selectedFiles[currentIndex];
  const outIndex = completedCount + 1;
  const destFile = `frame_${String(outIndex).padStart(3, '0')}.webp`;
  
  const srcPath = path.join(SRC_DIR, srcFile);
  const destPath = path.join(DEST_DIR, destFile);

  currentIndex++;
  activeTasks++;

  // ffmpeg command to remove color background and encode to high-quality transparent WebP
  // Using verified perfect colorkey parameters: colorkey=0xC6CDD0:0.12:0.05
  // Outputting libwebp at quality level 75 (excellent balance of clarity and size)
  const cmd = `ffmpeg -y -i "${srcPath}" -vf "colorkey=0xC6CDD0:0.12:0.05" -c:v libwebp -q:v 75 "${destPath}"`;

  exec(cmd, (error, stdout, stderr) => {
    activeTasks--;
    completedCount++;

    const percent = Math.floor((completedCount / selectedFiles.length) * 100);
    process.stdout.write(`\rProgress: ${percent}% (${completedCount}/${selectedFiles.length})`);

    if (error) {
      console.error(`\nError processing ${srcFile}:`, error.message);
    }

    runNext();
  });
}

// Bootstrap initial batch
for (let i = 0; i < Math.min(concurrencyLimit, selectedFiles.length); i++) {
  runNext();
}
