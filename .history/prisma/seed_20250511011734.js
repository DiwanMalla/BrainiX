import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed process for Motion Design with After Effects...");

  // Fetch the Motion Design with After Effects course
  const course = await prisma.course.findUnique({
    where: { slug: "motion-design-after-effects" },
  });

  if (!course) {
    console.error("Course with slug 'motion-design-after-effects' not found.");
    throw new Error("Course not found");
  }

  console.log(`Found course: ${course.title}`);

  let lessonPosition = 1; // Track lesson position across modules
  const modulesData = [
    {
      title: "Introduction to Motion Design and After Effects",
      description:
        "Learn the basics of motion design and After Effects interface.",
      position: 1,
      lessons: [
        {
          title: "What is Motion Design?",
          description: "Explore motion design and its applications.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 420, // 7 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "After Effects Interface",
          description: "Navigate the After Effects workspace.",
          type: "TEXT",
          content: `
# After Effects Interface

1. **Workspace**:
   - Project panel: Manage assets.
   - Composition panel: Preview animations.
   - Timeline: Keyframe animations.

2. **Tools**:
   - Selection, Pen, Text, Shape tools.
   - Example: Create a new composition:
     \`\`\`
     File > New > Composition
     Width: 1920px, Height: 1080px, Frame Rate: 30
     \`\`\`

3. **Panels**:
   - Effects & Presets, Layer, Preview.

**Practice**:
- Open After Effects and create a 1920x1080 composition.
- Import a PNG (e.g., logo) and place it in the timeline.
- Write a 150-word summary of the interface.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "First Animation",
          description: "Create a simple shape animation.",
          type: "TEXT",
          content: `
# First Animation

1. **Create Shape Layer**:
   - Select Rectangle Tool, draw a rectangle.
   - Adjust in Properties: Position, Scale.

2. **Keyframes**:
   - Move playhead to 0s, set Position keyframe.
   - Move to 2s, change Position.
   - Example:
     \`\`\`
     Position at 0s: [960, 540]
     Position at 2s: [960, 200]
     \`\`\`

3. **Preview**:
   - Press Spacebar to preview.

**Practice**:
- Animate a rectangle moving across the screen.
- Export as MP4 (File > Export > Add to Render Queue).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Quiz: Motion Design Basics",
          description: "Test your understanding of motion design and AE.",
          type: "QUIZ",
          content: `
# Quiz: Motion Design Basics

**Instructions**: Answer the following questions.

1. **What is motion design used for?**
   - A) Static images
   - B) Animating graphics
   - C) Database management
   - D) Text editing
   - **Answer**: B

2. **Which panel manages assets?**
   - A) Timeline
   - B) Project
   - C) Composition
   - D) Effects
   - **Answer**: B

3. **How do you preview an animation?**
   - **Answer**: Press Spacebar
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Working with Layers and Keyframes",
      description: "Master layers and keyframe animation techniques.",
      position: 2,
      lessons: [
        {
          title: "Understanding Layers",
          description: "Learn layer types and properties.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Animating with Keyframes",
          description: "Create smooth animations using keyframes.",
          type: "TEXT",
          content: `
# Animating with Keyframes

1. **Transform Properties**:
   - Position, Scale, Rotation, Opacity.
   - Example:
     \`\`\`
     At 0s: Scale 100%, Opacity 100%
     At 3s: Scale 50%, Opacity 0%
     \`\`\`

2. **Easy Ease**:
   - Select keyframes, press F9 for smooth motion.

3. **Graph Editor**:
   - Adjust curves for precise control.

**Practice**:
- Animate a circle scaling and fading out.
- Apply Easy Ease and tweak in Graph Editor.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Layer Parenting",
          description: "Use parenting for complex animations.",
          type: "TEXT",
          content: `
# Layer Parenting

1. **Parenting**:
   - Link layers to inherit properties.
   - Example: Parent a text layer to a shape layer.

2. **Set Up**:
   - In Timeline, drag Parent pick whip to parent layer.

3. **Example**:
   - Animate a shape rotating, text follows.

**Practice**:
- Create a rotating shape with text child layer.
- Animate rotation over 4s.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Keyframe Animation",
          description: "Animate a multi-layer composition.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Keyframe Animation

**Objective**: Create a layered animation.

**Requirements**:
- Create a 1920x1080 composition.
- Use 3 layers (e.g., shape, text, image).
- Animate Position, Scale, and Opacity with keyframes.
- Write a 300-word report on your animation process.

**Submission**:
- Submit your AE project file and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Shape Layers and Animation",
      description: "Create and animate shape layers for motion graphics.",
      position: 3,
      lessons: [
        {
          title: "Introduction to Shape Layers",
          description: "Learn shape layer fundamentals.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating Shapes",
          description: "Design shapes for animation.",
          type: "TEXT",
          content: `
# Creating Shapes

1. **Shape Tools**:
   - Rectangle, Ellipse, Star.
   - Example: Draw a star with 5 points.

2. **Properties**:
   - Fill, Stroke, Transform.
   - Example:
     \`\`\`
     Fill: #FF0000, Stroke: 5px
     \`\`\`

3. **Groups**:
   - Organize multiple shapes in one layer.

**Practice**:
- Create a star and animate its rotation.
- Add a stroke and fill.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Animating Shapes",
          description: "Animate shape properties.",
          type: "TEXT",
          content: `
# Animating Shapes

1. **Path Animation**:
   - Keyframe Shape Path for morphing.
   - Example: Morph a circle to a square.

2. **Trim Paths**:
   - Animate stroke drawing.
   - Example:
     \`\`\`
     Trim Paths: Start 0% at 0s, 100% at 2s
     \`\`\`

**Practice**:
- Animate a shape morphing (e.g., circle to square).
- Use Trim Paths on a stroke.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Shape Animation",
          description: "Create a shape-based motion graphic.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Shape Animation

**Objective**: Design a shape animation.

**Requirements**:
- Create a composition with 3 shape layers.
- Animate paths and use Trim Paths.
- Export as MP4.
- Write a 300-word report on your design choices.

**Submission**:
- Submit your AE project file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Text Animation and Kinetic Typography",
      description: "Master text animations for dynamic typography.",
      position: 4,
      lessons: [
        {
          title: "Introduction to Text Animation",
          description: "Learn text animation techniques.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Basic Text Animation",
          description: "Animate text properties.",
          type: "TEXT",
          content: `
# Basic Text Animation

1. **Text Layer**:
   - Create text with Text Tool.
   - Example: Type "Hello World".

2. **Animator Properties**:
   - Position, Scale, Opacity.
   - Example:
     \`\`\`
     Add Animator > Position, keyframe Y-axis slide-in.
     \`\`\`

3. **Range Selector**:
   - Animate specific characters.

**Practice**:
- Animate text sliding in character by character.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Kinetic Typography",
          description: "Create dynamic typography animations.",
          type: "TEXT",
          content: `
# Kinetic Typography

1. **Text Animators**:
   - Combine Position, Scale, Rotation.
   - Example: Scale up each letter.

2. **Timing**:
   - Use Range Selector for staggered effects.

3. **Effects**:
   - Add Blur for emphasis.

**Practice**:
- Create a 10s kinetic typography animation.
- Use 2 animators and 1 effect.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Kinetic Typography",
          description: "Design a typography animation.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Kinetic Typography

**Objective**: Create a kinetic typography video.

**Requirements**:
- Animate a 15s quote or phrase.
- Use 3 animators and 1 effect.
- Export as MP4.
- Write a 300-word report on typography choices.

**Submission**:
- Submit your AE project file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Working with Effects and Presets",
      description: "Enhance animations with effects and presets.",
      position: 5,
      lessons: [
        {
          title: "Introduction to Effects",
          description: "Explore After Effects effects.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Applying Effects",
          description: "Use common effects like Blur and Glow.",
          type: "TEXT",
          content: `
# Applying Effects

1. **Effects Panel**:
   - Drag effects to layers.
   - Example: Apply Gaussian Blur.

2. **Keyframing Effects**:
   - Animate effect properties.
   - Example:
     \`\`\`
     Blur Radius: 0 at 0s, 20 at 2s
     \`\`\`

3. **Presets**:
   - Apply preset animations (e.g., Text Presets).

**Practice**:
- Apply Gaussian Blur and animate it.
- Use a text preset.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Creating Custom Presets",
          description: "Save and reuse custom effects.",
          type: "TEXT",
          content: `
# Creating Custom Presets

1. **Save Preset**:
   - Select effects, Animation > Save Animation Preset.
   - Example: Save a Blur + Glow combo.

2. **Apply Preset**:
   - Drag from Effects & Presets panel.

**Practice**:
- Create a custom preset with 2 effects.
- Apply to a new layer.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Effects Animation",
          description: "Create an animation with effects.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Effects Animation

**Objective**: Enhance a composition with effects.

**Requirements**:
- Create a 10s animation with 2 layers.
- Apply 3 effects and keyframe them.
- Save 1 custom preset.
- Write a 300-word report on effect choices.

**Submission**:
- Submit your AE project file, preset, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Motion Tracking and Stabilization",
      description: "Track motion and stabilize footage.",
      position: 6,
      lessons: [
        {
          title: "Introduction to Motion Tracking",
          description: "Learn motion tracking basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "2D Motion Tracking",
          description: "Track objects in footage.",
          type: "TEXT",
          content: `
# 2D Motion Tracking

1. **Tracker Panel**:
   - Window > Tracker, select Track Motion.
   - Example: Track a logo onto a moving object.

2. **Apply Tracking**:
   - Attach a null object to track data.
   - Parent a layer to the null.

**Practice**:
- Track a logo onto a moving object in a 5s video.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Stabilization",
          description: "Stabilize shaky footage.",
          type: "TEXT",
          content: `
# Stabilization

1. **Warp Stabilizer**:
   - Effects > Distort > Warp Stabilizer.
   - Apply to footage.

2. **Adjust Settings**:
   - Smoothness, Crop Less Scale More.

**Practice**:
- Stabilize a 5s shaky video clip.
- Export stabilized video.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Motion Tracking",
          description: "Track and stabilize footage.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Motion Tracking

**Objective**: Apply tracking and stabilization.

**Requirements**:
- Track a text layer onto a 10s video.
- Stabilize a 5s shaky clip.
- Export both as MP4.
- Write a 300-word report on tracking process.

**Submission**:
- Submit your AE project files, MP4s, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Expressions in After Effects",
      description: "Automate animations with expressions.",
      position: 7,
      lessons: [
        {
          title: "Introduction to Expressions",
          description: "Learn expression basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Basic Expressions",
          description: "Use simple expressions for animation.",
          type: "TEXT",
          content: `
# Basic Expressions

1. **Wiggle Expression**:
   - Apply to Position:
     \`\`\`javascript
     wiggle(5, 50)
     \`\`\`
   - 5 times/sec, 50px amplitude.

2. **Time Expression**:
   - Rotate continuously:
     \`\`\`javascript
     time * 100
     \`\`\`

**Practice**:
- Apply wiggle to a shape’s position.
- Use time expression for rotation.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Looping Animations",
          description: "Create looping animations with expressions.",
          type: "TEXT",
          content: `
# Looping Animations

1. **LoopOut**:
   - Apply to keyframes:
     \`\`\`javascript
     loopOut("cycle")
     \`\`\`

2. **Example**:
   - Animate scale pulsing and loop.

**Practice**:
- Create a pulsing shape animation.
- Apply loopOut expression.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Expressions",
          description: "Automate an animation with expressions.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Expressions

**Objective**: Use expressions for automation.

**Requirements**:
- Create a 10s animation with 2 layers.
- Use wiggle and loopOut expressions.
- Export as MP4.
- Write a 300-word report on expression benefits.

**Submission**:
- Submit your AE project file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Character Animation Basics",
      description: "Learn basic character rigging and animation.",
      position: 8,
      lessons: [
        {
          title: "Introduction to Character Animation",
          description: "Explore character animation in After Effects.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Rigging with Duik Angela",
          description: "Rig a character using Duik Angela.",
          type: "TEXT",
          content: `
# Rigging with Duik Angela

1. **Install Duik**:
   - Download from rainboxprod.coop.
   - Enable in AE: Window > Duik Angela.

2. **Rigging**:
   - Create limbs, add bones.
   - Example: Rig an arm with 2 bones.

3. **Controllers**:
   - Add IK controllers for animation.

**Practice**:
- Rig a simple 2D character (e.g., arm and leg).
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Animating a Character",
          description: "Animate a rigged character.",
          type: "TEXT",
          content: `
# Animating a Character

1. **Keyframing**:
   - Animate controllers for walk cycle.
   - Example: Keyframe arm swing over 2s.

2. **Timing**:
   - Use Easy Ease for natural motion.

**Practice**:
- Animate a 5s walk cycle for a rigged character.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Character Animation",
          description: "Create a character animation.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Character Animation

**Objective**: Animate a rigged character.

**Requirements**:
- Rig a character using Duik Angela.
- Animate a 10s sequence (e.g., walk or wave).
- Export as MP4.
- Write a 300-word report on rigging process.

**Submission**:
- Submit your AE project file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Data-Driven Animations",
      description: "Create animations using external data.",
      position: 9,
      lessons: [
        {
          title: "Introduction to Data-Driven Animation",
          description: "Learn data-driven animation concepts.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Importing CSV Data",
          description: "Use CSV data for animations.",
          type: "TEXT",
          content: `
# Importing CSV Data

1. **Prepare CSV**:
   - Example: Sales data (region, value).
   - Save as data.csv.

2. **Import**:
   - Use script (e.g., CSVtoAE.jsx).
   - Example:
     \`\`\`javascript
     var data = footage("data.csv").sourceData;
     \`\`\`

3. **Animate**:
   - Link data to text or shape properties.

**Practice**:
- Import a CSV and animate a bar chart.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Dynamic Infographics",
          description: "Create data-driven infographics.",
          type: "TEXT",
          content: `
# Dynamic Infographics

1. **Shapes from Data**:
   - Use expressions to scale bars.
   - Example:
     \`\`\`javascript
     data[0][1] * 10
     \`\`\`

2. **Text from Data**:
   - Link text to CSV values.

**Practice**:
- Create a 10s infographic with 3 data-driven elements.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: Data-Driven Animation",
          description: "Create a data-driven motion graphic.",
          type: "ASSIGNMENT",
          content: `
# Assignment: Data-Driven Animation

**Objective**: Animate with data.

**Requirements**:
- Use a CSV dataset (e.g., sales, weather).
- Create a 15s infographic animation.
- Export as MP4.
- Write a 300-word report on data integration.

**Submission**:
- Submit your AE project file, CSV, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "3D and Fake 3D Animation",
      description: "Explore 3D and fake 3D techniques.",
      position: 10,
      lessons: [
        {
          title: "Introduction to 3D in After Effects",
          description: "Learn 3D layer basics.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "3D Layers",
          description: "Create and animate 3D layers.",
          type: "TEXT",
          content: `
# 3D Layers

1. **Enable 3D**:
   - Toggle 3D switch in Timeline.
   - Example: Rotate a text layer in 3D.

2. **Camera**:
   - Create a camera (Layer > New > Camera).
   - Animate camera position.

**Practice**:
- Animate a 3D text layer with a camera.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Fake 3D Techniques",
          description: "Simulate 3D with 2D layers.",
          type: "TEXT",
          content: `
# Fake 3D Techniques

1. **Parallax**:
   - Offset layers in Z-space.
   - Example: Background moves slower than foreground.

2. **Expressions**:
   - Link scale to Z-position.

**Practice**:
- Create a fake 3D scene with 3 layers.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: 3D Animation",
          description: "Create a 3D or fake 3D animation.",
          type: "ASSIGNMENT",
          content: `
# Assignment: 3D Animation

**Objective**: Create a 3D animation.

**Requirements**:
- Create a 10s animation using 3D layers or fake 3D.
- Include a camera or parallax effect.
- Export as MP4.
- Write a 300-word report on 3D techniques.

**Submission**:
- Submit your AE project file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Advanced Visual Effects",
      description: "Create professional VFX with After Effects.",
      position: 11,
      lessons: [
        {
          title: "Introduction to VFX",
          description: "Learn VFX techniques in After Effects.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Chroma Keying",
          description: "Remove green screen backgrounds.",
          type: "TEXT",
          content: `
# Chroma Keying

1. **Keylight**:
   - Effects > Keying > Keylight (1.2).
   - Select green color to key out.

2. **Refine Edge**:
   - Adjust Spill Suppression, Edge Matte.

**Practice**:
- Key out a green screen clip (5s).
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Rotoscoping",
          description: "Isolate objects with rotoscoping.",
          type: "TEXT",
          content: `
# Rotoscoping

1. **Roto Brush**:
   - Select Roto Brush Tool, paint over object.
   - Propagate frames.

2. **Refine**:
   - Adjust edge detection.

**Practice**:
- Rotoscope a 5s clip to isolate an object.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Assignment: VFX Project",
          description: "Create a VFX composition.",
          type: "ASSIGNMENT",
          content: `
# Assignment: VFX Project

**Objective**: Create a VFX sequence.

**Requirements**:
- Create a 15s VFX composition.
- Use chroma keying or rotoscoping.
- Export as MP4.
- Write a 300-word report on VFX techniques.

**Submission**:
- Submit your AE project file, MP4, and report.
          `,
          duration: 2400, // 40 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
    {
      title: "Capstone: Motion Design Portfolio Project",
      description: "Build a professional motion design portfolio piece.",
      position: 12,
      lessons: [
        {
          title: "Planning a Portfolio Project",
          description: "Plan a motion design project.",
          type: "VIDEO",
          videoUrl: "https://www.youtube.com/watch?v=placeholder", // Placeholder
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Storyboarding",
          description: "Create a storyboard for your project.",
          type: "TEXT",
          content: `
# Storyboarding

1. **Sketch Ideas**:
   - Outline a 30s animation (e.g., product ad).
   - Example: Scene 1: Logo reveal, Scene 2: Text animation.

2. **Tools**:
   - Use Photoshop or paper for sketches.

**Practice**:
- Create a storyboard for a 30s animation.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: true,
        },
        {
          title: "Building the Animation",
          description: "Develop your portfolio animation.",
          type: "TEXT",
          content: `
# Building the Animation

1. **Assets**:
   - Import Photoshop/Illustrator assets.
   - Example: Import a logo and background.

2. **Animation**:
   - Combine shapes, text, effects, and tracking.

**Practice**:
- Build the first 15s of your animation.
- Export as MP4.
- Summarize in 150 words.
          `,
          duration: 600, // 10 minutes
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Final Project: Portfolio Piece",
          description: "Complete a professional motion design project.",
          type: "ASSIGNMENT",
          content: `
# Final Project: Portfolio Piece

**Objective**: Create a portfolio animation.

**Requirements**:
- Create a 30s motion design piece (e.g., ad, intro).
- Use 3 techniques (e.g., text animation, VFX, data-driven).
- Export as MP4.
- Develop a 5–7 slide presentation.
- Write a 400-word reflection.

**Submission**:
- Submit your AE project file, MP4, presentation, and reflection.
          `,
          duration: 10800, // 180 minutes (3 hours)
          position: lessonPosition++,
          isPreview: false,
        },
        {
          title: "Quiz: Motion Design Portfolio",
          description: "Test your knowledge of motion design projects.",
          type: "QUIZ",
          content: `
# Quiz: Motion Design Portfolio

**Instructions**: Answer the following questions.

1. **What is the first step in a motion design project?**
   - A) Animation
   - B) Storyboarding
   - C) Exporting
   - D) Effects
   - **Answer**: B

2. **Why use a storyboard?**
   - A) Final animation
   - B) Plan scenes
   - C) Write code
   - D) Track motion
   - **Answer**: B

3. **What should a portfolio presentation include?**
   - **Answer**: Concept, process, final animation, challenges.
          `,
          duration: 300, // 5 minutes
          position: lessonPosition++,
          isPreview: false,
        },
      ],
    },
  ];

  // Create modules and lessons with error handling
  for (const moduleData of modulesData) {
    console.log(`Creating module: ${moduleData.title}`);
    try {
      const createdModule = await prisma.module.create({
        data: {
          title: moduleData.title,
          description: moduleData.description,
          position: moduleData.position,
          courseId: course.id,
          lessons: {
            create: moduleData.lessons.map((lesson) => {
              console.log(`  Creating lesson: ${lesson.title}`);
              return {
                title: lesson.title,
                description: lesson.description,
                type: lesson.type,
                videoUrl: lesson.videoUrl || null,
                content: lesson.content || null,
                duration: lesson.duration,
                position: lesson.position,
                isPreview: lesson.isPreview,
              };
            }),
          },
        },
      });
      console.log(`Successfully created module: ${createdModule.title}`);
    } catch (error) {
      console.error(`Error creating module ${moduleData.title}:`, error);
      throw error;
    }
  }

  console.log(
    `Successfully seeded ${modulesData.length} modules and ${
      lessonPosition - 1
    } lessons for course: ${course.title}`
  );
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma client...");
    await prisma.$disconnect();
  });
